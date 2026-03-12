# Настройки приложения
class Settings:

    APP_NAME = "Plant Care - Система автоматизации ухода за растениями в ботаническом саду"
    DEBUG = True

    DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/plant_care"

    SECRET_KEY = "super_secret_key_for_dev"
    ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES = 60

    CORS_ORIGINS = [
        "http://localhost:5173",
        "http://localhost:8000",
    ]


settings = Settings()