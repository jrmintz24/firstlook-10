
-- Phase 1: Enable real-time for showing_requests table
-- Add REPLICA IDENTITY FULL to capture complete row data during updates
ALTER TABLE public.showing_requests REPLICA IDENTITY FULL;

-- Add showing_requests to the supabase_realtime publication to enable real-time functionality
ALTER PUBLICATION supabase_realtime ADD TABLE public.showing_requests;
