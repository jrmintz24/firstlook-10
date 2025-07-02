
-- Update the showing eligibility function to handle new tour limits
-- Free users get 5 tours per month, Pro users get unlimited
CREATE OR REPLACE FUNCTION public.check_showing_eligibility(user_uuid uuid)
RETURNS json AS $$
DECLARE
  profile_record public.profiles;
  current_month_showing_count INTEGER;
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
  
  -- If subscribed to Pro, always eligible (unlimited tours)
  IF FOUND THEN
    RETURN json_build_object(
      'eligible', true,
      'reason', 'subscribed',
      'subscription_tier', subscription_record.subscription_tier
    );
  END IF;
  
  -- Count showings in current month for free users
  SELECT COUNT(*) INTO current_month_showing_count
  FROM public.showing_requests 
  WHERE user_id = user_uuid 
  AND created_at >= date_trunc('month', CURRENT_DATE)
  AND created_at < date_trunc('month', CURRENT_DATE) + interval '1 month'
  AND status NOT IN ('cancelled');
  
  -- Free users get 5 tours per month
  IF current_month_showing_count < 5 THEN
    RETURN json_build_object(
      'eligible', true,
      'reason', 'within_monthly_limit',
      'tours_used', current_month_showing_count,
      'tours_remaining', 5 - current_month_showing_count
    );
  END IF;
  
  -- If monthly limit exceeded
  RETURN json_build_object(
    'eligible', false,
    'reason', 'monthly_limit_exceeded',
    'tours_used', current_month_showing_count,
    'tours_limit', 5
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Remove the old free_showing_used column as we now track monthly limits
ALTER TABLE public.profiles DROP COLUMN IF EXISTS free_showing_used;

-- Update subscription tiers to reflect new pricing
UPDATE public.subscribers 
SET subscription_tier = 'pro' 
WHERE subscription_tier IN ('premium', 'Premium');
