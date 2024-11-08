-- Deploy amicado:add_pictures to pg

BEGIN;

    CREATE TABLE events (
        id SERIAL PRIMARY KEY,
        event VARCHAR(50) NOT NULL UNIQUE,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz
    );

    CREATE TABLE pictures (
    id SERIAL PRIMARY KEY,
    title VARCHAR(50) NOT NULL,
    url VARCHAR(255) NOT NULL UNIQUE,
    "event_id" int NOT NULL REFERENCES "events"("id") ON DELETE CASCADE,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz
    );

COMMIT;
