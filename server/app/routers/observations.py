from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models.models import Observation, User, Plant
from app.schemas.observations import ObservationCreate, ObservationOut

router = APIRouter(prefix="/observations", tags=["Observations"])


def _serialize_observation(item: Observation) -> dict:
   return {
       "id": item.id,
       "plant_id": item.plant_id,
       "task_id": item.task_id,
       "created_by": item.created_by,
       "type": item.observation_type,
       "description": item.description,
       "health_status": item.health_status,
       "severity": item.severity,
       "photo_url": item.photo_url,
       "created_at": item.created_at,
   }


@router.get("", response_model=list[ObservationOut])
def list_observations(
   plant_id: UUID | None = Query(default=None),
   zone_id: UUID | None = Query(default=None),
   task_id: UUID | None = Query(default=None),
   db: Session = Depends(get_db),
   _user: User = Depends(get_current_user),
):
   q = db.query(Observation)

   if plant_id:
       q = q.filter(Observation.plant_id == plant_id)
   if task_id:
       q = q.filter(Observation.task_id == task_id)

   # zone_id клиент отправляет, но в observations его нет.
   # Фильтруем через plant -> location -> zone при необходимости.
   if zone_id:
       q = (
           q.join(Plant, Plant.id == Observation.plant_id)
            .filter(Plant.location.has(zone_id=zone_id))
       )

   items = q.order_by(Observation.created_at.desc()).all()
   return [_serialize_observation(item) for item in items]


@router.get("/{observation_id}", response_model=ObservationOut)
def get_observation(
   observation_id: UUID,
   db: Session = Depends(get_db),
   _user: User = Depends(get_current_user),
):
   item = db.query(Observation).filter(Observation.id == observation_id).first()
   if not item:
       raise HTTPException(status_code=404, detail="Observation not found")
   return _serialize_observation(item)


@router.post("", response_model=ObservationOut, status_code=status.HTTP_201_CREATED)
def create_observation(
   payload: ObservationCreate,
   db: Session = Depends(get_db),
   current_user: User = Depends(get_current_user),
):
   item = Observation(
       plant_id=payload.plant_id,
       task_id=payload.task_id,
       created_by=current_user.id,
       observation_type=payload.type,
       description=payload.description,
       health_status=payload.health_status,
       severity=payload.severity,
       photo_url=payload.photo_url,
   )
   db.add(item)
   db.commit()
   db.refresh(item)
   return _serialize_observation(item)
