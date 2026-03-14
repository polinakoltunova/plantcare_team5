from __future__ import annotations

from datetime import date
from uuid import UUID
from pydantic import BaseModel


class PlantBase(BaseModel):
   inventory_number: str
   planting_date: date | None = None
   notes: str | None = None


class PlantCreate(BaseModel):
   species_id: UUID
   zone_id: UUID
   inventory_number: str
   planting_date: date | None = None
   notes: str | None = None
   status: str | None = None
   origin_country: str | None = None
   estimated_age_years: int | None = None


class PlantUpdate(BaseModel):
   species_id: UUID | None = None
   zone_id: UUID | None = None
   inventory_number: str | None = None
   planting_date: date | None = None
   notes: str | None = None
   status: str | None = None


class PlantOut(BaseModel):
   id: UUID
   species_id: UUID | None = None
   zone_id: UUID | None = None
   location_id: UUID | None = None

   inventory_number: str
   planting_date: date | None = None
   notes: str | None = None

   status: str | None = None
   origin_country: str | None = None
   estimated_age_years: int | None = None

   common_name: str | None = None
   scientific_name: str | None = None
   zone_name: str | None = None

   class Config:
       from_attributes = True

