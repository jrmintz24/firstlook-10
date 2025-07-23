-- First, let's see what status values actually exist in the table
-- Then update the constraint to include all existing values plus agent_confirmed

-- Drop the constraint first so we can see what's in the table
ALTER TABLE showing_requests DROP CONSTRAINT IF EXISTS showing_requests_status_check;

-- Add the constraint with all possible status values that might exist
ALTER TABLE showing_requests
  ADD CONSTRAINT showing_requests_status_check CHECK (
    status IN (
      'requested',
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