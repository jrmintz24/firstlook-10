
-- Re-implement CASCADE DELETE foreign key constraints that were lost in the revert
-- This ensures proper cleanup when users are deleted

-- First, drop existing foreign key constraints if they exist
ALTER TABLE showing_requests DROP CONSTRAINT IF EXISTS showing_requests_user_id_fkey;
ALTER TABLE showing_requests DROP CONSTRAINT IF EXISTS showing_requests_assigned_agent_id_fkey;
ALTER TABLE showing_requests DROP CONSTRAINT IF EXISTS showing_requests_requested_agent_id_fkey;

ALTER TABLE messages DROP CONSTRAINT IF EXISTS messages_sender_id_fkey;
ALTER TABLE messages DROP CONSTRAINT IF EXISTS messages_receiver_id_fkey;

ALTER TABLE tour_agreements DROP CONSTRAINT IF EXISTS tour_agreements_buyer_id_fkey;
ALTER TABLE tour_agreements DROP CONSTRAINT IF EXISTS tour_agreements_agent_id_fkey;

ALTER TABLE consultation_bookings DROP CONSTRAINT IF EXISTS consultation_bookings_buyer_id_fkey;
ALTER TABLE consultation_bookings DROP CONSTRAINT IF EXISTS consultation_bookings_agent_id_fkey;

ALTER TABLE offer_intents DROP CONSTRAINT IF EXISTS offer_intents_buyer_id_fkey;
ALTER TABLE offer_intents DROP CONSTRAINT IF EXISTS offer_intents_agent_id_fkey;

ALTER TABLE buyer_feedback DROP CONSTRAINT IF EXISTS buyer_feedback_buyer_id_fkey;
ALTER TABLE buyer_feedback DROP CONSTRAINT IF EXISTS buyer_feedback_agent_id_fkey;

ALTER TABLE agent_feedback DROP CONSTRAINT IF EXISTS agent_feedback_buyer_id_fkey;
ALTER TABLE agent_feedback DROP CONSTRAINT IF EXISTS agent_feedback_agent_id_fkey;

ALTER TABLE property_favorites DROP CONSTRAINT IF EXISTS property_favorites_buyer_id_fkey;

ALTER TABLE post_showing_actions DROP CONSTRAINT IF EXISTS post_showing_actions_buyer_id_fkey;

ALTER TABLE buyer_agent_matches DROP CONSTRAINT IF EXISTS buyer_agent_matches_buyer_id_fkey;
ALTER TABLE buyer_agent_matches DROP CONSTRAINT IF EXISTS buyer_agent_matches_agent_id_fkey;

ALTER TABLE agent_referrals DROP CONSTRAINT IF EXISTS agent_referrals_buyer_id_fkey;
ALTER TABLE agent_referrals DROP CONSTRAINT IF EXISTS agent_referrals_agent_id_fkey;

ALTER TABLE follow_up_questions DROP CONSTRAINT IF EXISTS follow_up_questions_buyer_id_fkey;
ALTER TABLE follow_up_questions DROP CONSTRAINT IF EXISTS follow_up_questions_agent_id_fkey;

ALTER TABLE support_conversations DROP CONSTRAINT IF EXISTS support_conversations_buyer_id_fkey;
ALTER TABLE support_conversations DROP CONSTRAINT IF EXISTS support_conversations_admin_id_fkey;

ALTER TABLE agent_notifications DROP CONSTRAINT IF EXISTS agent_notifications_agent_id_fkey;
ALTER TABLE agent_notifications DROP CONSTRAINT IF EXISTS agent_notifications_buyer_id_fkey;

ALTER TABLE agent_availability DROP CONSTRAINT IF EXISTS agent_availability_agent_id_fkey;

ALTER TABLE profile_photos DROP CONSTRAINT IF EXISTS profile_photos_user_id_fkey;

ALTER TABLE subscribers DROP CONSTRAINT IF EXISTS subscribers_user_id_fkey;

-- Now add the foreign key constraints with CASCADE DELETE
-- Showing requests
ALTER TABLE showing_requests 
ADD CONSTRAINT showing_requests_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE showing_requests 
ADD CONSTRAINT showing_requests_assigned_agent_id_fkey 
FOREIGN KEY (assigned_agent_id) REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE showing_requests 
ADD CONSTRAINT showing_requests_requested_agent_id_fkey 
FOREIGN KEY (requested_agent_id) REFERENCES auth.users(id) ON DELETE SET NULL;

