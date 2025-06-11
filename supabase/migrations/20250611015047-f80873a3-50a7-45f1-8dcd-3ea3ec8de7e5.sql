
-- Add subscription tracking table
CREATE TABLE public.subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  stripe_customer_id TEXT,
  subscribed BOOLEAN NOT NULL DEFAULT false,
  subscription_tier TEXT,
  subscription_end TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add showing eligibility tracking to profiles
ALTER TABLE public.profiles 
ADD COLUMN free_showing_used BOOLEAN DEFAULT false,
ADD COLUMN subscription_status TEXT DEFAULT 'none' CHECK (subscription_status IN ('none', 'trial', 'active', 'cancelled', 'expired'));

-- Enable RLS
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- RLS policies for subscribers
CREATE POLICY "Users can view their own subscription" 
ON public.subscribers FOR SELECT 
USING (user_id = auth.uid() OR email = auth.email());

CREATE POLICY "Users can update their own subscription" 
ON public.subscribers FOR UPDATE 
USING (user_id = auth.uid() OR email = auth.email());

CREATE POLICY "Service can insert subscriptions" 
ON public.subscribers FOR INSERT 
WITH CHECK (true);

-- Function to check showing eligibility
CREATE OR REPLACE FUNCTION public.check_showing_eligibility(user_uuid UUID)
RETURNS JSON AS $$
DECLARE
  profile_record public.profiles;
  active_showing_count INTEGER;
  subscription_record public.subscribers;
  result JSON;
BEGIN
  -- Get user profile
  SELECT * INTO profile_record 
  FROM public.profiles 
  WHERE id = user_uuid;
  
  IF NOT FOUND THEN
    RETURN json_build_object(
      'eligible', false,
      'reason', 'profile_not_found'
    );
  END IF;
  
  -- Check subscription status
  SELECT * INTO subscription_record 
  FROM public.subscribers 
  WHERE user_id = user_uuid AND subscribed = true;
  
  -- If subscribed, always eligible
  IF FOUND THEN
    RETURN json_build_object(
      'eligible', true,
      'reason', 'subscribed',
      'subscription_tier', subscription_record.subscription_tier
    );
  END IF;
  
  -- Count active showings (not completed or cancelled)
  SELECT COUNT(*) INTO active_showing_count
  FROM public.showing_requests 
  WHERE user_id = user_uuid 
  AND status NOT IN ('completed', 'cancelled');
  
  -- If no active showings and free showing not used, eligible
  IF active_showing_count = 0 AND NOT COALESCE(profile_record.free_showing_used, false) THEN
    RETURN json_build_object(
      'eligible', true,
      'reason', 'first_free_showing'
    );
  END IF;
  
  -- If has active showing, not eligible for another
  IF active_showing_count > 0 THEN
    RETURN json_build_object(
      'eligible', false,
      'reason', 'active_showing_exists',
      'active_showing_count', active_showing_count
    );
  END IF;
  
  -- If free showing already used and not subscribed
  RETURN json_build_object(
    'eligible', false,
    'reason', 'free_showing_used'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to mark free showing as used
CREATE OR REPLACE FUNCTION public.mark_free_showing_used(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE public.profiles 
  SET free_showing_used = true 
  WHERE id = user_uuid;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to reset free showing eligibility (when cancelling)
CREATE OR REPLACE FUNCTION public.reset_free_showing_eligibility(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  active_showing_count INTEGER;
BEGIN
  -- Check if user has any active showings
  SELECT COUNT(*) INTO active_showing_count
  FROM public.showing_requests 
  WHERE user_id = user_uuid 
  AND status NOT IN ('completed', 'cancelled');
  
  -- Only reset if no active showings
  IF active_showing_count = 0 THEN
    UPDATE public.profiles 
    SET free_showing_used = false 
    WHERE id = user_uuid;
    
    RETURN true;
  END IF;
  
  RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
