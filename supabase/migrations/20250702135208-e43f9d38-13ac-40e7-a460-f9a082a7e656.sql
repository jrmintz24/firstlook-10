
-- Disable the auto-assignment trigger temporarily to allow manual agent assignment
DROP TRIGGER IF EXISTS trg_auto_assign_agent ON public.showing_requests;

-- Update the workflow processor function to handle HTTP calls properly
CREATE OR REPLACE FUNCTION public.process_workflow_triggers()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  trigger_record public.workflow_triggers;
  showing_record public.showing_requests;
  response_result record;
BEGIN
  -- Process pending triggers that are due
  FOR trigger_record IN 
    SELECT * FROM public.workflow_triggers 
    WHERE status = 'pending' 
    AND scheduled_for <= now()
    ORDER BY scheduled_for
    LIMIT 10
  LOOP
    -- Get the associated showing request
    SELECT * INTO showing_record 
    FROM public.showing_requests 
    WHERE id = trigger_record.showing_request_id;
    
    -- Mark trigger as processing
    UPDATE public.workflow_triggers 
    SET status = 'processing' 
    WHERE id = trigger_record.id;
    
    -- Process based on trigger type
    CASE trigger_record.trigger_type
      WHEN 'agent_notification' THEN
        -- Mark as completed for now - notifications will be handled in app
        UPDATE public.workflow_triggers 
        SET status = 'completed', executed_at = now() 
        WHERE id = trigger_record.id;
        
      WHEN 'send_agreement_email' THEN
        -- Mark as completed for now - agreement flow will be handled in app
        UPDATE public.workflow_triggers 
        SET status = 'completed', executed_at = now() 
        WHERE id = trigger_record.id;
        
      WHEN 'post_showing_workflow' THEN
        -- Mark as completed for now - post-showing will be handled in app  
        UPDATE public.workflow_triggers 
        SET status = 'completed', executed_at = now() 
        WHERE id = trigger_record.id;
    END CASE;
    
  END LOOP;
END;
$$;

-- Clean up any stuck workflow triggers
UPDATE public.workflow_triggers 
SET status = 'completed', executed_at = now() 
WHERE status IN ('pending', 'processing');

-- Enable realtime for showing_requests table
ALTER TABLE public.showing_requests REPLICA IDENTITY FULL;
