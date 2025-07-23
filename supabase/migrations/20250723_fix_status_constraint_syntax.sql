-- Fix syntax error in status constraint
-- Drop the constraint first, then add it back with proper syntax

ALTER TABLE showing_requests DROP CONSTRAINT IF EXISTS showing_requests_status_check;

ALTER TABLE showing_requests ADD CONSTRAINT showing_requests_status_check CHECK (status IN ('requested', 'pending', 'submitted', 'under_review', 'agent_assigned', 'agent_confirmed', 'pending_admin_approval', 'confirmed', 'scheduled', 'completed', 'cancelled'));