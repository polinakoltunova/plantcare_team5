-- UUID generation
CREATE EXTENSION IF NOT EXISTS pgcrypto;

--------------------------------------------------
-- ROLES
--------------------------------------------------

CREATE TABLE roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar(100) UNIQUE NOT NULL,
    description text
);

--------------------------------------------------
-- USERS
--------------------------------------------------

CREATE TABLE users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email varchar(255) UNIQUE NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    username varchar(100) UNIQUE NOT NULL,
    password_hash varchar(255) NOT NULL,
    first_name varchar(100),
    last_name varchar(100),
    role_id uuid NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);

--------------------------------------------------
-- CLIMATE ZONES
--------------------------------------------------

CREATE TABLE climate_zones (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar(100) NOT NULL UNIQUE,
    description text,

    target_temperature_min numeric(5,2),
    target_temperature_max numeric(5,2),

    target_humidity_min numeric(5,2),
    target_humidity_max numeric(5,2),

    CHECK (target_temperature_min <= target_temperature_max),
    CHECK (target_humidity_min <= target_humidity_max),
    CHECK (target_humidity_min >= 0 AND target_humidity_max <= 100)
);

--------------------------------------------------
-- LOCATIONS
--------------------------------------------------

CREATE TABLE locations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    zone_id uuid NOT NULL,
    name varchar(150) UNIQUE NOT NULL,
    type varchar(50),
    description text
);

--------------------------------------------------
-- PLANT SPECIES
--------------------------------------------------

CREATE TABLE plant_species (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    scientific_name varchar(255) UNIQUE NOT NULL,
    common_name varchar(255),
    description text,

    min_temperature numeric(5,2),
    max_temperature numeric(5,2),

    min_humidity numeric(5,2),
    max_humidity numeric(5,2),

    origin_country varchar(100),

    CHECK (min_temperature <= max_temperature),
    CHECK (min_humidity <= max_humidity),
    CHECK (min_humidity >= 0 AND max_humidity <= 100)
);

--------------------------------------------------
-- PLANT STATUSES
--------------------------------------------------

CREATE TABLE plant_statuses (
    id int PRIMARY KEY,
    name varchar(50) UNIQUE NOT NULL
);

--------------------------------------------------
-- PLANTS
--------------------------------------------------

CREATE TABLE plants (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    species_id uuid NOT NULL,
    location_id uuid NOT NULL,

    inventory_number varchar(100) UNIQUE NOT NULL,

    planting_date date,
    status_id int,
    notes text
);

--------------------------------------------------
-- QR CODES
--------------------------------------------------

CREATE TABLE qr_codes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    plant_id uuid NOT NULL,

    qr_value varchar(255) UNIQUE NOT NULL,

    is_active boolean NOT NULL DEFAULT true,

    created_at timestamptz NOT NULL DEFAULT now()
);

--------------------------------------------------
-- CARE OPERATIONS
--------------------------------------------------

CREATE TABLE care_operations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar(100) UNIQUE NOT NULL,
    description text,
    default_duration_minutes int CHECK (default_duration_minutes >= 0)
);

--------------------------------------------------
-- TASK STATUSES
--------------------------------------------------

CREATE TABLE task_statuses (
    id int PRIMARY KEY,
    name varchar(50) UNIQUE NOT NULL
);

--------------------------------------------------
-- CARE TASKS
--------------------------------------------------

CREATE TABLE care_tasks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

    plant_id uuid,
    operation_id uuid NOT NULL,

    assigned_user_id uuid,

    planned_date timestamptz,
    due_date timestamptz,
    completed_at timestamptz,

    status_id int,

    created_by uuid,
    created_at timestamptz NOT NULL DEFAULT now(),

    comment text,

    CHECK (planned_date <= due_date)
);

--------------------------------------------------
-- TASK HISTORY
--------------------------------------------------

CREATE TABLE care_task_history (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

    task_id uuid NOT NULL,

    action_type varchar(50) NOT NULL,

    performed_by uuid NOT NULL,

    performed_at timestamptz NOT NULL DEFAULT now(),

    status_id int,

    notes text
);

--------------------------------------------------
-- OBSERVATIONS
--------------------------------------------------

CREATE TABLE observations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

    plant_id uuid NOT NULL,
    task_id uuid,

    created_by uuid NOT NULL,

    observation_type varchar(50) NOT NULL,

    health_status varchar(50),

    description text,

    severity int CHECK (severity BETWEEN 1 AND 5),

    photo_url varchar(500),

    created_at timestamptz NOT NULL DEFAULT now()
);

--------------------------------------------------
-- CLIMATE MEASUREMENTS
--------------------------------------------------

CREATE TABLE climate_measurements (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

    location_id uuid NOT NULL,

    temperature numeric(5,2),
    humidity numeric(5,2),

    measured_at timestamptz NOT NULL,

    CHECK (humidity >= 0 AND humidity <= 100)
);

