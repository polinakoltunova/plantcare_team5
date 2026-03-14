from __future__ import annotations

from datetime import datetime
from decimal import Decimal
from uuid import UUID
from pydantic import BaseModel


class ClimateMeasurementCreate(BaseModel):
   zone_id: UUID
   temperature: Decimal | None = None
   humidity: Decimal | None = None
   measured_at: datetime | None = None


class ClimateMeasurementOut(BaseModel):
   id: UUID
   location_id: UUID
   zone_id: UUID | None = None
   temperature: Decimal | None = None
   humidity: Decimal | None = None
   measured_at: datetime

   class Config:
       from_attributes = True
