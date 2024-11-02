-- Verify amicado:add-user on pg

BEGIN;

SELECT 1 FROM pg_tables WHERE tablename = 'users';


ROLLBACK;
