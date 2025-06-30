
-- Add buyer profile status tracking
ALTER TABLE public.profiles 
ADD COLUMN agent_connected_id uuid REFERENCES public.profiles(id),
ADD COLUMN agent_connected_at timestamp with time zone,
ADD COLUMN profile_status text DEFAULT 'active';

-- Create agent referral tracking table
CREATE TABLE public.agent_referrals (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  buyer_id uuid NOT NULL,
  agent_id uuid NOT NULL,
  showing_request_id uuid REFERENCES public.showing_requests(id),
  referral_type text NOT NULL DEFAULT 'hire_agent',
  commission_rate numeric(5,4),
  referral_date timestamp with time zone NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'active',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Add buyer qualification fields to profiles
ALTER TABLE public.profiles
ADD COLUMN pre_approval_amount numeric,
ADD COLUMN pre_approval_status text,
ADD COLUMN budget_min numeric,
ADD COLUMN budget_max numeric,
ADD COLUMN buying_timeline text,
ADD COLUMN qualification_updated_at timestamp with time zone;

-- Enhance offer_intents table with buyer qualification tracking
ALTER TABLE public.offer_intents
ADD COLUMN buyer_qualification jsonb,
ADD COLUMN consultation_requested boolean DEFAULT false,
ADD COLUMN consultation_scheduled_at timestamp with time zone,
ADD COLUMN agent_preference text;

-- Create agent notifications table
CREATE TABLE public.agent_notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id uuid NOT NULL,
  buyer_id uuid NOT NULL,
  showing_request_id uuid REFERENCES public.showing_requests(id),
  notification_type text NOT NULL,
  message text NOT NULL,
  read_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  metadata jsonb
);

-- Add RLS policies for new tables
ALTER TABLE public.agent_referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_notifications ENABLE ROW LEVEL SECURITY;

-- Agent referrals policies
CREATE POLICY "Agents can view their referrals" ON public.agent_referrals
  FOR SELECT USING (agent_id = auth.uid());

CREATE POLICY "Buyers can view their referrals" ON public.agent_referrals  
  FOR SELECT USING (buyer_id = auth.uid());

CREATE POLICY "System can insert referrals" ON public.agent_referrals
  FOR INSERT WITH CHECK (true);

-- Agent notifications policies  
CREATE POLICY "Agents can view their notifications" ON public.agent_notifications
  FOR SELECT USING (agent_id = auth.uid());

CREATE POLICY "Agents can update their notifications" ON public.agent_notifications
  FOR UPDATE USING (agent_id = auth.uid());

CREATE POLICY "System can insert notifications" ON public.agent_notifications
  FOR INSERT WITH CHECK (true);
