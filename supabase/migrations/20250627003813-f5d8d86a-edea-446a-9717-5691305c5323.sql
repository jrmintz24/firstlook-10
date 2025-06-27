
-- First, let's check what statuses are currently allowed and update the constraint
-- Remove the old constraint and add a new one that includes awaiting_agreement
ALTER TABLE public.showing_requests 
DROP CONSTRAINT IF EXISTS showing_requests_status_check;

-- Add the new constraint that includes awaiting_agreement
ALTER TABLE public.showing_requests 
ADD CONSTRAINT showing_requests_status_check 
CHECK (status IN ('pending', 'submitted', 'under_review', 'agent_assigned', 'agent_confirmed', 'awaiting_agreement', 'confirmed', 'scheduled', 'in_progress', 'completed', 'cancelled'));

-- Now update any existing showing requests that are agent_confirmed to awaiting_agreement for testing
UPDATE showing_requests 
SET status = 'awaiting_agreement' 
WHERE status = 'agent_confirmed';

-- Add a function to generate secure tokens for agreement signing (rerun in case it didn't execute)
CREATE OR REPLACE FUNCTION public.generate_agreement_token()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN encode(gen_random_bytes(32), 'base64url');
END;
$$;

-- Update tour_agreements table to support email-based signing flow
ALTER TABLE public.tour_agreements 
ADD COLUMN IF NOT EXISTS email_token text,
ADD COLUMN IF NOT EXISTS token_expires_at timestamp with time zone;

-- Create index for faster token lookups
CREATE INDEX IF NOT EXISTS idx_tour_agreements_email_token ON public.tour_agreements(email_token);

-- Add trigger to automatically generate tokens when agreements are created
CREATE OR REPLACE FUNCTION public.set_agreement_token()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NEW.email_token IS NULL THEN
    NEW.email_token = public.generate_agreement_token();
    NEW.token_expires_at = now() + interval '7 days';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_agreement_token_trigger ON public.tour_agreements;
CREATE TRIGGER set_agreement_token_trigger
  BEFORE INSERT ON public.tour_agreements
  FOR EACH ROW
  EXECUTE FUNCTION public.set_agreement_token();
