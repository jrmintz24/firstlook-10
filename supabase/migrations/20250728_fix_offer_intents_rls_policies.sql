-- Fix RLS policies for offer_intents table to allow proper consultation requests
-- The INSERT policy was restrictive and preventing buyers from creating offer intents

-- Drop existing INSERT policy that's causing issues
DROP POLICY IF EXISTS "Users can create offer intents for themselves as buyers" ON public.offer_intents;

-- Create more permissive INSERT policy that allows buyers to create offer intents
CREATE POLICY "Buyers can create offer intents"
  ON public.offer_intents
  FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated' 
    AND auth.uid() = buyer_id
  );

-- Also ensure we have proper SELECT policies (in case they're missing)
DROP POLICY IF EXISTS "Buyers can view their own offer intents" ON public.offer_intents;
DROP POLICY IF EXISTS "Agents can view offer intents where they are the agent" ON public.offer_intents;

-- Recreate SELECT policies with better logic
CREATE POLICY "Buyers can view their own offer intents"
  ON public.offer_intents
  FOR SELECT
  USING (auth.role() = 'authenticated' AND auth.uid() = buyer_id);

CREATE POLICY "Agents can view offer intents where they are assigned or unassigned"
  ON public.offer_intents
  FOR SELECT
  USING (
    auth.role() = 'authenticated' 
    AND (auth.uid() = agent_id OR agent_id IS NULL)
  );

-- Update UPDATE policy to be more permissive for consultation workflow
DROP POLICY IF EXISTS "Agents can update offer intents to assign themselves" ON public.offer_intents;

CREATE POLICY "Authenticated users can update offer intents"
  ON public.offer_intents
  FOR UPDATE
  USING (
    auth.role() = 'authenticated' 
    AND (auth.uid() = buyer_id OR auth.uid() = agent_id OR agent_id IS NULL)
  )
  WITH CHECK (
    auth.role() = 'authenticated'
    AND (auth.uid() = buyer_id OR auth.uid() = agent_id)
  );

-- Add DELETE policy if missing
DROP POLICY IF EXISTS "Users can delete their own offer intents" ON public.offer_intents;

CREATE POLICY "Users can delete their own offer intents"
  ON public.offer_intents
  FOR DELETE
  USING (
    auth.role() = 'authenticated' 
    AND (auth.uid() = buyer_id OR auth.uid() = agent_id)
  );

-- Add comment to track this fix
COMMENT ON TABLE public.offer_intents IS 'RLS policies fixed for consultation requests - 2025-07-28';