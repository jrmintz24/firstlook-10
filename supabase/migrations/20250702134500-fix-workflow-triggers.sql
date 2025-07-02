
-- Fix the workflow_triggers status check constraint
ALTER TABLE public.workflow_triggers 
DROP CONSTRAINT IF EXISTS workflow_triggers_status_check;

ALTER TABLE public.workflow_triggers 
ADD CONSTRAINT workflow_triggers_status_check 
CHECK (status IN ('pending', 'processing', 'completed', 'failed'));

-- Also fix the trigger_type to ensure it allows the types we're using
ALTER TABLE public.workflow_triggers 
DROP CONSTRAINT IF EXISTS workflow_triggers_trigger_type_check;

ALTER TABLE public.workflow_triggers 
ADD CONSTRAINT workflow_triggers_trigger_type_check 
CHECK (trigger_type IN ('agent_notification', 'send_agreement_email', 'post_showing_workflow'));
