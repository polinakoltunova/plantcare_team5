from __future__ import annotations

from datetime import date
from uuid import UUID
from pydantic import BaseModel


class PlantOut(BaseModel):
    id: UUID
    inventory_number: str
    planting_date: date | None = None
    notes: str | None = None

    # fields expected by frontend
    status: str | None = None
    origin_country: str | None = None
    estimated_age_years: int | None = None

    class Config:
        from_attributes = True
