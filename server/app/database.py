from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from app.config import settings

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

# Базовый класс для моделей SQLAlchemy
Base = declarative_base()


# Зависимость для FastAPI
def get_db():
    # Создаёт сессию бд для запроса и закрывает её после завершения
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()