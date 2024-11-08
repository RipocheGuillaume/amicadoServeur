-- Revert amicado:add_event_id_to_pictures from pg

BEGIN;

ALTER TABLE pictures 
DROP CONSTRAINT fk_event,
DROP COLUMN event_id;

COMMIT;