-- Messages
ALTER TABLE messages 
ADD CONSTRAINT messages_sender_id_fkey 
FOREIGN KEY (sender_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE messages 
ADD CONSTRAINT messages_receiver_id_fkey 
FOREIGN KEY (receiver_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Tour agreements
ALTER TABLE tour_agreements 
ADD CONSTRAINT tour_agreements_buyer_id_fkey 
FOREIGN KEY (buyer_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE tour_agreements 
ADD CONSTRAINT tour_agreements_agent_id_fkey 
FOREIGN KEY (agent_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Consultation bookings
ALTER TABLE consultation_bookings 
ADD CONSTRAINT consultation_bookings_buyer_id_fkey 
FOREIGN KEY (buyer_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE consultation_bookings 
ADD CONSTRAINT consultation_bookings_agent_id_fkey 
FOREIGN KEY (agent_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Offer intents
ALTER TABLE offer_intents 
ADD CONSTRAINT offer_intents_buyer_id_fkey 
FOREIGN KEY (buyer_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE offer_intents 
ADD CONSTRAINT offer_intents_agent_id_fkey 
FOREIGN KEY (agent_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Buyer feedback
ALTER TABLE buyer_feedback 
ADD CONSTRAINT buyer_feedback_buyer_id_fkey 
FOREIGN KEY (buyer_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE buyer_feedback 
ADD CONSTRAINT buyer_feedback_agent_id_fkey 
FOREIGN KEY (agent_id) REFERENCES auth.users(id) ON DELETE SET NULL;

-- Agent feedback
ALTER TABLE agent_feedback 
ADD CONSTRAINT agent_feedback_buyer_id_fkey 
FOREIGN KEY (buyer_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE agent_feedback 
ADD CONSTRAINT agent_feedback_agent_id_fkey 
FOREIGN KEY (agent_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Property favorites
ALTER TABLE property_favorites 
ADD CONSTRAINT property_favorites_buyer_id_fkey 
FOREIGN KEY (buyer_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Post showing actions
ALTER TABLE post_showing_actions 
ADD CONSTRAINT post_showing_actions_buyer_id_fkey 
FOREIGN KEY (buyer_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Buyer agent matches
ALTER TABLE buyer_agent_matches 
ADD CONSTRAINT buyer_agent_matches_buyer_id_fkey 
FOREIGN KEY (buyer_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE buyer_agent_matches 
ADD CONSTRAINT buyer_agent_matches_agent_id_fkey 
FOREIGN KEY (agent_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Agent referrals
ALTER TABLE agent_referrals 
ADD CONSTRAINT agent_referrals_buyer_id_fkey 
FOREIGN KEY (buyer_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE agent_referrals 
ADD CONSTRAINT agent_referrals_agent_id_fkey 
FOREIGN KEY (agent_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Follow up questions
ALTER TABLE follow_up_questions 
ADD CONSTRAINT follow_up_questions_buyer_id_fkey 
FOREIGN KEY (buyer_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE follow_up_questions 
ADD CONSTRAINT follow_up_questions_agent_id_fkey 
FOREIGN KEY (agent_id) REFERENCES auth.users(id) ON DELETE SET NULL;

-- Support conversations
ALTER TABLE support_conversations 
ADD CONSTRAINT support_conversations_buyer_id_fkey 
FOREIGN KEY (buyer_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE support_conversations 
ADD CONSTRAINT support_conversations_admin_id_fkey 
FOREIGN KEY (admin_id) REFERENCES auth.users(id) ON DELETE SET NULL;

-- Agent notifications
ALTER TABLE agent_notifications 
ADD CONSTRAINT agent_notifications_agent_id_fkey 
FOREIGN KEY (agent_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE agent_notifications 
ADD CONSTRAINT agent_notifications_buyer_id_fkey 
FOREIGN KEY (buyer_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Agent availability
ALTER TABLE agent_availability 
ADD CONSTRAINT agent_availability_agent_id_fkey 
FOREIGN KEY (agent_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Profile photos
ALTER TABLE profile_photos 
ADD CONSTRAINT profile_photos_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Subscribers
ALTER TABLE subscribers 
ADD CONSTRAINT subscribers_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Enable realtime for critical tables
ALTER TABLE showing_requests REPLICA IDENTITY FULL;
ALTER TABLE messages REPLICA IDENTITY FULL;
ALTER TABLE tour_agreements REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE showing_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE tour_agreements;