--------------------------------------------------
-- CARE SCHEDULES
--------------------------------------------------

CREATE TABLE care_schedules (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

    species_id uuid,

    operation_id uuid NOT NULL,

    frequency_days int CHECK (frequency_days > 0),

    created_by uuid,

    created_at timestamptz NOT NULL DEFAULT now()
);

--------------------------------------------------
-- FOREIGN KEYS
--------------------------------------------------

ALTER TABLE users
ADD CONSTRAINT fk_users_role
FOREIGN KEY (role_id)
REFERENCES roles(id)
ON DELETE RESTRICT;

ALTER TABLE locations
ADD CONSTRAINT fk_locations_zone
FOREIGN KEY (zone_id)
REFERENCES climate_zones(id)
ON DELETE RESTRICT;

ALTER TABLE plants
ADD CONSTRAINT fk_plants_species
FOREIGN KEY (species_id)
REFERENCES plant_species(id)
ON DELETE RESTRICT;

ALTER TABLE plants
ADD CONSTRAINT fk_plants_location
FOREIGN KEY (location_id)
REFERENCES locations(id)
ON DELETE RESTRICT;

ALTER TABLE plants
ADD CONSTRAINT fk_plants_status
FOREIGN KEY (status_id)
REFERENCES plant_statuses(id);

ALTER TABLE qr_codes
ADD CONSTRAINT fk_qr_plant
FOREIGN KEY (plant_id)
REFERENCES plants(id)
ON DELETE CASCADE;

ALTER TABLE care_tasks
ADD CONSTRAINT fk_task_plant
FOREIGN KEY (plant_id)
REFERENCES plants(id);

ALTER TABLE care_tasks
ADD CONSTRAINT fk_task_operation
FOREIGN KEY (operation_id)
REFERENCES care_operations(id);

ALTER TABLE care_tasks
ADD CONSTRAINT fk_task_assigned_user
FOREIGN KEY (assigned_user_id)
REFERENCES users(id);

ALTER TABLE care_tasks
ADD CONSTRAINT fk_task_creator
FOREIGN KEY (created_by)
REFERENCES users(id);

ALTER TABLE care_tasks
ADD CONSTRAINT fk_task_status
FOREIGN KEY (status_id)
REFERENCES task_statuses(id);

ALTER TABLE observations
ADD CONSTRAINT fk_obs_plant
FOREIGN KEY (plant_id)
REFERENCES plants(id)
ON DELETE CASCADE;

ALTER TABLE observations
ADD CONSTRAINT fk_obs_task
FOREIGN KEY (task_id)
REFERENCES care_tasks(id);

ALTER TABLE observations
ADD CONSTRAINT fk_obs_user
FOREIGN KEY (created_by)
REFERENCES users(id);

ALTER TABLE climate_measurements
ADD CONSTRAINT fk_measurement_location
FOREIGN KEY (location_id)
REFERENCES locations(id)
ON DELETE CASCADE;

ALTER TABLE care_task_history
ADD CONSTRAINT fk_history_task
FOREIGN KEY (task_id)
REFERENCES care_tasks(id)
ON DELETE CASCADE;

ALTER TABLE care_task_history
ADD CONSTRAINT fk_history_user
FOREIGN KEY (performed_by)
REFERENCES users(id);

ALTER TABLE care_task_history
ADD CONSTRAINT fk_history_status
FOREIGN KEY (status_id)
REFERENCES task_statuses(id);

ALTER TABLE care_schedules
ADD CONSTRAINT fk_schedule_species
FOREIGN KEY (species_id)
REFERENCES plant_species(id);

ALTER TABLE care_schedules
ADD CONSTRAINT fk_schedule_operation
FOREIGN KEY (operation_id)
REFERENCES care_operations(id);

ALTER TABLE care_schedules
ADD CONSTRAINT fk_schedule_user
FOREIGN KEY (created_by)
REFERENCES users(id);

--------------------------------------------------
-- INDEXES
--------------------------------------------------

CREATE INDEX idx_plants_species
ON plants(species_id);

CREATE INDEX idx_plants_location
ON plants(location_id);

CREATE INDEX idx_tasks_plant
ON care_tasks(plant_id);

CREATE INDEX idx_tasks_assigned_user
ON care_tasks(assigned_user_id);

CREATE INDEX idx_observations_plant
ON observations(plant_id);

CREATE INDEX idx_measurements_location
ON climate_measurements(location_id);

CREATE INDEX idx_measurements_time
ON climate_measurements(measured_at);

--------------------------------------------------
-- ONLY ONE ACTIVE QR PER PLANT
--------------------------------------------------

CREATE UNIQUE INDEX unique_active_qr
ON qr_codes(plant_id)
WHERE is_active = true;
