# Точка входа FastAPI-приложения
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import create_tables, SessionLocal
from app.seed import seed_all

from app.routers.auth import router as auth_router
from app.routers.plants import router as plants_router
from app.routers.tasks import router as tasks_router

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

    db = SessionLocal()
    try:
        seed_all(db)
    finally:
        db.close()

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

app.include_router(auth_router)
app.include_router(plants_router)
app.include_router(tasks_router)