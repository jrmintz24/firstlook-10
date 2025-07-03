
-- Enable realtime for the messages table
ALTER TABLE public.messages REPLICA IDENTITY FULL;
ALTER TABLE public.showing_requests REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.showing_requests;
