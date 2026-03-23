from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models.models import ClimateZone, User
from app.schemas.zones import ZoneOut

router = APIRouter(prefix="/zones", tags=["Zones"])


@router.get("", response_model=list[ZoneOut])
def list_zones(
   greenhouse_id: UUID | None = Query(default=None),
   db: Session = Depends(get_db),
   _user: User = Depends(get_current_user),
):
   # greenhouse_id в текущей БД отсутствует, принимаем только для совместимости с клиентом
   items = db.query(ClimateZone).order_by(ClimateZone.name).all()

   return [
       {
           "id": item.id,
           "name": item.name,
           "description": item.description,
           "greenhouse_id": None,
           "target_temperature_min": item.target_temperature_min,
           "target_temperature_max": item.target_temperature_max,
           "target_humidity_min": item.target_humidity_min,
           "target_humidity_max": item.target_humidity_max,
       }
       for item in items
   ]


@router.get("/{zone_id}", response_model=ZoneOut)
def get_zone(
   zone_id: UUID,
   db: Session = Depends(get_db),
   _user: User = Depends(get_current_user),
):
   item = db.query(ClimateZone).filter(ClimateZone.id == zone_id).first()
   return {
       "id": item.id,
       "name": item.name,
       "description": item.description,
       "greenhouse_id": None,
       "target_temperature_min": item.target_temperature_min,
       "target_temperature_max": item.target_temperature_max,
       "target_humidity_min": item.target_humidity_min,
       "target_humidity_max": item.target_humidity_max,
   } if item else None

@router.post("", response_model=ZoneOut, status_code=status.HTTP_201_CREATED)
def create_zone(
   payload: ZoneCreate,
   db: Session = Depends(get_db),
   _user: User = Depends(get_current_user),
):
   item = ClimateZone(
       name=payload.name,
       description=payload.description,
       target_temperature_min=payload.target_temperature_min,
       target_temperature_max=payload.target_temperature_max,
       target_humidity_min=payload.target_humidity_min,
       target_humidity_max=payload.target_humidity_max,
   )
   db.add(item)
   db.commit()
   db.refresh(item)
   return _serialize_zone(item)


@router.put("/{zone_id}", response_model=ZoneOut)
def update_zone(
   zone_id: UUID,
   payload: ZoneUpdate,
   db: Session = Depends(get_db),
   _user: User = Depends(get_current_user),
):
   item = db.query(ClimateZone).filter(ClimateZone.id == zone_id).first()
   if not item:
       raise HTTPException(status_code=404, detail="Zone not found")

   if payload.name is not None:
       item.name = payload.name
   if payload.description is not None:
       item.description = payload.description
   if payload.target_temperature_min is not None:
       item.target_temperature_min = payload.target_temperature_min
   if payload.target_temperature_max is not None:
       item.target_temperature_max = payload.target_temperature_max
   if payload.target_humidity_min is not None:
       item.target_humidity_min = payload.target_humidity_min
   if payload.target_humidity_max is not None:
       item.target_humidity_max = payload.target_humidity_max

   db.commit()
   db.refresh(item)
   return _serialize_zone(item)


@router.delete("/{zone_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_zone(
   zone_id: UUID,
   db: Session = Depends(get_db),
   _user: User = Depends(get_current_user),
):
   item = db.query(ClimateZone).filter(ClimateZone.id == zone_id).first()
   if not item:
       raise HTTPException(status_code=404, detail="Zone not found")

   db.delete(item)
   db.commit()
   return None
