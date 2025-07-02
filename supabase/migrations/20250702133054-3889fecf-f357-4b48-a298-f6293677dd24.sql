
-- Create function to auto-assign agents to showing requests
CREATE OR REPLACE FUNCTION public.auto_assign_agent_to_showing()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  selected_agent_id uuid;
  selected_agent_name text;
  selected_agent_email text;
  selected_agent_phone text;
BEGIN
  -- Only process pending requests without assigned agents
  IF NEW.status = 'pending' AND NEW.assigned_agent_id IS NULL THEN
    -- Simple round-robin agent assignment (you can make this more sophisticated)
    SELECT id, first_name || ' ' || last_name, phone
    INTO selected_agent_id, selected_agent_name, selected_agent_phone
    FROM public.profiles 
    WHERE user_type = 'agent' AND profile_status = 'active'
    ORDER BY id
    LIMIT 1;
    
    IF selected_agent_id IS NOT NULL THEN
      -- Update the showing request with agent assignment
      NEW.assigned_agent_id := selected_agent_id;
      NEW.assigned_agent_name := selected_agent_name;
      NEW.assigned_agent_phone := selected_agent_phone;
      NEW.status := 'agent_assigned';
      NEW.status_updated_at := now();
      NEW.estimated_confirmation_date := CURRENT_DATE + interval '2 days';
      
      -- Log the assignment
      INSERT INTO public.workflow_triggers (
        showing_request_id,
        trigger_type,
        scheduled_for,
        payload
      ) VALUES (
        NEW.id,
        'agent_notification',
        now(),
        json_build_object(
          'agent_id', selected_agent_id,
          'notification_type', 'new_assignment'
        )
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for auto-assignment
DROP TRIGGER IF EXISTS trg_auto_assign_agent ON public.showing_requests;
CREATE TRIGGER trg_auto_assign_agent
  BEFORE INSERT OR UPDATE ON public.showing_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_assign_agent_to_showing();

-- Create function to handle status transitions and trigger workflows
CREATE OR REPLACE FUNCTION public.handle_showing_status_transitions()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  -- When agent confirms showing, move to awaiting agreement
  IF NEW.status = 'agent_confirmed' AND OLD.status != 'agent_confirmed' THEN
    NEW.status := 'awaiting_agreement';
    
    -- Schedule agreement email
    INSERT INTO public.workflow_triggers (
      showing_request_id,
      trigger_type,
      scheduled_for,
      payload
    ) VALUES (
      NEW.id,
      'send_agreement_email',
      now() + interval '5 minutes',
      json_build_object(
        'buyer_id', NEW.user_id,
        'agent_id', NEW.assigned_agent_id,
        'property_address', NEW.property_address
      )
    );
  END IF;
  
  -- When agreement is signed, move to confirmed
  IF NEW.status = 'confirmed' AND OLD.status = 'awaiting_agreement' THEN
    -- Schedule post-showing workflow
    IF NEW.preferred_date IS NOT NULL AND NEW.preferred_time IS NOT NULL THEN
      INSERT INTO public.workflow_triggers (
        showing_request_id,
        trigger_type,
        scheduled_for,
        payload
      ) VALUES (
        NEW.id,
        'post_showing_workflow',
        (NEW.preferred_date::date + NEW.preferred_time::time) + interval '30 minutes',
        json_build_object('auto_triggered', true)
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for status transitions
DROP TRIGGER IF EXISTS trg_handle_status_transitions ON public.showing_requests;
CREATE TRIGGER trg_handle_status_transitions
  BEFORE UPDATE ON public.showing_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_showing_status_transitions();

-- Create function to process workflow triggers
CREATE OR REPLACE FUNCTION public.process_workflow_triggers()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  trigger_record public.workflow_triggers;
  showing_record public.showing_requests;
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
        -- This will be handled by the edge function
        PERFORM net.http_post(
          url := 'https://uugchegukcccuqpcsqhl.supabase.co/functions/v1/notify-agent',
          headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1Z2NoZWd1a2NjY3VxcGNzcWhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3MTU4NzQsImV4cCI6MjA2NDI5MTg3NH0.4r_GivJvzSZGgFizHGKoGdGnxa7hbZJr2FhgnAUeGdE"}'::jsonb,
          body := json_build_object('requestId', trigger_record.showing_request_id)::jsonb
        );
        
      WHEN 'send_agreement_email' THEN
        -- This will be handled by the edge function
        PERFORM net.http_post(
          url := 'https://uugchegukcccuqpcsqhl.supabase.co/functions/v1/send-agreement-email',
          headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1Z2NoZWd1a2NjY3VxcGNzcWhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3MTU4NzQsImV4cCI6MjA2NDI5MTg3NH0.4r_GivJvzSZGgFizHGKoGdGnxa7hbZJr2FhgnAUeGdE"}'::jsonb,
          body := json_build_object(
            'showing_request_id', trigger_record.showing_request_id,
            'buyer_user_id', showing_record.user_id,
            'buyer_name', 'Buyer',
            'property_address', showing_record.property_address,
            'agent_name', showing_record.assigned_agent_name,
            'preferred_date', showing_record.preferred_date,
            'preferred_time', showing_record.preferred_time
          )::jsonb
        );
        
      WHEN 'post_showing_workflow' THEN
        -- This will be handled by the edge function
        PERFORM net.http_post(
          url := 'https://uugchegukcccuqpcsqhl.supabase.co/functions/v1/post-showing-workflow',
          headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1Z2NoZWd1a2NjY3VxcGNzcWhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3MTU4NzQsImV4cCI6MjA2NDI5MTg3NH0.4r_GivJvzSZGgFizHGKoGdGnxa7hbZJr2FhgnAUeGdE"}'::jsonb,
          body := json_build_object(
            'action', 'trigger_workflow',
            'showing_request_id', trigger_record.showing_request_id
          )::jsonb
        );
    END CASE;
    
    -- Mark trigger as completed
    UPDATE public.workflow_triggers 
    SET status = 'completed', executed_at = now() 
    WHERE id = trigger_record.id;
    
  END LOOP;
END;
$$;

-- Enable required extensions for HTTP calls and cron jobs
CREATE EXTENSION IF NOT EXISTS pg_net;
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule the workflow processor to run every minute
SELECT cron.schedule(
  'process-workflow-triggers',
  '* * * * *', -- every minute
  'SELECT public.process_workflow_triggers();'
);
