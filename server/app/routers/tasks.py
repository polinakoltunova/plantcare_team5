from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session, joinedload
from sqlalchemy.sql import func

from app.database import get_db
from app.dependencies import get_current_user
from app.models.models import CareTask, CareTaskHistory, TaskStatus, User, Plant, CareOperation, Location
from app.schemas.tasks import TaskOut, TaskActionRequest, TaskHistoryOut, TaskCreate, TaskUpdate

router = APIRouter(prefix="/tasks", tags=["Tasks"])


def _is_admin(user: User) -> bool:
   try:
       return bool(user.role and user.role.name == "admin")
   except Exception:
       return False


def _resolve_task_status(db: Session, status_name: str | None, default: str = "planned") -> int | None:
   target = status_name or default
   row = db.query(TaskStatus).filter(TaskStatus.name == target).first()
   if not row:
       raise HTTPException(status_code=500, detail=f"Task status '{target}' is not configured")
   return row.id


def _format_user_name(user: User | None) -> str | None:
   if not user:
       return None
   full_name = " ".join(part for part in [user.first_name, user.last_name] if part)
   return full_name or user.username


def _serialize_task(db: Session, t: CareTask) -> dict:
   plant = db.query(Plant).options(joinedload(Plant.location).joinedload(Location.zone)).filter(Plant.id == t.plant_id).first() if t.plant_id else None
   operation = db.query(CareOperation).filter(CareOperation.id == t.operation_id).first()
   assigned_user = db.query(User).filter(User.id == t.assigned_user_id).first() if t.assigned_user_id else None

   zone = plant.location.zone if plant and plant.location else None

   plant_name = None
   if plant:
       plant_name = plant.inventory_number

   return {
       "id": t.id,
       "planned_date": t.planned_date,
       "due_date": t.due_date,
       "completed_at": t.completed_at,
       "comment": t.comment,
       "status": t.status.name if t.status else None,
       "created_by": t.created_by,
       "assigned_user_id": t.assigned_user_id,
       "plant_id": t.plant_id,
       "operation_id": t.operation_id,
       "zone_id": zone.id if zone else None,
       "operation_name": operation.name if operation else None,
       "plant_name": plant_name,
       "zone_name": zone.name if zone else None,
       "assigned_user": _format_user_name(assigned_user),
   }


@router.get("", response_model=list[TaskOut])
def list_tasks(
   status_name: str | None = Query(default=None, alias="status"),
   assigned_user_id: UUID | None = Query(default=None),
   db: Session = Depends(get_db),
   current_user: User = Depends(get_current_user),
):
   q = db.query(CareTask).options(joinedload(CareTask.status))

   if assigned_user_id:
       if assigned_user_id != current_user.id and not _is_admin(current_user):
           raise HTTPException(status_code=403, detail="Forbidden")
       q = q.filter(CareTask.assigned_user_id == assigned_user_id)
   else:
       if not _is_admin(current_user):
           q = q.filter(
               (CareTask.assigned_user_id == current_user.id) |
               (CareTask.created_by == current_user.id)
           )

   if status_name:
       q = q.join(CareTask.status).filter(TaskStatus.name == status_name)

   tasks = q.order_by(CareTask.planned_date).all()
   return [_serialize_task(db, t) for t in tasks]


@router.get("/{task_id}", response_model=TaskOut)
def get_task(
   task_id: UUID,
   db: Session = Depends(get_db),
   current_user: User = Depends(get_current_user),
):
   t = db.query(CareTask).options(joinedload(CareTask.status)).filter(CareTask.id == task_id).first()
   if not t:
       raise HTTPException(status_code=404, detail="Task not found")

   if not _is_admin(current_user) and t.assigned_user_id not in (None, current_user.id) and t.created_by != current_user.id:
       raise HTTPException(status_code=403, detail="Forbidden")

   return _serialize_task(db, t)


@router.post("", response_model=TaskOut, status_code=status.HTTP_201_CREATED)
def create_task(
   payload: TaskCreate,
   db: Session = Depends(get_db),
   current_user: User = Depends(get_current_user),
):
   task = CareTask(
       plant_id=payload.plant_id,
       operation_id=payload.operation_id,
       assigned_user_id=payload.assigned_user_id,
       planned_date=payload.planned_date,
       due_date=payload.due_date,
       status_id=_resolve_task_status(db, None, default="planned"),
       created_by=current_user.id,
       comment=payload.comment,
   )
   db.add(task)
   db.commit()
   db.refresh(task)

   task = db.query(CareTask).options(joinedload(CareTask.status)).filter(CareTask.id == task.id).first()
   return _serialize_task(db, task)


