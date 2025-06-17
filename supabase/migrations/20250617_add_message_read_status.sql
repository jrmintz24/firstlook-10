
-- Add read status tracking to messages
ALTER TABLE public.messages 
ADD COLUMN read_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- Update existing messages to be marked as read (for migration purposes)
UPDATE public.messages 
SET read_at = created_at 
WHERE created_at < NOW() - INTERVAL '1 hour';
