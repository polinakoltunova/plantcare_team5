from __future__ import annotations

from datetime import datetime, timezone
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models.models import ClimateMeasurement, User, Location
from app.schemas.climate import ClimateMeasurementCreate, ClimateMeasurementOut

router = APIRouter(prefix="/climate", tags=["Climate"])


def _resolve_location_by_zone(db: Session, zone_id: UUID) -> Location:
   location = db.query(Location).filter(Location.zone_id == zone_id).order_by(Location.name).first()
   if not location:
       raise HTTPException(status_code=400, detail="No location found for this zone")
   return location


def _serialize_measurement(item: ClimateMeasurement, zone_id: UUID | None = None) -> dict:
   return {
       "id": item.id,
       "location_id": item.location_id,
       "zone_id": zone_id,
       "temperature": item.temperature,
       "humidity": item.humidity,
       "measured_at": item.measured_at,
   }


@router.get("", response_model=list[ClimateMeasurementOut])
def list_measurements(
   zone_id: UUID | None = Query(default=None),
   db: Session = Depends(get_db),
   _user: User = Depends(get_current_user),
):
   q = db.query(ClimateMeasurement)

   if zone_id:
       q = q.join(Location).filter(Location.zone_id == zone_id)

   items = q.order_by(ClimateMeasurement.measured_at.desc()).all()
   result = []
   for item in items:
       location = db.query(Location).filter(Location.id == item.location_id).first()
       result.append(_serialize_measurement(item, location.zone_id if location else None))
   return result


@router.get("/{measurement_id}", response_model=ClimateMeasurementOut)
def get_measurement(
   measurement_id: UUID,
   db: Session = Depends(get_db),
   _user: User = Depends(get_current_user),
):
   item = db.query(ClimateMeasurement).filter(ClimateMeasurement.id == measurement_id).first()
   if not item:
       raise HTTPException(status_code=404, detail="Climate measurement not found")

   location = db.query(Location).filter(Location.id == item.location_id).first()
   return _serialize_measurement(item, location.zone_id if location else None)


@router.post("", response_model=ClimateMeasurementOut, status_code=status.HTTP_201_CREATED)
def create_measurement(
   payload: ClimateMeasurementCreate,
   db: Session = Depends(get_db),
   _user: User = Depends(get_current_user),
):
   location = _resolve_location_by_zone(db, payload.zone_id)

   item = ClimateMeasurement(
       location_id=location.id,
       temperature=payload.temperature,
       humidity=payload.humidity,
       measured_at=payload.measured_at or datetime.now(timezone.utc),
   )
   db.add(item)
   db.commit()
   db.refresh(item)

   return _serialize_measurement(item, location.zone_id)
