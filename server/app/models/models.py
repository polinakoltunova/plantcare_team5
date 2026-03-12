import uuid
from sqlalchemy import (
    Column, String, Text, Integer, Boolean, Date, DateTime,
    Numeric, ForeignKey
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship, DeclarativeBase
from sqlalchemy.sql import func


class Base(DeclarativeBase):
    pass


class Role(Base):
    __tablename__ = "roles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), unique=True, nullable=False)
    description = Column(Text)

    users = relationship("User", back_populates="role")


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False)
    username = Column(String(100), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    first_name = Column(String(100))
    last_name = Column(String(100))
    role_id = Column(UUID(as_uuid=True), ForeignKey("roles.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    role = relationship("Role", back_populates="users")
    observations = relationship("Observation", back_populates="creator")


class ClimateZone(Base):
    __tablename__ = "climate_zones"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), unique=True, nullable=False)
    description = Column(Text)
    target_temperature_min = Column(Numeric(5, 2))
    target_temperature_max = Column(Numeric(5, 2))
    target_humidity_min = Column(Numeric(5, 2))
    target_humidity_max = Column(Numeric(5, 2))

    locations = relationship("Location", back_populates="zone")


class Location(Base):
    __tablename__ = "locations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    zone_id = Column(UUID(as_uuid=True), ForeignKey("climate_zones.id"), nullable=False)
    name = Column(String(150), unique=True, nullable=False)
    type = Column(String(50))
    description = Column(Text)

    zone = relationship("ClimateZone", back_populates="locations")
    plants = relationship("Plant", back_populates="location")
    climate_measurements = relationship("ClimateMeasurement", back_populates="location")


class PlantSpecies(Base):
    __tablename__ = "plant_species"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    scientific_name = Column(String(255), unique=True, nullable=False)
    common_name = Column(String(255))
    description = Column(Text)
    min_temperature = Column(Numeric(5, 2))
    max_temperature = Column(Numeric(5, 2))
    min_humidity = Column(Numeric(5, 2))
    max_humidity = Column(Numeric(5, 2))
    origin_country = Column(String(100))

    plants = relationship("Plant", back_populates="species")
    care_schedules = relationship("CareSchedule", back_populates="species")


class PlantStatus(Base):
    __tablename__ = "plant_statuses"

    id = Column(Integer, primary_key=True)
    name = Column(String(50), unique=True, nullable=False)

    plants = relationship("Plant", back_populates="status")


class Plant(Base):
    __tablename__ = "plants"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    species_id = Column(UUID(as_uuid=True), ForeignKey("plant_species.id"), nullable=False)
    location_id = Column(UUID(as_uuid=True), ForeignKey("locations.id"), nullable=False)
    inventory_number = Column(String(100), unique=True, nullable=False)
    planting_date = Column(Date)
    status_id = Column(Integer, ForeignKey("plant_statuses.id"))
    notes = Column(Text)

    species = relationship("PlantSpecies", back_populates="plants")
    location = relationship("Location", back_populates="plants")
    status = relationship("PlantStatus", back_populates="plants")
    qr_codes = relationship("QRCode", back_populates="plant")
    tasks = relationship("CareTask", back_populates="plant")
    observations = relationship("Observation", back_populates="plant")


class QRCode(Base):
    __tablename__ = "qr_codes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    plant_id = Column(UUID(as_uuid=True), ForeignKey("plants.id"), nullable=False)
    qr_value = Column(String(255), unique=True, nullable=False)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    plant = relationship("Plant", back_populates="qr_codes")


class CareOperation(Base):
    __tablename__ = "care_operations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), unique=True, nullable=False)
    description = Column(Text)
    default_duration_minutes = Column(Integer)

    tasks = relationship("CareTask", back_populates="operation")
    schedules = relationship("CareSchedule", back_populates="operation")


class TaskStatus(Base):
    __tablename__ = "task_statuses"

    id = Column(Integer, primary_key=True)
    name = Column(String(50), unique=True, nullable=False)

    tasks = relationship("CareTask", back_populates="status")
    history = relationship("CareTaskHistory", back_populates="status")


class CareTask(Base):
    __tablename__ = "care_tasks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    plant_id = Column(UUID(as_uuid=True), ForeignKey("plants.id"))
    operation_id = Column(UUID(as_uuid=True), ForeignKey("care_operations.id"), nullable=False)
    assigned_user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    planned_date = Column(DateTime(timezone=True))
    due_date = Column(DateTime(timezone=True))
    completed_at = Column(DateTime(timezone=True))
    status_id = Column(Integer, ForeignKey("task_statuses.id"))
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    comment = Column(Text)

    plant = relationship("Plant", back_populates="tasks")
    operation = relationship("CareOperation", back_populates="tasks")
    status = relationship("TaskStatus", back_populates="tasks")
    history = relationship("CareTaskHistory", back_populates="task")


class CareTaskHistory(Base):
    __tablename__ = "care_task_history"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    task_id = Column(UUID(as_uuid=True), ForeignKey("care_tasks.id"), nullable=False)
    action_type = Column(String(50), nullable=False)
    performed_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    performed_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    status_id = Column(Integer, ForeignKey("task_statuses.id"))
    notes = Column(Text)

    task = relationship("CareTask", back_populates="history")
    status = relationship("TaskStatus", back_populates="history")


class Observation(Base):
    __tablename__ = "observations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    plant_id = Column(UUID(as_uuid=True), ForeignKey("plants.id"), nullable=False)
    task_id = Column(UUID(as_uuid=True), ForeignKey("care_tasks.id"))
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    observation_type = Column(String(50), nullable=False)
    health_status = Column(String(50))
    description = Column(Text)
    severity = Column(Integer)
    photo_url = Column(String(500))
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    plant = relationship("Plant", back_populates="observations")
    creator = relationship("User", back_populates="observations")


class ClimateMeasurement(Base):
    __tablename__ = "climate_measurements"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    location_id = Column(UUID(as_uuid=True), ForeignKey("locations.id"), nullable=False)
    temperature = Column(Numeric(5, 2))
    humidity = Column(Numeric(5, 2))
    measured_at = Column(DateTime(timezone=True), nullable=False)

    location = relationship("Location", back_populates="climate_measurements")


class CareSchedule(Base):
    __tablename__ = "care_schedules"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    species_id = Column(UUID(as_uuid=True), ForeignKey("plant_species.id"))
    operation_id = Column(UUID(as_uuid=True), ForeignKey("care_operations.id"), nullable=False)
    frequency_days = Column(Integer)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    species = relationship("PlantSpecies", back_populates="care_schedules")
    operation = relationship("CareOperation", back_populates="schedules")