@router.put("/{task_id}", response_model=TaskOut)
def update_task(
   task_id: UUID,
   payload: TaskUpdate,
   db: Session = Depends(get_db),
   current_user: User = Depends(get_current_user),
):
   task = db.query(CareTask).options(joinedload(CareTask.status)).filter(CareTask.id == task_id).first()
   if not task:
       raise HTTPException(status_code=404, detail="Task not found")

   if not _is_admin(current_user) and task.created_by != current_user.id:
       raise HTTPException(status_code=403, detail="Forbidden")

   if payload.plant_id is not None:
       task.plant_id = payload.plant_id
   if payload.operation_id is not None:
       task.operation_id = payload.operation_id
   if payload.assigned_user_id is not None:
       task.assigned_user_id = payload.assigned_user_id
   if payload.planned_date is not None:
       task.planned_date = payload.planned_date
   if payload.due_date is not None:
       task.due_date = payload.due_date
   if payload.comment is not None:
       task.comment = payload.comment
   if payload.status is not None:
       task.status_id = _resolve_task_status(db, payload.status, default=payload.status)

   db.commit()
   return _serialize_task(db, task)


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(
   task_id: UUID,
   db: Session = Depends(get_db),
   current_user: User = Depends(get_current_user),
):
   task = db.query(CareTask).filter(CareTask.id == task_id).first()
   if not task:
       raise HTTPException(status_code=404, detail="Task not found")

   if not _is_admin(current_user) and task.created_by != current_user.id:
       raise HTTPException(status_code=403, detail="Forbidden")

   db.delete(task)
   db.commit()
   return None


def _set_task_status(db: Session, task: CareTask, status_str: str) -> int:
   st = db.query(TaskStatus).filter(TaskStatus.name == status_str).first()
   if not st:
       raise HTTPException(
           status_code=500,
           detail=f"Task status '{status_str}' is not configured in DB (table task_statuses).",
       )
   task.status_id = st.id
   return st.id


@router.post("/{task_id}/complete")
def complete_task(
   task_id: UUID,
   payload: TaskActionRequest,
   db: Session = Depends(get_db),
   current_user: User = Depends(get_current_user),
):
   task = db.query(CareTask).filter(CareTask.id == task_id).first()
   if not task:
       raise HTTPException(status_code=404, detail="Task not found")

   if not _is_admin(current_user) and task.assigned_user_id != current_user.id:
       raise HTTPException(status_code=403, detail="Not your task")

   done_id = _set_task_status(db, task, "done")
   task.completed_at = func.now()

   hist = CareTaskHistory(
       task_id=task.id,
       action_type="complete",
       performed_by=current_user.id,
       status_id=done_id,
       notes=payload.notes or "Задача выполнена",
   )
   db.add(hist)
   db.commit()
   return {"message": "Task completed"}


@router.post("/{task_id}/problem")
def report_problem(
   task_id: UUID,
   payload: TaskActionRequest,
   db: Session = Depends(get_db),
   current_user: User = Depends(get_current_user),
):
   task = db.query(CareTask).filter(CareTask.id == task_id).first()
   if not task:
       raise HTTPException(status_code=404, detail="Task not found")

   if not _is_admin(current_user) and task.assigned_user_id != current_user.id:
       raise HTTPException(status_code=403, detail="Not your task")

   problem_id = _set_task_status(db, task, "problem")

   hist = CareTaskHistory(
       task_id=task.id,
       action_type="problem",
       performed_by=current_user.id,
       status_id=problem_id,
       notes=payload.notes or "Зафиксирована проблема",
   )
   db.add(hist)
   db.commit()
   return {"message": "Problem reported"}


@router.get("/{task_id}/history", response_model=list[TaskHistoryOut])
def get_history(
   task_id: UUID,
   db: Session = Depends(get_db),
   current_user: User = Depends(get_current_user),
):
   task = db.query(CareTask).filter(CareTask.id == task_id).first()
   if not task:
       raise HTTPException(status_code=404, detail="Task not found")

   if not _is_admin(current_user) and task.assigned_user_id != current_user.id and task.created_by != current_user.id:
       raise HTTPException(status_code=403, detail="Forbidden")

   items = (
       db.query(CareTaskHistory)
       .options(joinedload(CareTaskHistory.status))
       .filter(CareTaskHistory.task_id == task_id)
       .order_by(CareTaskHistory.performed_at)
       .all()
   )

   return [
       {
           "id": h.id,
           "result_status": h.status.name if h.status else h.action_type,
           "notes": h.notes,
       }
       for h in items
   ]

