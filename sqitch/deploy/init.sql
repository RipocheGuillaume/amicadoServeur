-- Deploy amicado:init to pg

BEGIN;

-- XXX Add DDLs here.
CREATE TABLE years (
    id SERIAL PRIMARY KEY,
    year VARCHAR(50) NOT NULL UNIQUE,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz
);

CREATE TABLE song (
    id SERIAL PRIMARY KEY,
    title VARCHAR(50) NOT NULL UNIQUE,
    author VARCHAR(100) NOT NULL,
    image VARCHAR(250) UNIQUE,
    "years_id" int NOT NULL REFERENCES "years"("id") ON DELETE CASCADE,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz
);

CREATE TABLE voice (
    id SERIAL PRIMARY KEY,
    voice VARCHAR(50) NOT NULL,
    link VARCHAR(100) NOT NULL UNIQUE,
    "song_id" int NOT NULL REFERENCES "song"("id") ON DELETE CASCADE,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz
);


COMMIT;
