from __future__ import annotations

from datetime import datetime, timedelta, timezone

from sqlalchemy.orm import Session

from app.models.models import (
    Role,
    User,
    ClimateZone,
    Location,
    PlantSpecies,
    PlantStatus,
    CareOperation,
    TaskStatus,
    CareSchedule,
)
from app.security import get_password_hash


def _get_or_create(db: Session, model, defaults: dict | None = None, **kwargs):
    instance = db.query(model).filter_by(**kwargs).first()
    if instance:
        return instance
    params = {**kwargs, **(defaults or {})}
    instance = model(**params)
    db.add(instance)
    db.flush()
    return instance


def seed_all(db: Session) -> None:
    admin_role = _get_or_create(db, Role, name="admin", defaults={"description": "Администратор"})
    curator_role = _get_or_create(db, Role, name="curator", defaults={"description": "Куратор зоны"})
    worker_role = _get_or_create(db, Role, name="worker", defaults={"description": "Исполнитель"})
    guest_role = _get_or_create(db, Role, name="guest", defaults={"description": "Гость"})

    _get_or_create(
        db,
        User,
        username="admin",
        defaults={
            "email": "admin@example.com",
            "password_hash": get_password_hash("admin123"),
            "first_name": "System",
            "last_name": "Admin",
            "role_id": admin_role.id,
        },
    )
    _get_or_create(
        db,
        User,
        username="curator1",
        defaults={
            "email": "curator1@example.com",
            "password_hash": get_password_hash("curator123"),
            "first_name": "Ирина",
            "last_name": "Куратор",
            "role_id": curator_role.id,
        },
    )
    _get_or_create(
        db,
        User,
        username="worker1",
        defaults={
            "email": "worker1@example.com",
            "password_hash": get_password_hash("worker123"),
            "first_name": "Анна",
            "last_name": "Садовник",
            "role_id": worker_role.id,
        },
    )
    _get_or_create(
        db,
        User,
        username="worker2",
        defaults={
            "email": "worker2@example.com",
            "password_hash": get_password_hash("worker123"),
            "first_name": "Павел",
            "last_name": "Садовник",
            "role_id": worker_role.id,
        },
    )

    for id_, name in [
        (1, "healthy"),
        (2, "needs_attention"),
        (3, "critical"),
    ]:
        _get_or_create(db, PlantStatus, id=id_, defaults={"name": name})

    for id_, name in [
        (1, "planned"),
        (2, "done"),
        (3, "problem"),
        (4, "cancelled"),
    ]:
        _get_or_create(db, TaskStatus, id=id_, defaults={"name": name})

    tropical = _get_or_create(
        db,
        ClimateZone,
        name="Тропическая зона",
        defaults={
            "description": "Теплая и влажная зона",
            "target_temperature_min": 22,
            "target_temperature_max": 28,
            "target_humidity_min": 65,
            "target_humidity_max": 85,
        },
    )
    dry = _get_or_create(
        db,
        ClimateZone,
        name="Сухая зона",
        defaults={
            "description": "Зона для суккулентов",
            "target_temperature_min": 18,
            "target_temperature_max": 27,
            "target_humidity_min": 25,
            "target_humidity_max": 45,
        },
    )

    _get_or_create(
        db,
        Location,
        name="Тропический сектор А",
        defaults={"zone_id": tropical.id, "type": "sector", "description": "Основной сектор"},
    )
    _get_or_create(
        db,
        Location,
        name="Тропический сектор Б",
        defaults={"zone_id": tropical.id, "type": "sector", "description": "Запасной сектор"},
    )
    _get_or_create(
        db,
        Location,
        name="Сухой сектор 1",
        defaults={"zone_id": dry.id, "type": "sector", "description": "Сектор суккулентов"},
    )

    monstera = _get_or_create(
        db,
        PlantSpecies,
        scientific_name="Monstera deliciosa",
        defaults={
            "common_name": "Монстера деликатесная",
            "description": "Тропическое декоративное растение",
            "min_temperature": 20,
            "max_temperature": 30,
            "min_humidity": 60,
            "max_humidity": 85,
            "origin_country": "Мексика",
        },
    )
    ficus = _get_or_create(
        db,
        PlantSpecies,
        scientific_name="Ficus elastica",
        defaults={
            "common_name": "Фикус каучуконосный",
            "description": "Комнатное растение",
            "min_temperature": 18,
            "max_temperature": 28,
            "min_humidity": 45,
            "max_humidity": 70,
            "origin_country": "Индия",
        },
    )
    aloe = _get_or_create(
        db,
        PlantSpecies,
        scientific_name="Aloe vera",
        defaults={
            "common_name": "Алоэ вера",
            "description": "Суккулент",
            "min_temperature": 16,
            "max_temperature": 30,
            "min_humidity": 20,
            "max_humidity": 45,
            "origin_country": "Северная Америка",
        },
    )

    watering = _get_or_create(
        db,
        CareOperation,
        name="Полив",
        defaults={"description": "Полив растения", "default_duration_minutes": 10},
    )
    inspection = _get_or_create(
        db,
        CareOperation,
        name="Осмотр",
        defaults={"description": "Визуальный осмотр растения", "default_duration_minutes": 5},
    )
    fertilizing = _get_or_create(
        db,
        CareOperation,
        name="Подкормка",
        defaults={"description": "Подкормка растения", "default_duration_minutes": 15},
    )

    _get_or_create(
        db,
        CareSchedule,
        species_id=monstera.id,
        operation_id=watering.id,
        defaults={"frequency_days": 3},
    )
    _get_or_create(
        db,
        CareSchedule,
        species_id=ficus.id,
        operation_id=inspection.id,
        defaults={"frequency_days": 7},
    )
    _get_or_create(
        db,
        CareSchedule,
        species_id=aloe.id,
        operation_id=watering.id,
        defaults={"frequency_days": 10},
    )

    db.commit()