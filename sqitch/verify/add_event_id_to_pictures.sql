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
