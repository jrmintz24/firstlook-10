
-- Fix foreign key constraints to enable proper cascade deletion
-- This will resolve user deletion issues and improve real-time stability

-- First, drop the existing foreign key constraint on buyer_agent_matches
ALTER TABLE buyer_agent_matches 
DROP CONSTRAINT IF EXISTS buyer_agent_matches_showing_request_id_fkey;

-- Add the foreign key constraint back with ON DELETE CASCADE
ALTER TABLE buyer_agent_matches 
ADD CONSTRAINT buyer_agent_matches_showing_request_id_fkey 
FOREIGN KEY (showing_request_id) 
REFERENCES showing_requests(id) 
ON DELETE CASCADE;

-- Check and fix other potential foreign key issues
-- Update tour_agreements foreign key if it exists without cascade
ALTER TABLE tour_agreements 
DROP CONSTRAINT IF EXISTS tour_agreements_showing_request_id_fkey;

ALTER TABLE tour_agreements 
ADD CONSTRAINT tour_agreements_showing_request_id_fkey 
FOREIGN KEY (showing_request_id) 
REFERENCES showing_requests(id) 
ON DELETE CASCADE;

-- Update messages foreign key if it exists without cascade
ALTER TABLE messages 
DROP CONSTRAINT IF EXISTS messages_showing_request_id_fkey;

ALTER TABLE messages 
ADD CONSTRAINT messages_showing_request_id_fkey 
FOREIGN KEY (showing_request_id) 
REFERENCES showing_requests(id) 
ON DELETE CASCADE;

-- Update other dependent tables
ALTER TABLE buyer_feedback 
DROP CONSTRAINT IF EXISTS buyer_feedback_showing_request_id_fkey;

ALTER TABLE buyer_feedback 
ADD CONSTRAINT buyer_feedback_showing_request_id_fkey 
FOREIGN KEY (showing_request_id) 
REFERENCES showing_requests(id) 
ON DELETE CASCADE;

ALTER TABLE agent_feedback 
DROP CONSTRAINT IF EXISTS agent_feedback_showing_request_id_fkey;

ALTER TABLE agent_feedback 
ADD CONSTRAINT agent_feedback_showing_request_id_fkey 
FOREIGN KEY (showing_request_id) 
REFERENCES showing_requests(id) 
ON DELETE CASCADE;

ALTER TABLE follow_up_questions 
DROP CONSTRAINT IF EXISTS follow_up_questions_showing_request_id_fkey;

ALTER TABLE follow_up_questions 
ADD CONSTRAINT follow_up_questions_showing_request_id_fkey 
FOREIGN KEY (showing_request_id) 
REFERENCES showing_requests(id) 
ON DELETE CASCADE;

ALTER TABLE workflow_triggers 
DROP CONSTRAINT IF EXISTS workflow_triggers_showing_request_id_fkey;

ALTER TABLE workflow_triggers 
ADD CONSTRAINT workflow_triggers_showing_request_id_fkey 
FOREIGN KEY (showing_request_id) 
REFERENCES showing_requests(id) 
ON DELETE CASCADE;

ALTER TABLE showing_attendance 
DROP CONSTRAINT IF EXISTS showing_attendance_showing_request_id_fkey;

ALTER TABLE showing_attendance 
ADD CONSTRAINT showing_attendance_showing_request_id_fkey 
FOREIGN KEY (showing_request_id) 
REFERENCES showing_requests(id) 
ON DELETE CASCADE;

ALTER TABLE post_showing_actions 
DROP CONSTRAINT IF EXISTS post_showing_actions_showing_request_id_fkey;

ALTER TABLE post_showing_actions 
ADD CONSTRAINT post_showing_actions_showing_request_id_fkey 
FOREIGN KEY (showing_request_id) 
REFERENCES showing_requests(id) 
ON DELETE CASCADE;

ALTER TABLE property_favorites 
DROP CONSTRAINT IF EXISTS property_favorites_showing_request_id_fkey;

ALTER TABLE property_favorites 
ADD CONSTRAINT property_favorites_showing_request_id_fkey 
FOREIGN KEY (showing_request_id) 
REFERENCES showing_requests(id) 
ON DELETE CASCADE;

ALTER TABLE showing_email_notifications 
DROP CONSTRAINT IF EXISTS showing_email_notifications_showing_request_id_fkey;

ALTER TABLE showing_email_notifications 
ADD CONSTRAINT showing_email_notifications_showing_request_id_fkey 
FOREIGN KEY (showing_request_id) 
REFERENCES showing_requests(id) 
ON DELETE CASCADE;

ALTER TABLE agent_notifications 
DROP CONSTRAINT IF EXISTS agent_notifications_showing_request_id_fkey;

ALTER TABLE agent_notifications 
ADD CONSTRAINT agent_notifications_showing_request_id_fkey 
FOREIGN KEY (showing_request_id) 
REFERENCES showing_requests(id) 
ON DELETE CASCADE;
