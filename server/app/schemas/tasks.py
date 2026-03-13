from __future__ import annotations

from datetime import datetime
from uuid import UUID
from pydantic import BaseModel


class TaskOut(BaseModel):
    id: UUID
    planned_date: datetime | None = None
    due_date: datetime | None = None
    completed_at: datetime | None = None
    comment: str | None = None

    # frontend expects status string
    status: str | None = None

    created_by: UUID | None = None
    assigned_user_id: UUID | None = None
    plant_id: UUID | None = None
    operation_id: UUID

    class Config:
        from_attributes = True


class TaskActionRequest(BaseModel):
    # frontend sends these, but backend will not trust performed_by
    task_id: UUID | None = None
    performed_by: UUID | None = None
    result_status: str | None = None  # "done" / "problem"
    notes: str | None = None


class TaskHistoryOut(BaseModel):
    id: UUID
    result_status: str | None = None
    notes: str | None = None

    class Config:
        from_attributes = True
