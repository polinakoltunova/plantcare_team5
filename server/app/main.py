# Точка входа FastAPI-приложения
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import create_tables

app = FastAPI(
    title=settings.APP_NAME,
    debug=settings.DEBUG
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    create_tables()

@app.get("/")
def root():
    return {
        "message": "Сервер API системы Plant Care запущен",
        "app_name": settings.APP_NAME
    }

@app.get("/health")
def health_check():
    return {
        "status": "ok"
    }