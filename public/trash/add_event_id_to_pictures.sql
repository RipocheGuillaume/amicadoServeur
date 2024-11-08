-- Deploy amicado:add_event_id_to_pictures to pg

BEGIN;

ALTER TABLE pictures 
ADD COLUMN event_id INT,
ADD CONSTRAINT fk_event
    FOREIGN KEY (event_id)
    REFERENCES events(id)
    ON DELETE SET NULL;

COMMIT;


-- Revert amicado:add_event_id_to_pictures from pg

BEGIN;

ALTER TABLE pictures 
DROP CONSTRAINT fk_event,
DROP COLUMN event_id;

COMMIT;


-- Verify amicado:add_event_id_to_pictures on pg

BEGIN;

SELECT 1 
FROM information_schema.columns 
WHERE table_name = 'pictures' 
  AND column_name = 'event_id';

SELECT 1 
FROM information_schema.table_constraints 
WHERE table_name = 'pictures' 
  AND constraint_name = 'fk_event';

ROLLBACK;
