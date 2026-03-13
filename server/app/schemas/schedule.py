from __future__ import annotations

from uuid import UUID
from pydantic import BaseModel


class ScheduleOut(BaseModel):
    id: UUID
    operation_id: UUID
    operation_name: str
    frequency_days: int | None = None

    class Config:
        from_attributes = True
