-- Migration to support admin workflow
-- Adds assigned agent fields and status tracking to showing_requests.

ALTER TABLE showing_requests
  ADD COLUMN IF NOT EXISTS assigned_agent_id uuid REFERENCES profiles(id),
  ADD COLUMN IF NOT EXISTS assigned_agent_name text,
  ADD COLUMN IF NOT EXISTS assigned_agent_phone text,
  ADD COLUMN IF NOT EXISTS assigned_agent_email text,
  ADD COLUMN IF NOT EXISTS estimated_confirmation_date date,
  ADD COLUMN IF NOT EXISTS internal_notes text,
  ADD COLUMN IF NOT EXISTS status_updated_at timestamptz;

CREATE OR REPLACE FUNCTION set_status_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    NEW.status_updated_at := now();
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_showing_requests_updated ON showing_requests;
CREATE TRIGGER trg_showing_requests_updated
BEFORE UPDATE ON showing_requests
FOR EACH ROW EXECUTE PROCEDURE set_status_updated_at();
