from sqlalchemy.orm import Session

from app.models.models import User, Role, PlantStatus, TaskStatus
from app.security import get_password_hash

def seed_roles(db: Session) -> None:
    roles = [
        {"name": "admin", "description": "Администратор системы"},
        {"name": "curator", "description": "Куратор зоны/оранжереи"},
        {"name": "worker", "description": "Дежурный сотрудник"},
        {"name": "guest", "description": "Пользователь по умолчанию"},
    ]

    for role_data in roles:
        exists = db.query(Role).filter(Role.name == role_data["name"]).first()
        if not exists:
            db.add(Role(**role_data))

    db.commit()


def seed_plant_statuses(db: Session) -> None:
    statuses = [
        {"id": 1, "name": "healthy"},
        {"id": 2, "name": "needs_attention"},
        {"id": 3, "name": "critical"},
    ]

    for status_data in statuses:
        exists = db.query(PlantStatus).filter(PlantStatus.id == status_data["id"]).first()
        if not exists:
            db.add(PlantStatus(**status_data))

    db.commit()


def seed_task_statuses(db: Session) -> None:
    statuses = [
        {"id": 1, "name": "planned"},
        {"id": 2, "name": "done"},
        {"id": 3, "name": "problem"},
        {"id": 4, "name": "overdue"},
    ]

    for status_data in statuses:
        exists = db.query(TaskStatus).filter(TaskStatus.id == status_data["id"]).first()
        if not exists:
            db.add(TaskStatus(**status_data))

    db.commit()

    
def seed_admin_user(db: Session) -> None:
    admin_role = db.query(Role).filter(Role.name == "admin").first()
    if not admin_role:
        return

    existing_user = db.query(User).filter(User.username == "admin").first()
    if existing_user:
        return

    user = User(
        email="admin@example.com",
        username="admin",
        password_hash=get_password_hash("admin123"),
        first_name="Admin",
        last_name="User",
        role_id=admin_role.id,
    )
    db.add(user)
    db.commit()


def seed_all(db: Session) -> None:
    seed_roles(db)
    seed_plant_statuses(db)
    seed_task_statuses(db)
    seed_admin_user(db)