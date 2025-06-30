
-- First, let's see all existing trigger types to understand what we're working with
SELECT DISTINCT trigger_type FROM public.workflow_triggers;

-- Let's also check if there are any constraints on workflow_triggers currently
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'public.workflow_triggers'::regclass 
AND contype = 'c';

-- Remove the constraint entirely for now since we don't know all the valid types
ALTER TABLE public.workflow_triggers 
DROP CONSTRAINT IF EXISTS workflow_triggers_trigger_type_check;

-- Just add the showing_requests status constraint which is what we really need
ALTER TABLE public.showing_requests 
DROP CONSTRAINT IF EXISTS showing_requests_status_check;

ALTER TABLE public.showing_requests 
ADD CONSTRAINT showing_requests_status_check 
CHECK (status IN (
  'pending', 
  'submitted', 
  'under_review', 
  'agent_assigned', 
  'agent_confirmed', 
  'agent_requested',
  'awaiting_agreement',
  'confirmed', 
  'scheduled', 
  'in_progress', 
  'completed', 
  'cancelled', 
  'no_show'
));
