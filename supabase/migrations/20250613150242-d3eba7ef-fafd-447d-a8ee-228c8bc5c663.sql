
-- Update the check constraint to include the new status values
ALTER TABLE showing_requests 
DROP CONSTRAINT IF EXISTS showing_requests_status_check;

ALTER TABLE showing_requests 
ADD CONSTRAINT showing_requests_status_check 
CHECK (status IN (
  'pending',
  'submitted', 
  'under_review',
  'agent_requested',
  'agent_assigned',
  'pending_admin_approval',
  'confirmed',
  'agent_confirmed',
  'scheduled',
  'in_progress', 
  'completed',
  'cancelled',
  'no_show'
));
