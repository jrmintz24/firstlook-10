
-- Fix the handle_new_user function to prevent foreign key violations
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  -- Insert into profiles with proper error handling
  INSERT INTO public.profiles (
    id, 
    first_name, 
    last_name, 
    phone, 
    user_type, 
    license_number
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'first_name', NEW.raw_user_meta_data ->> 'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data ->> 'last_name', ''),
    NEW.raw_user_meta_data ->> 'phone',
    COALESCE(NEW.raw_user_meta_data ->> 'user_type', 'buyer'),
    NEW.raw_user_meta_data ->> 'license_number'
  )
  ON CONFLICT (id) DO UPDATE SET
    first_name = COALESCE(EXCLUDED.first_name, profiles.first_name),
    last_name = COALESCE(EXCLUDED.last_name, profiles.last_name),
    phone = COALESCE(EXCLUDED.phone, profiles.phone),
    user_type = COALESCE(EXCLUDED.user_type, profiles.user_type),
    license_number = COALESCE(EXCLUDED.license_number, profiles.license_number);
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't block user creation
    RAISE WARNING 'Error creating profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Add constraint to prevent null user_id in showing_requests for authenticated users
ALTER TABLE public.showing_requests 
ADD CONSTRAINT check_user_id_not_null 
CHECK (user_id IS NOT NULL OR status = 'pending');

-- Update any existing null user_id records where possible
-- This is a one-time cleanup - we'll match by email or other identifiers if available
UPDATE public.showing_requests 
SET user_id = (
  SELECT auth.users.id 
  FROM auth.users 
  WHERE auth.users.email = showing_requests.assigned_agent_email
  LIMIT 1
)
WHERE user_id IS NULL 
AND assigned_agent_email IS NOT NULL
AND EXISTS (
  SELECT 1 FROM auth.users WHERE auth.users.email = showing_requests.assigned_agent_email
);
