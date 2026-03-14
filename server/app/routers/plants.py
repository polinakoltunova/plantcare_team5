from __future__ import annotations

from datetime import date
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.dependencies import get_current_user
from app.models.models import Plant, User, CareSchedule, Location, PlantStatus
from app.schemas.plants import PlantOut, PlantCreate, PlantUpdate
from app.schemas.schedule import ScheduleOut

router = APIRouter(prefix="/plants", tags=["Plants"])


def _calc_age_years(planting_date: date | None) -> int | None:
   if not planting_date:
       return None
   today = date.today()
   years = (today - planting_date).days // 365
   return max(years, 0)


def _serialize_plant(p: Plant) -> dict:
   zone = p.location.zone if p.location else None
   species = p.species
   return {
       "id": p.id,
       "species_id": p.species_id,
       "zone_id": zone.id if zone else None,
       "location_id": p.location_id,
       "inventory_number": p.inventory_number,
       "planting_date": p.planting_date,
       "notes": p.notes,
       "status": p.status.name if p.status else None,
       "origin_country": species.origin_country if species else None,
       "estimated_age_years": _calc_age_years(p.planting_date),
       "common_name": species.common_name if species else None,
       "scientific_name": species.scientific_name if species else None,
       "zone_name": zone.name if zone else None,
   }


def _resolve_location_by_zone(db: Session, zone_id: UUID) -> Location:
   location = db.query(Location).filter(Location.zone_id == zone_id).order_by(Location.name).first()
   if not location:
       raise HTTPException(
           status_code=status.HTTP_400_BAD_REQUEST,
           detail="В выбранной зоне нет ни одной location. Нельзя создать растение только по zone_id."
       )
   return location


def _resolve_status_id(db: Session, status_name: str | None) -> int | None:
   if not status_name:
       return None
   status_row = db.query(PlantStatus).filter(PlantStatus.name == status_name).first()
   if not status_row:
       raise HTTPException(
           status_code=status.HTTP_400_BAD_REQUEST,
           detail=f"Plant status '{status_name}' not found"
       )
   return status_row.id


@router.get("", response_model=list[PlantOut])
def list_plants(
   zone_id: UUID | None = Query(default=None, description="climate_zones.id"),
   search: str | None = Query(default=None, description="Поиск по inventory_number"),
   db: Session = Depends(get_db),
   _user: User = Depends(get_current_user),
):
   q = (
       db.query(Plant)
       .options(
           joinedload(Plant.species),
           joinedload(Plant.status),
           joinedload(Plant.location).joinedload(Location.zone),
       )
   )

   if zone_id:
       q = q.join(Plant.location).filter(Location.zone_id == zone_id)

   if search:
       q = q.filter(Plant.inventory_number.ilike(f"%{search}%"))

   plants = q.order_by(Plant.inventory_number).all()
   return [_serialize_plant(p) for p in plants]


@router.get("/{plant_id}", response_model=PlantOut)
def get_plant(
   plant_id: UUID,
   db: Session = Depends(get_db),
   _user: User = Depends(get_current_user),
):
   p = (
       db.query(Plant)
       .options(
           joinedload(Plant.species),
           joinedload(Plant.status),
           joinedload(Plant.location).joinedload(Location.zone),
       )
       .filter(Plant.id == plant_id)
       .first()
   )
   if not p:
       raise HTTPException(status_code=404, detail="Plant not found")

   return _serialize_plant(p)


@router.post("", response_model=PlantOut, status_code=status.HTTP_201_CREATED)
def create_plant(
   payload: PlantCreate,
   db: Session = Depends(get_db),
   _user: User = Depends(get_current_user),
):
   exists = db.query(Plant).filter(Plant.inventory_number == payload.inventory_number).first()
   if exists:
       raise HTTPException(status_code=400, detail="inventory_number already exists")

   location = _resolve_location_by_zone(db, payload.zone_id)
   status_id = _resolve_status_id(db, payload.status)

   plant = Plant(
       species_id=payload.species_id,
       location_id=location.id,
       inventory_number=payload.inventory_number,
       planting_date=payload.planting_date,
       status_id=status_id,
       notes=payload.notes,
   )
   db.add(plant)
   db.commit()
   db.refresh(plant)

   plant = (
       db.query(Plant)
       .options(
           joinedload(Plant.species),
           joinedload(Plant.status),
           joinedload(Plant.location).joinedload(Location.zone),
       )
       .filter(Plant.id == plant.id)
       .first()
   )
   return _serialize_plant(plant)


@router.put("/{plant_id}", response_model=PlantOut)
def update_plant(
   plant_id: UUID,
   payload: PlantUpdate,
   db: Session = Depends(get_db),
   _user: User = Depends(get_current_user),
):
   plant = db.query(Plant).filter(Plant.id == plant_id).first()
   if not plant:
       raise HTTPException(status_code=404, detail="Plant not found")

   if payload.species_id is not None:
       plant.species_id = payload.species_id
   if payload.zone_id is not None:
       location = _resolve_location_by_zone(db, payload.zone_id)
       plant.location_id = location.id
   if payload.inventory_number is not None:
       plant.inventory_number = payload.inventory_number
   if payload.planting_date is not None:
       plant.planting_date = payload.planting_date
   if payload.notes is not None:
       plant.notes = payload.notes
   if payload.status is not None:
       plant.status_id = _resolve_status_id(db, payload.status)

   db.commit()

   plant = (
       db.query(Plant)
       .options(
           joinedload(Plant.species),
           joinedload(Plant.status),
           joinedload(Plant.location).joinedload(Location.zone),
       )
       .filter(Plant.id == plant_id)
       .first()
   )
   return _serialize_plant(plant)


@router.delete("/{plant_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_plant(
   plant_id: UUID,
   db: Session = Depends(get_db),
   _user: User = Depends(get_current_user),
):
   plant = db.query(Plant).filter(Plant.id == plant_id).first()
   if not plant:
       raise HTTPException(status_code=404, detail="Plant not found")

   db.delete(plant)
   db.commit()
   return None


@router.get("/{plant_id}/schedule", response_model=list[ScheduleOut])
def get_schedule(
   plant_id: UUID,
   db: Session = Depends(get_db),
   _user: User = Depends(get_current_user),
):
   p = db.query(Plant).options(joinedload(Plant.species)).filter(Plant.id == plant_id).first()
   if not p:
       raise HTTPException(status_code=404, detail="Plant not found")

   schedules = (
       db.query(CareSchedule)
       .options(joinedload(CareSchedule.operation))
       .filter(CareSchedule.species_id == p.species_id)
       .all()
   )

   return [
       {
           "id": s.id,
           "operation_id": s.operation_id,
           "operation_name": s.operation.name if s.operation else "",
           "frequency_days": s.frequency_days,
       }
       for s in schedules
   ]
