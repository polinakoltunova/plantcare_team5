from __future__ import annotations

from datetime import datetime
from uuid import UUID
from pydantic import BaseModel


class ObservationCreate(BaseModel):
   plant_id: UUID
   zone_id: UUID | None = None  # принимаем, но не храним
   task_id: UUID | None = None
   created_by: UUID | None = None  # игнорируем, берём current_user.id
   type: str
   description: str
   health_status: str | None = None
   severity: int | None = None
   photo_url: str | None = None


class ObservationOut(BaseModel):
   id: UUID
   plant_id: UUID
   task_id: UUID | None = None
   created_by: UUID
   type: str
   description: str
   health_status: str | None = None
   severity: int | None = None
   photo_url: str | None = None
   created_at: datetime | None = None

   class Config:
       from_attributes = True
