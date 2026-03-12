from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db


def get_database_session(db: Session = Depends(get_db)) -> Session:
    return db


def get_current_user_stub():
    # Временная заглушка для авторизации, позже заменится на реальную JWT-аутентификацию
    return {
        "id": "test-user-id",
        "username": "demo_user",
        "role": "admin"
    }


def require_auth_stub(user=Depends(get_current_user_stub)):
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Не авторизован"
        )
    return user