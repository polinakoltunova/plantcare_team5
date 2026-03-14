from __future__ import annotations

from datetime import datetime
from uuid import UUID
from pydantic import BaseModel


class TaskCreate(BaseModel):
   plant_id: UUID | None = None
   zone_id: UUID | None = None  # принимаем для совместимости с клиентом
   operation_id: UUID
   assigned_user_id: UUID | None = None
   planned_date: datetime
   due_date: datetime | None = None
   created_by: UUID | None = None  # игнорируем, берём current_user.id
   comment: str | None = None


class TaskUpdate(BaseModel):
   plant_id: UUID | None = None
   zone_id: UUID | None = None
   operation_id: UUID | None = None
   assigned_user_id: UUID | None = None
   planned_date: datetime | None = None
   due_date: datetime | None = None
   comment: str | None = None
   status: str | None = None


class TaskOut(BaseModel):
   id: UUID
   planned_date: datetime | None = None
   due_date: datetime | None = None
   completed_at: datetime | None = None
   comment: str | None = None

   status: str | None = None

   created_by: UUID | None = None
   assigned_user_id: UUID | None = None
   plant_id: UUID | None = None
   operation_id: UUID

   zone_id: UUID | None = None
   operation_name: str | None = None
   plant_name: str | None = None
   zone_name: str | None = None
   assigned_user: str | None = None

   class Config:
       from_attributes = True


class TaskActionRequest(BaseModel):
   task_id: UUID | None = None
   performed_by: UUID | None = None
   result_status: str | None = None
   notes: str | None = None


class TaskHistoryOut(BaseModel):
   id: UUID
   result_status: str | None = None
   notes: str | None = None

   class Config:
       from_attributes = True

