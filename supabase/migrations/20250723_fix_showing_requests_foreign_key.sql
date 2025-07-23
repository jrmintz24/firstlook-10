-- Fix foreign key relationship for showing_requests.user_id to reference profiles(id)
-- This enables PostgREST joins like profiles!showing_requests_user_id_fkey to work correctly

-- Drop the existing foreign key constraint that points to auth.users(id)
ALTER TABLE showing_requests DROP CONSTRAINT IF EXISTS showing_requests_user_id_fkey;

-- Add the corrected foreign key constraint that points to profiles(id)
ALTER TABLE showing_requests 
ADD CONSTRAINT showing_requests_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- Also fix the assigned_agent_id foreign key to be consistent
ALTER TABLE showing_requests DROP CONSTRAINT IF EXISTS showing_requests_assigned_agent_id_fkey;
ALTER TABLE showing_requests 
ADD CONSTRAINT showing_requests_assigned_agent_id_fkey 
FOREIGN KEY (assigned_agent_id) REFERENCES profiles(id) ON DELETE SET NULL;