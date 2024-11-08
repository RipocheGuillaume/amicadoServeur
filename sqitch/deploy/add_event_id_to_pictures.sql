-- Deploy amicado:add_event_id_to_pictures to pg

BEGIN;

ALTER TABLE pictures 
ADD COLUMN event_id INT,
ADD CONSTRAINT fk_event
    FOREIGN KEY (event_id)
    REFERENCES events(id)
    ON DELETE SET NULL;

COMMIT;
