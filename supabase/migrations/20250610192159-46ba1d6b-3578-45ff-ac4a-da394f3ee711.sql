
-- Update the showing_requests table to support agent request workflow
ALTER TABLE showing_requests 
ADD COLUMN IF NOT EXISTS requested_agent_id uuid,
ADD COLUMN IF NOT EXISTS requested_agent_name text,
ADD COLUMN IF NOT EXISTS requested_agent_phone text,
ADD COLUMN IF NOT EXISTS requested_agent_email text;

-- Update the status check constraint to include the new agent_requested status
-- First, drop the existing constraint if it exists
ALTER TABLE showing_requests DROP CONSTRAINT IF EXISTS showing_requests_status_check;

-- Add the updated constraint with the new status
ALTER TABLE showing_requests ADD CONSTRAINT showing_requests_status_check 
CHECK (status IN ('pending', 'submitted', 'under_review', 'agent_requested', 'agent_assigned', 'pending_admin_approval', 'confirmed', 'scheduled', 'completed', 'cancelled'));
