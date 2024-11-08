-- Verify amicado:add_pictures on pg

BEGIN;

SELECT 1 FROM pg_tables WHERE tablename = 'events';
SELECT 1 FROM pg_tables WHERE tablename = 'pictures';

ROLLBACK;
