
-- Create table for buyer-agent matches
CREATE TABLE public.buyer_agent_matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id uuid NOT NULL,
  agent_id uuid NOT NULL,
  showing_request_id uuid REFERENCES public.showing_requests(id),
  contact_revealed_at timestamp with time zone DEFAULT now(),
  match_source text DEFAULT 'post_showing',
  created_at timestamp with time zone DEFAULT now()
);

-- Create table for offer intents
CREATE TABLE public.offer_intents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id uuid NOT NULL,
  agent_id uuid NOT NULL,
  showing_request_id uuid REFERENCES public.showing_requests(id),
  property_address text NOT NULL,
  offer_type text, -- 'agent_assisted' or 'firstlook_generator'
  created_at timestamp with time zone DEFAULT now()
);

-- Add RLS policies for buyer_agent_matches
ALTER TABLE public.buyer_agent_matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Buyers can view their own matches"
  ON public.buyer_agent_matches
  FOR SELECT
  USING (auth.uid() = buyer_id);

CREATE POLICY "Agents can view matches where they are the agent"
  ON public.buyer_agent_matches
  FOR SELECT
  USING (auth.uid() = agent_id);

CREATE POLICY "Users can create matches for themselves as buyers"
  ON public.buyer_agent_matches
  FOR INSERT
  WITH CHECK (auth.uid() = buyer_id);

-- Add RLS policies for offer_intents
ALTER TABLE public.offer_intents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Buyers can view their own offer intents"
  ON public.offer_intents
  FOR SELECT
  USING (auth.uid() = buyer_id);

CREATE POLICY "Agents can view offer intents where they are the agent"
  ON public.offer_intents
  FOR SELECT
  USING (auth.uid() = agent_id);

CREATE POLICY "Users can create offer intents for themselves as buyers"
  ON public.offer_intents
  FOR INSERT
  WITH CHECK (auth.uid() = buyer_id);

-- Enhance property_favorites table with notes capability
ALTER TABLE public.property_favorites 
ADD COLUMN IF NOT EXISTS notes text;
