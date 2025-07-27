-- Make agent_id nullable in offer_intents table to support consultation requests without assigned agents
-- This allows buyers to create offer intents before an agent is assigned during the consultation booking process

-- Drop foreign key constraint temporarily if it exists
ALTER TABLE public.offer_intents DROP CONSTRAINT IF EXISTS offer_intents_agent_id_fkey;

-- Make agent_id nullable
ALTER TABLE public.offer_intents ALTER COLUMN agent_id DROP NOT NULL;

-- Recreate foreign key constraint with ON DELETE SET NULL instead of CASCADE
-- This prevents orphaned records when agents are deleted
ALTER TABLE public.offer_intents 
ADD CONSTRAINT offer_intents_agent_id_fkey 
FOREIGN KEY (agent_id) REFERENCES auth.users(id) ON DELETE SET NULL;

-- Update RLS policies to handle nullable agent_id
-- Drop existing agent view policy
DROP POLICY IF EXISTS "Agents can view offer intents where they are the agent" ON public.offer_intents;

-- Create new policy that handles null agent_id
CREATE POLICY "Agents can view offer intents where they are the agent"
  ON public.offer_intents
  FOR SELECT
  USING (auth.uid() = agent_id OR agent_id IS NULL);

-- Add policy for agents to update offer intents (for claiming unassigned ones)
CREATE POLICY "Agents can update offer intents to assign themselves"
  ON public.offer_intents
  FOR UPDATE
  USING (agent_id IS NULL OR auth.uid() = agent_id)
  WITH CHECK (auth.uid() = agent_id);