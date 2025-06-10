
-- First, let's check if there are existing RLS policies on showing_requests and update them
-- Drop existing policies if they exist and recreate them with admin access

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view showing_requests" ON public.showing_requests;
DROP POLICY IF EXISTS "Users can create showing_requests" ON public.showing_requests;
DROP POLICY IF EXISTS "Users can update showing_requests" ON public.showing_requests;
DROP POLICY IF EXISTS "Agents can view showing_requests" ON public.showing_requests;
DROP POLICY IF EXISTS "Admins can view all showing_requests" ON public.showing_requests;
DROP POLICY IF EXISTS "Admins can update all showing_requests" ON public.showing_requests;

-- Create a security definer function to get user type from profiles
CREATE OR REPLACE FUNCTION public.get_user_type()
RETURNS TEXT AS $$
  SELECT user_type FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Enable RLS on showing_requests if not already enabled
ALTER TABLE public.showing_requests ENABLE ROW LEVEL SECURITY;

-- Create comprehensive RLS policies for showing_requests

-- Admin users can view all showing requests
CREATE POLICY "Admins can view all showing_requests" 
ON public.showing_requests 
FOR SELECT 
USING (public.get_user_type() = 'admin');

-- Admin users can update all showing requests
CREATE POLICY "Admins can update all showing_requests" 
ON public.showing_requests 
FOR UPDATE 
USING (public.get_user_type() = 'admin');

-- Admin users can insert showing requests
CREATE POLICY "Admins can insert showing_requests" 
ON public.showing_requests 
FOR INSERT 
WITH CHECK (public.get_user_type() = 'admin');

-- Buyers can view their own showing requests
CREATE POLICY "Buyers can view own showing_requests" 
ON public.showing_requests 
FOR SELECT 
USING (auth.uid() = user_id AND public.get_user_type() = 'buyer');

-- Buyers can create their own showing requests
CREATE POLICY "Buyers can create showing_requests" 
ON public.showing_requests 
FOR INSERT 
WITH CHECK (auth.uid() = user_id AND public.get_user_type() = 'buyer');

-- Agents can view requests they are assigned to or have requested
CREATE POLICY "Agents can view assigned requests" 
ON public.showing_requests 
FOR SELECT 
USING (
  public.get_user_type() = 'agent' AND 
  (auth.uid() = assigned_agent_id OR auth.uid() = requested_agent_id)
);

-- Agents can update requests they are assigned to
CREATE POLICY "Agents can update assigned requests" 
ON public.showing_requests 
FOR UPDATE 
USING (
  public.get_user_type() = 'agent' AND 
  (auth.uid() = assigned_agent_id OR auth.uid() = requested_agent_id)
);
