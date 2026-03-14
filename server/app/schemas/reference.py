from __future__ import annotations

from uuid import UUID
from pydantic import BaseModel


class CareOperationOut(BaseModel):
   id: UUID
   name: str
   description: str | None = None
   default_duration_minutes: int | None = None

   class Config:
       from_attributes = True


class SpeciesOut(BaseModel):
   id: UUID
   scientific_name: str
   common_name: str | None = None
   origin_country: str | None = None

   class Config:
       from_attributes = True


class UserOut(BaseModel):
   id: UUID
   username: str
   first_name: str | None = None
   last_name: str | None = None
   email: str

   class Config:
       from_attributes = True
