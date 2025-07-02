
-- Phase 1: Database Cleanup and Fixes

-- 1. Remove the problematic auto-assignment trigger that's causing foreign key violations
DROP TRIGGER IF EXISTS trg_auto_assign_agent ON public.showing_requests;

-- 2. Remove the problematic status transition trigger that creates workflow_triggers automatically
DROP TRIGGER IF EXISTS trg_handle_showing_status_transitions ON public.showing_requests;

-- 3. Clean up orphaned workflow_triggers that reference non-existent showing_requests
DELETE FROM public.workflow_triggers 
WHERE showing_request_id NOT IN (SELECT id FROM public.showing_requests);

-- 4. Configure showing_requests table for proper realtime functionality
ALTER TABLE public.showing_requests REPLICA IDENTITY FULL;

-- 5. Ensure the table is in the realtime publication
DO $$
BEGIN
    -- Add showing_requests to realtime publication if not already added
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND tablename = 'showing_requests'
    ) THEN
        PERFORM pg_catalog.pg_publication_add_table('supabase_realtime', 'showing_requests'::regclass);
    END IF;
END $$;

-- 6. Keep only the essential triggers for timestamp updates
CREATE OR REPLACE FUNCTION public.update_showing_requests_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = now();
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        NEW.status_updated_at = now();
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_update_showing_requests_updated_at ON public.showing_requests;
CREATE TRIGGER trg_update_showing_requests_updated_at
    BEFORE UPDATE ON public.showing_requests
    FOR EACH ROW EXECUTE FUNCTION public.update_showing_requests_updated_at();
