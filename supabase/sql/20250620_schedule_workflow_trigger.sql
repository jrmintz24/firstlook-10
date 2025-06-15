-- Automatically schedule post-showing workflow when a showing is confirmed
-- or scheduled. Mirrors client-side logic in PostShowingTrigger.tsx

CREATE OR REPLACE FUNCTION public.auto_schedule_post_showing_workflow()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  scheduled_time timestamptz;
BEGIN
  IF NEW.status IN ('confirmed', 'scheduled') AND (TG_OP = 'INSERT' OR NEW.status IS DISTINCT FROM OLD.status) THEN
    IF NEW.preferred_date IS NOT NULL AND NEW.preferred_time IS NOT NULL THEN
      -- Convert separate date and time columns to a timestamp
      scheduled_time := (NEW.preferred_date::date + NEW.preferred_time::time)
                         + interval '1 hour'    -- typical showing duration
                         + interval '30 minutes'; -- delay before workflow

      INSERT INTO public.workflow_triggers (
        showing_request_id,
        trigger_type,
        scheduled_for,
        payload
      ) VALUES (
        NEW.id,
        'post_showing_workflow',
        scheduled_time,
        json_build_object('auto_triggered', true)
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_auto_schedule_post_showing_workflow ON public.showing_requests;
CREATE TRIGGER trg_auto_schedule_post_showing_workflow
AFTER INSERT OR UPDATE ON public.showing_requests
FOR EACH ROW EXECUTE FUNCTION public.auto_schedule_post_showing_workflow();
