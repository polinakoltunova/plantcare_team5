from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models.models import CareOperation, PlantSpecies, User
from app.schemas.reference import CareOperationOut, SpeciesOut, UserOut

router = APIRouter(tags=["Reference"])


@router.get("/care-operations", response_model=list[CareOperationOut])
def list_operations(
   db: Session = Depends(get_db),
   _user: User = Depends(get_current_user),
):
   return db.query(CareOperation).order_by(CareOperation.name).all()


@router.get("/species", response_model=list[SpeciesOut])
def list_species(
   db: Session = Depends(get_db),
   _user: User = Depends(get_current_user),
):
   return db.query(PlantSpecies).order_by(PlantSpecies.scientific_name).all()


@router.get("/users", response_model=list[UserOut])
def list_users(
   db: Session = Depends(get_db),
   _user: User = Depends(get_current_user),
):
   return db.query(User).order_by(User.username).all()
