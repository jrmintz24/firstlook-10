-- Temporarily remove the status constraint so we can see what values exist
-- We'll add it back once we know what status values are actually in the table

ALTER TABLE showing_requests DROP CONSTRAINT IF EXISTS showing_requests_status_check;