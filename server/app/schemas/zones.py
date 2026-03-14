from __future__ import annotations

from decimal import Decimal
from uuid import UUID
from pydantic import BaseModel


class ZoneOut(BaseModel):
   id: UUID
   name: str
   description: str | None = None
   greenhouse_id: UUID | None = None
   target_temperature_min: Decimal | None = None
   target_temperature_max: Decimal | None = None
   target_humidity_min: Decimal | None = None
   target_humidity_max: Decimal | None = None

   class Config:
       from_attributes = True
