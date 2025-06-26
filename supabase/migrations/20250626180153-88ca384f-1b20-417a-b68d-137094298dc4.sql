
-- Add email notification tracking table
CREATE TABLE public.showing_email_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  showing_request_id UUID NOT NULL REFERENCES showing_requests(id),
  notification_type TEXT NOT NULL, -- 'agent_confirmation', 'agreement_request', etc.
  email_sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  email_opened_at TIMESTAMP WITH TIME ZONE,
  action_taken_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for email notifications
ALTER TABLE public.showing_email_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own email notifications"
  ON public.showing_email_notifications
  FOR SELECT
  USING (
    showing_request_id IN (
      SELECT id FROM showing_requests WHERE user_id = auth.uid()
    )
  );

-- Add agreement acceptance tracking
ALTER TABLE public.tour_agreements 
ADD COLUMN agreement_type TEXT DEFAULT 'single_tour',
ADD COLUMN terms_accepted_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN email_token TEXT,
ADD COLUMN token_expires_at TIMESTAMP WITH TIME ZONE;

-- Update showing status to include 'awaiting_agreement' status
-- This will be between 'agent_confirmed' and 'confirmed'

-- Create function to generate secure tokens for email links
CREATE OR REPLACE FUNCTION public.generate_agreement_token()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN encode(gen_random_bytes(32), 'base64url');
END;
$$;
