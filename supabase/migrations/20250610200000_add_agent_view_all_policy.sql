
-- Add policy for agents to view all requests so they can request assignments
CREATE POLICY "Agents can view all showing_requests for assignment" 
ON public.showing_requests 
FOR SELECT 
USING (public.get_user_type() = 'agent');
