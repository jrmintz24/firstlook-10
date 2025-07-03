
-- Fix all missing CASCADE DELETE foreign key constraints
-- This will allow proper user deletion by ensuring all related records are cleaned up

-- First, drop all existing foreign key constraints that need to be updated
ALTER TABLE agent_referrals DROP CONSTRAINT IF EXISTS agent_referrals_showing_request_id_fkey;
ALTER TABLE agent_notifications DROP CONSTRAINT IF EXISTS agent_notifications_showing_request_id_fkey;
ALTER TABLE agent_feedback DROP CONSTRAINT IF EXISTS agent_feedback_showing_request_id_fkey;
ALTER TABLE follow_up_questions DROP CONSTRAINT IF EXISTS follow_up_questions_showing_request_id_fkey;
ALTER TABLE offer_intents DROP CONSTRAINT IF EXISTS offer_intents_showing_request_id_fkey;
ALTER TABLE post_showing_actions DROP CONSTRAINT IF EXISTS post_showing_actions_showing_request_id_fkey;
ALTER TABLE property_favorites DROP CONSTRAINT IF EXISTS property_favorites_showing_request_id_fkey;
ALTER TABLE showing_attendance DROP CONSTRAINT IF EXISTS showing_attendance_showing_request_id_fkey;
ALTER TABLE showing_email_notifications DROP CONSTRAINT IF EXISTS showing_email_notifications_showing_request_id_fkey;
ALTER TABLE tour_agreements DROP CONSTRAINT IF EXISTS tour_agreements_showing_request_id_fkey;
ALTER TABLE workflow_triggers DROP CONSTRAINT IF EXISTS workflow_triggers_showing_request_id_fkey;
ALTER TABLE house_assignments DROP CONSTRAINT IF EXISTS house_assignments_user_id_fkey;
ALTER TABLE buyer_agent_matches DROP CONSTRAINT IF EXISTS buyer_agent_matches_showing_request_id_fkey;

-- Add foreign key constraints with proper CASCADE DELETE or SET NULL behavior
-- For showing_request_id references - CASCADE DELETE (when showing is deleted, related records should be deleted)
ALTER TABLE agent_referrals 
ADD CONSTRAINT agent_referrals_showing_request_id_fkey 
FOREIGN KEY (showing_request_id) REFERENCES showing_requests(id) ON DELETE CASCADE;

ALTER TABLE agent_notifications 
ADD CONSTRAINT agent_notifications_showing_request_id_fkey 
FOREIGN KEY (showing_request_id) REFERENCES showing_requests(id) ON DELETE CASCADE;

ALTER TABLE agent_feedback 
ADD CONSTRAINT agent_feedback_showing_request_id_fkey 
FOREIGN KEY (showing_request_id) REFERENCES showing_requests(id) ON DELETE CASCADE;

ALTER TABLE follow_up_questions 
ADD CONSTRAINT follow_up_questions_showing_request_id_fkey 
FOREIGN KEY (showing_request_id) REFERENCES showing_requests(id) ON DELETE CASCADE;

ALTER TABLE offer_intents 
ADD CONSTRAINT offer_intents_showing_request_id_fkey 
FOREIGN KEY (showing_request_id) REFERENCES showing_requests(id) ON DELETE SET NULL;

ALTER TABLE post_showing_actions 
ADD CONSTRAINT post_showing_actions_showing_request_id_fkey 
FOREIGN KEY (showing_request_id) REFERENCES showing_requests(id) ON DELETE CASCADE;

ALTER TABLE property_favorites 
ADD CONSTRAINT property_favorites_showing_request_id_fkey 
FOREIGN KEY (showing_request_id) REFERENCES showing_requests(id) ON DELETE SET NULL;

ALTER TABLE showing_attendance 
ADD CONSTRAINT showing_attendance_showing_request_id_fkey 
FOREIGN KEY (showing_request_id) REFERENCES showing_requests(id) ON DELETE CASCADE;

ALTER TABLE showing_email_notifications 
ADD CONSTRAINT showing_email_notifications_showing_request_id_fkey 
FOREIGN KEY (showing_request_id) REFERENCES showing_requests(id) ON DELETE CASCADE;

ALTER TABLE tour_agreements 
ADD CONSTRAINT tour_agreements_showing_request_id_fkey 
FOREIGN KEY (showing_request_id) REFERENCES showing_requests(id) ON DELETE CASCADE;

ALTER TABLE workflow_triggers 
ADD CONSTRAINT workflow_triggers_showing_request_id_fkey 
FOREIGN KEY (showing_request_id) REFERENCES showing_requests(id) ON DELETE CASCADE;

ALTER TABLE buyer_agent_matches 
ADD CONSTRAINT buyer_agent_matches_showing_request_id_fkey 
FOREIGN KEY (showing_request_id) REFERENCES showing_requests(id) ON DELETE SET NULL;

-- Fix house_assignments user_id to CASCADE DELETE
ALTER TABLE house_assignments 
ADD CONSTRAINT house_assignments_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Ensure consultation_bookings has proper CASCADE DELETE for both agent and buyer
ALTER TABLE consultation_bookings DROP CONSTRAINT IF EXISTS consultation_bookings_agent_id_fkey;
ALTER TABLE consultation_bookings DROP CONSTRAINT IF EXISTS consultation_bookings_buyer_id_fkey;

ALTER TABLE consultation_bookings 
ADD CONSTRAINT consultation_bookings_agent_id_fkey 
FOREIGN KEY (agent_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE consultation_bookings 
ADD CONSTRAINT consultation_bookings_buyer_id_fkey 
FOREIGN KEY (buyer_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Ensure offer_intents has proper CASCADE DELETE for both agent and buyer
ALTER TABLE offer_intents DROP CONSTRAINT IF EXISTS offer_intents_agent_id_fkey;
ALTER TABLE offer_intents DROP CONSTRAINT IF EXISTS offer_intents_buyer_id_fkey;

ALTER TABLE offer_intents 
ADD CONSTRAINT offer_intents_agent_id_fkey 
FOREIGN KEY (agent_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE offer_intents 
ADD CONSTRAINT offer_intents_buyer_id_fkey 
FOREIGN KEY (buyer_id) REFERENCES auth.users(id) ON DELETE CASCADE;
