
-- Add buyer consent tracking to control when agents can see contact info
ALTER TABLE showing_requests 
ADD COLUMN buyer_consents_to_contact boolean DEFAULT false;

-- Add message access control
ALTER TABLE messages 
ADD COLUMN access_expires_at timestamp with time zone;

-- Create function to check if agent can access buyer contact info
CREATE OR REPLACE FUNCTION can_agent_access_buyer_contact(
  p_showing_request_id uuid,
  p_agent_id uuid
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  showing_record showing_requests;
BEGIN
  -- Get showing details
  SELECT * INTO showing_record
  FROM showing_requests
  WHERE id = p_showing_request_id;
  
  -- Agent can only see contact info if:
  -- 1. Showing is completed
  -- 2. Buyer has consented to contact
  -- 3. Agent was assigned to this showing
  RETURN (
    showing_record.status = 'completed' AND
    showing_record.buyer_consents_to_contact = true AND
    showing_record.assigned_agent_id = p_agent_id
  );
END;
$$;

-- Create function to automatically expire message access
CREATE OR REPLACE FUNCTION expire_message_access()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- When showing is cancelled, expire messages immediately
  IF NEW.status = 'cancelled' AND OLD.status != 'cancelled' THEN
    UPDATE messages 
    SET access_expires_at = now()
    WHERE showing_request_id = NEW.id;
  END IF;
  
  -- When showing is completed, expire messages after 1 week
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    UPDATE messages 
    SET access_expires_at = now() + interval '7 days'
    WHERE showing_request_id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to automatically expire message access
CREATE TRIGGER trigger_expire_message_access
  AFTER UPDATE ON showing_requests
  FOR EACH ROW
  EXECUTE FUNCTION expire_message_access();
