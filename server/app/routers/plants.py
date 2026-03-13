from __future__ import annotations

from datetime import date
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.dependencies import get_current_user
from app.models.models import Plant, User, CareSchedule, Location
from app.schemas.plants import PlantOut
from app.schemas.schedule import ScheduleOut

router = APIRouter(prefix="/plants", tags=["Plants"])


def _calc_age_years(planting_date: date | None) -> int | None:
    if not planting_date:
        return None
    today = date.today()
    # грубо: число полных лет
    years = (today - planting_date).days // 365
    return max(years, 0)


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
        # Plant -> Location -> ClimateZone
        q = q.join(Plant.location).filter(Location.zone_id == zone_id)

    if search:
        q = q.filter(Plant.inventory_number.ilike(f"%{search}%"))

    plants = q.order_by(Plant.inventory_number).all()

    # Приводим к формату, который ждёт фронт
    result: list[dict] = []
    for p in plants:
        result.append(
            {
                "id": p.id,
                "inventory_number": p.inventory_number,
                "planting_date": p.planting_date,
                "notes": p.notes,
                "status": (p.status.name if p.status else None),
                "origin_country": (p.species.origin_country if p.species else None),
                "estimated_age_years": _calc_age_years(p.planting_date),
            }
        )
    return result


@router.get("/{plant_id}", response_model=PlantOut)
def get_plant(plant_id: UUID, db: Session = Depends(get_db), _user: User = Depends(get_current_user)):
    p = (
        db.query(Plant)
        .options(joinedload(Plant.species), joinedload(Plant.status), joinedload(Plant.location))
        .filter(Plant.id == plant_id)
        .first()
    )
    if not p:
        raise HTTPException(status_code=404, detail="Plant not found")

    return {
        "id": p.id,
        "inventory_number": p.inventory_number,
        "planting_date": p.planting_date,
        "notes": p.notes,
        "status": (p.status.name if p.status else None),
        "origin_country": (p.species.origin_country if p.species else None),
        "estimated_age_years": _calc_age_years(p.planting_date),
    }


@router.get("/{plant_id}/schedule", response_model=list[ScheduleOut])
def get_schedule(plant_id: UUID, db: Session = Depends(get_db), _user: User = Depends(get_current_user)):
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
            "operation_name": (s.operation.name if s.operation else ""),
            "frequency_days": s.frequency_days,
        }
        for s in schedules
    ]
