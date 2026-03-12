# Серверная часть проекта Plant Care реализована с использованием FastAPI и предоставляет REST API для взаимодействия клиентского приложения с базой данных.

Используемые технологии: Python, FastAPI, SQLAlchemy, PostgreSQL, Uvicorn.

# Описание основных папок и файлов

config.py - конфигурация приложения
database.py - настройка подключения к бд
dependencies.py - зависимости FastAPI
main.py - основной файл запуска FastAPI приложения
models - содержит модели бд SQLAlchemy
schemas - содержит схемы данных Pydantic
routers - содержит маршруты API
services - содержит бизнес-логику приложения
utils - содержит вспомогательные функции

# Запуск сервера

Перед запуском необходимо установить зависимости:

pip install -r requirements.txt

После установки зависимостей сервер можно запустить командой:

uvicorn app.main:app --reload

После запуска сервер будет доступен по адресу:

http://localhost:8000


# Документация API

FastAPI автоматически генерирует документацию API.

Swagger UI:

http://localhost:8000/docs

ReDoc:

http://localhost:8000/redoc
