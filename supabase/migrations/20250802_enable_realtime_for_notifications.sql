-- Enable realtime for tables used in agent notifications
-- This fixes the channel subscription errors for agent dashboard

-- Enable realtime for showing_requests table
ALTER PUBLICATION supabase_realtime ADD TABLE showing_requests;

-- Enable realtime for post_showing_actions table
ALTER PUBLICATION supabase_realtime ADD TABLE post_showing_actions;

-- Enable realtime for property_favorites table
ALTER PUBLICATION supabase_realtime ADD TABLE property_favorites;

-- Enable realtime for buyer_agent_matches table
ALTER PUBLICATION supabase_realtime ADD TABLE buyer_agent_matches;

-- Ensure RLS policies exist for agents to view these tables
-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Agents can view post_showing_actions for their showings" ON post_showing_actions;
DROP POLICY IF EXISTS "Agents can view property_favorites for their showings" ON property_favorites;
DROP POLICY IF EXISTS "Agents can view their buyer_agent_matches" ON buyer_agent_matches;

-- Policy for agents to view post_showing_actions for their showings
CREATE POLICY "Agents can view post_showing_actions for their showings"
ON post_showing_actions
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM showing_requests sr
    WHERE sr.id = post_showing_actions.showing_request_id
    AND sr.assigned_agent_id = auth.uid()
  )
);

-- Policy for agents to view property_favorites for their showings
CREATE POLICY "Agents can view property_favorites for their showings"
ON property_favorites
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM showing_requests sr
    WHERE sr.id = property_favorites.showing_request_id
    AND sr.assigned_agent_id = auth.uid()
  )
);

-- Policy for agents to view buyer_agent_matches where they are the agent
CREATE POLICY "Agents can view their buyer_agent_matches"
ON buyer_agent_matches
FOR SELECT
USING (agent_id = auth.uid());