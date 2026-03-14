from dotenv import load_dotenv
import os

load_dotenv()


def _parse_bool(value: str, default: bool = True) -> bool:
    if value is None:
        return default
    return value.strip().lower() in {"1", "true", "yes", "on"}


def _parse_origins(value: str) -> list[str]:
    if not value:
        return [
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "http://localhost:8000",
            "http://127.0.0.1:8000",
        ]
    return [origin.strip() for origin in value.split(",") if origin.strip()]


class Settings:
    APP_NAME = "Plant Care - Система автоматизации ухода за растениями в ботаническом саду"

    DEBUG = _parse_bool(os.getenv("DEBUG"), default=True)

    DATABASE_URL = os.getenv(
        "DATABASE_URL",
        "postgresql://plantcare_user:plantcare_password@db:5432/plantcare",
    )

    SECRET_KEY = os.getenv("SECRET_KEY", "super_secret_key_for_dev")
    ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES = 60

    CORS_ORIGINS = _parse_origins(os.getenv("CORS_ORIGINS"))


settings = Settings()