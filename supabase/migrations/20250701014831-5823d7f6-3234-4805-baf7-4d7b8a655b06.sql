
-- Add conversation_type to messages table to support different chat types
ALTER TABLE messages 
ADD COLUMN conversation_type text DEFAULT 'property' CHECK (conversation_type IN ('property', 'support'));

-- Create support_conversations table for admin chat management
CREATE TABLE support_conversations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  buyer_id uuid NOT NULL,
  admin_id uuid,
  status text DEFAULT 'open' CHECK (status IN ('open', 'assigned', 'closed')),
  priority text DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  subject text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  last_message_at timestamp with time zone DEFAULT now(),
  closed_at timestamp with time zone
);

-- Enable RLS on support_conversations
ALTER TABLE support_conversations ENABLE ROW LEVEL SECURITY;

-- Buyers can see their own support conversations
CREATE POLICY "Buyers can view their own support conversations" 
  ON support_conversations 
  FOR SELECT 
  USING (buyer_id = auth.uid());

-- Buyers can create support conversations
CREATE POLICY "Buyers can create support conversations" 
  ON support_conversations 
  FOR INSERT 
  WITH CHECK (buyer_id = auth.uid());

-- Admins can view all support conversations
CREATE POLICY "Admins can view all support conversations" 
  ON support_conversations 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND user_type = 'admin'
    )
  );

-- Update messages table policies to handle support conversations
DROP POLICY IF EXISTS "Users can view messages for their showings" ON messages;
DROP POLICY IF EXISTS "Users can send messages for their showings" ON messages;

-- New policy for property messages (existing functionality)
CREATE POLICY "Users can view property messages" 
  ON messages 
  FOR SELECT 
  USING (
    conversation_type = 'property' AND (
      sender_id = auth.uid() OR 
      receiver_id = auth.uid() OR
      EXISTS (
        SELECT 1 FROM showing_requests 
        WHERE id = showing_request_id 
        AND (user_id = auth.uid() OR assigned_agent_id = auth.uid())
      )
    )
  );

-- New policy for support messages
CREATE POLICY "Users can view support messages" 
  ON messages 
  FOR SELECT 
  USING (
    conversation_type = 'support' AND (
      sender_id = auth.uid() OR 
      receiver_id = auth.uid() OR
      EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() AND user_type = 'admin'
      )
    )
  );

-- Policy for sending property messages
CREATE POLICY "Users can send property messages" 
  ON messages 
  FOR INSERT 
  WITH CHECK (
    conversation_type = 'property' AND 
    sender_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM showing_requests 
      WHERE id = showing_request_id 
      AND (user_id = auth.uid() OR assigned_agent_id = auth.uid())
    )
  );

-- Policy for sending support messages
CREATE POLICY "Users can send support messages" 
  ON messages 
  FOR INSERT 
  WITH CHECK (
    conversation_type = 'support' AND 
    sender_id = auth.uid()
  );

-- Add trigger to update support_conversations last_message_at
CREATE OR REPLACE FUNCTION update_support_conversation_timestamp()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.conversation_type = 'support' AND NEW.showing_request_id IS NULL THEN
    -- Find the support conversation and update last_message_at
    UPDATE support_conversations 
    SET last_message_at = now(), updated_at = now()
    WHERE buyer_id = CASE 
      WHEN NEW.sender_id IN (SELECT id FROM profiles WHERE user_type = 'buyer') 
      THEN NEW.sender_id 
      ELSE NEW.receiver_id 
    END;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_support_conversation_timestamp_trigger
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_support_conversation_timestamp();

-- Add support_conversation_id to messages for better relationship tracking
ALTER TABLE messages 
ADD COLUMN support_conversation_id uuid REFERENCES support_conversations(id);
