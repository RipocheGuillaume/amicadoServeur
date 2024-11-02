-- Revert amicado:init from pg

BEGIN;


DROP TABLE IF EXISTS "voice";
DROP TABLE IF EXISTS "song";
DROP TABLE IF EXISTS "tag";
DROP TABLE IF EXISTS "years";
COMMIT;
