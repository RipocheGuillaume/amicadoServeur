-- Verify amicado:init on pg

BEGIN;

SELECT 1 FROM pg_tables WHERE tablename = 'years';
SELECT 1 FROM pg_tables WHERE tablename = 'song';
SELECT 1 FROM pg_tables WHERE tablename = 'tag';
SELECT 1 FROM pg_tables WHERE tablename = 'voice';

ROLLBACK;
