from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.config import settings
from app.models.models import Base

# Создание подключения к бд
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True
)

# Фабрика сессий
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Зависимость для FastAPI
def get_db():
    # Создаёт сессию бд для запроса и закрывает её после завершения
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_tables():
    Base.metadata.create_all(bind=engine)