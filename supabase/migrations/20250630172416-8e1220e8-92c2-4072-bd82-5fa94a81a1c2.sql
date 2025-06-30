
-- Extend offer_intents table to store comprehensive offer information
ALTER TABLE public.offer_intents 
ADD COLUMN IF NOT EXISTS property_details JSONB,
ADD COLUMN IF NOT EXISTS financing_details JSONB,
ADD COLUMN IF NOT EXISTS contingencies JSONB,
ADD COLUMN IF NOT EXISTS additional_terms JSONB,
ADD COLUMN IF NOT EXISTS market_analysis JSONB,
ADD COLUMN IF NOT EXISTS offer_strategy JSONB,
ADD COLUMN IF NOT EXISTS questionnaire_completed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS agent_summary_generated_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS contract_type TEXT DEFAULT 'gcaar'; -- 'gcaar' or 'mar'

-- Create table for detailed questionnaire responses
CREATE TABLE IF NOT EXISTS public.offer_questionnaire_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  offer_intent_id UUID NOT NULL REFERENCES public.offer_intents(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  step_name TEXT NOT NULL,
  responses JSONB NOT NULL DEFAULT '{}',
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for agent-ready summaries
CREATE TABLE IF NOT EXISTS public.offer_preparation_summaries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  offer_intent_id UUID NOT NULL REFERENCES public.offer_intents(id) ON DELETE CASCADE,
  buyer_qualification_summary JSONB NOT NULL DEFAULT '{}',
  offer_strategy_summary JSONB NOT NULL DEFAULT '{}',
  financing_summary JSONB NOT NULL DEFAULT '{}',
  contingencies_summary JSONB NOT NULL DEFAULT '{}',
  required_documents JSONB NOT NULL DEFAULT '[]',
  required_forms JSONB NOT NULL DEFAULT '[]',
  special_conditions JSONB NOT NULL DEFAULT '[]',
  agent_checklist JSONB NOT NULL DEFAULT '[]',
  contract_type TEXT NOT NULL DEFAULT 'gcaar',
  generated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for offer_questionnaire_responses
ALTER TABLE public.offer_questionnaire_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own questionnaire responses" 
  ON public.offer_questionnaire_responses 
  FOR SELECT 
  USING (
    offer_intent_id IN (
      SELECT id FROM public.offer_intents WHERE buyer_id = auth.uid()
    )
  );

CREATE POLICY "Users can create their own questionnaire responses" 
  ON public.offer_questionnaire_responses 
  FOR INSERT 
  WITH CHECK (
    offer_intent_id IN (
      SELECT id FROM public.offer_intents WHERE buyer_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own questionnaire responses" 
  ON public.offer_questionnaire_responses 
  FOR UPDATE 
  USING (
    offer_intent_id IN (
      SELECT id FROM public.offer_intents WHERE buyer_id = auth.uid()
    )
  );

-- Add RLS policies for offer_preparation_summaries
ALTER TABLE public.offer_preparation_summaries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Buyers can view their own offer summaries" 
  ON public.offer_preparation_summaries 
  FOR SELECT 
  USING (
    offer_intent_id IN (
      SELECT id FROM public.offer_intents WHERE buyer_id = auth.uid()
    )
  );

CREATE POLICY "Agents can view summaries for their buyers" 
  ON public.offer_preparation_summaries 
  FOR SELECT 
  USING (
    offer_intent_id IN (
      SELECT id FROM public.offer_intents WHERE agent_id = auth.uid()
    )
  );

CREATE POLICY "System can create offer summaries" 
  ON public.offer_preparation_summaries 
  FOR INSERT 
  WITH CHECK (true);

-- Add updated_at trigger for questionnaire responses
CREATE OR REPLACE FUNCTION update_questionnaire_responses_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_questionnaire_responses_updated_at
    BEFORE UPDATE ON public.offer_questionnaire_responses
    FOR EACH ROW
    EXECUTE FUNCTION update_questionnaire_responses_updated_at();
