# Настройки приложения
from dotenv import load_dotenv
import os

load_dotenv()

class Settings:

    APP_NAME = "Plant Care - Система автоматизации ухода за растениями в ботаническом саду"
    DEBUG = True

    DATABASE_URL = os.getenv("DATABASE_URL")

    SECRET_KEY = "super_secret_key_for_dev"
    ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES = 60

    CORS_ORIGINS = [
        "http://localhost:5173",
        "http://localhost:8000",
    ]


settings = Settings()