-- Function to create profiles for Auth0 users (bypasses RLS)
CREATE OR REPLACE FUNCTION public.create_auth0_profile(
  profile_id UUID,
  user_email TEXT,
  first_name TEXT DEFAULT '',
  last_name TEXT DEFAULT '',
  user_type TEXT DEFAULT 'buyer',
  profile_picture_url TEXT DEFAULT NULL
)
RETURNS JSON
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
  result JSON;
  new_profile public.profiles;
BEGIN
  -- Insert the profile (this function runs with elevated privileges, bypassing RLS)
  INSERT INTO public.profiles (
    id,
    email,
    first_name,
    last_name,
    user_type,
    profile_picture_url,
    onboarding_completed,
    created_at,
    updated_at
  )
  VALUES (
    profile_id,
    user_email,
    first_name,
    last_name,
    user_type,
    profile_picture_url,
    true,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    profile_picture_url = EXCLUDED.profile_picture_url,
    updated_at = NOW()
  RETURNING * INTO new_profile;

  -- Convert to JSON
  SELECT row_to_json(new_profile) INTO result;
  
  RETURN result;
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error creating Auth0 profile: %', SQLERRM;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.create_auth0_profile TO anon, authenticated;