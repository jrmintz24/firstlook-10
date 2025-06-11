
-- Create tables for post-showing workflow

-- Table to track showing attendance and status
CREATE TABLE public.showing_attendance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  showing_request_id UUID NOT NULL REFERENCES public.showing_requests(id) ON DELETE CASCADE,
  buyer_checked_out BOOLEAN DEFAULT FALSE,
  agent_checked_out BOOLEAN DEFAULT FALSE,
  buyer_checkout_time TIMESTAMP WITH TIME ZONE NULL,
  agent_checkout_time TIMESTAMP WITH TIME ZONE NULL,
  buyer_attended BOOLEAN NULL,
  agent_attended BOOLEAN NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for buyer feedback and reviews
CREATE TABLE public.buyer_feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  showing_request_id UUID NOT NULL REFERENCES public.showing_requests(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  agent_id UUID NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  property_rating INTEGER CHECK (property_rating >= 1 AND property_rating <= 5),
  agent_rating INTEGER CHECK (agent_rating >= 1 AND agent_rating <= 5),
  property_comments TEXT,
  agent_comments TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for agent feedback
CREATE TABLE public.agent_feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  showing_request_id UUID NOT NULL REFERENCES public.showing_requests(id) ON DELETE CASCADE,
  agent_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  buyer_interest_level INTEGER CHECK (buyer_interest_level >= 1 AND buyer_interest_level <= 5),
  buyer_seriousness_rating INTEGER CHECK (buyer_seriousness_rating >= 1 AND buyer_seriousness_rating <= 5),
  notes TEXT,
  recommend_buyer BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for post-showing actions taken by buyers
CREATE TABLE public.post_showing_actions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  showing_request_id UUID NOT NULL REFERENCES public.showing_requests(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL CHECK (action_type IN (
    'schedule_same_agent',
    'schedule_different_agent', 
    'work_with_agent',
    'request_offer_assistance',
    'favorite_property',
    'request_disclosures',
    'ask_question',
    'no_action'
  )),
  action_details JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for workflow automation tracking
CREATE TABLE public.workflow_triggers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  showing_request_id UUID NOT NULL REFERENCES public.showing_requests(id) ON DELETE CASCADE,
  trigger_type TEXT NOT NULL CHECK (trigger_type IN (
    'post_showing_workflow',
    'follow_up_nudge',
    'agent_notification',
    'attendance_confirmation'
  )),
  scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
  executed_at TIMESTAMP WITH TIME ZONE NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'executed', 'cancelled')),
  payload JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for buyer property favorites
CREATE TABLE public.property_favorites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  buyer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  property_address TEXT NOT NULL,
  showing_request_id UUID NULL REFERENCES public.showing_requests(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(buyer_id, property_address)
);

-- Table for follow-up questions
CREATE TABLE public.follow_up_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  showing_request_id UUID NOT NULL REFERENCES public.showing_requests(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  agent_id UUID NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NULL,
  answered_at TIMESTAMP WITH TIME ZONE NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_showing_attendance_updated_at 
    BEFORE UPDATE ON public.showing_attendance 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS on all new tables
ALTER TABLE public.showing_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buyer_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_showing_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_triggers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follow_up_questions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for showing_attendance
CREATE POLICY "Users can view their showing attendance" 
ON public.showing_attendance FOR SELECT 
USING (
  auth.uid() IN (
    SELECT user_id FROM public.showing_requests WHERE id = showing_request_id
    UNION
    SELECT assigned_agent_id FROM public.showing_requests WHERE id = showing_request_id
  ) OR public.get_user_type() = 'admin'
);

CREATE POLICY "Users can update their showing attendance" 
ON public.showing_attendance FOR ALL
USING (
  auth.uid() IN (
    SELECT user_id FROM public.showing_requests WHERE id = showing_request_id
    UNION
    SELECT assigned_agent_id FROM public.showing_requests WHERE id = showing_request_id
  ) OR public.get_user_type() = 'admin'
);

-- RLS Policies for buyer_feedback
CREATE POLICY "Buyers can manage their feedback" 
ON public.buyer_feedback FOR ALL
USING (auth.uid() = buyer_id OR public.get_user_type() = 'admin');

CREATE POLICY "Agents can view feedback about them" 
ON public.buyer_feedback FOR SELECT
USING (auth.uid() = agent_id OR public.get_user_type() = 'admin');

-- RLS Policies for agent_feedback
CREATE POLICY "Agents can manage their feedback" 
ON public.agent_feedback FOR ALL
USING (auth.uid() = agent_id OR public.get_user_type() = 'admin');

CREATE POLICY "Buyers can view feedback about them" 
ON public.agent_feedback FOR SELECT
USING (auth.uid() = buyer_id OR public.get_user_type() = 'admin');

-- RLS Policies for post_showing_actions
CREATE POLICY "Buyers can manage their actions" 
ON public.post_showing_actions FOR ALL
USING (auth.uid() = buyer_id OR public.get_user_type() = 'admin');

-- RLS Policies for workflow_triggers
CREATE POLICY "Admins can manage workflow triggers" 
ON public.workflow_triggers FOR ALL
USING (public.get_user_type() = 'admin');

-- RLS Policies for property_favorites
CREATE POLICY "Buyers can manage their favorites" 
ON public.property_favorites FOR ALL
USING (auth.uid() = buyer_id OR public.get_user_type() = 'admin');

-- RLS Policies for follow_up_questions
CREATE POLICY "Users can view their questions" 
ON public.follow_up_questions FOR SELECT
USING (
  auth.uid() = buyer_id OR 
  auth.uid() = agent_id OR 
  public.get_user_type() = 'admin'
);

CREATE POLICY "Buyers can create questions" 
ON public.follow_up_questions FOR INSERT
WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Agents can answer questions" 
ON public.follow_up_questions FOR UPDATE
USING (auth.uid() = agent_id OR public.get_user_type() = 'admin');
