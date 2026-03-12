from app.database import SessionLocal
from app.models.models import Role, User
from app.security import get_password_hash

db = SessionLocal()

try:
    role = db.query(Role).filter(Role.name == "admin").first()

    if not role:
        role = Role(
            name="admin",
            description="Administrator",
        )
        db.add(role)
        db.commit()
        db.refresh(role)

    user = db.query(User).filter(User.username == "admin").first()

    if not user:
        user = User(
            email="admin@example.com",
            username="admin",
            password_hash=get_password_hash("admin123"),
            first_name="Admin",
            last_name="User",
            role_id=role.id,
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    print("Тестовый пользователь готов:")
    print("username: admin")
    print("password: admin123")

finally:
    db.close()