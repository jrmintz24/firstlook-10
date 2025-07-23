-- Add 'agent_confirmed' to allowed status values for showing_requests
-- This status is used when an agent accepts a tour request

ALTER TABLE showing_requests
  DROP CONSTRAINT IF EXISTS showing_requests_status_check;

ALTER TABLE showing_requests
  ADD CONSTRAINT showing_requests_status_check CHECK (
    status IN (
      'pending',
      'submitted', 
      'under_review',
      'agent_assigned',
      'agent_confirmed',
      'pending_admin_approval',
      'confirmed',
      'scheduled',
      'completed',
      'cancelled'
    )
  );