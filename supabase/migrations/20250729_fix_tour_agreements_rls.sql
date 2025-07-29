-- Ensure tour_agreements table has proper RLS policies
-- Enable RLS if not already enabled
ALTER TABLE tour_agreements ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Buyers can view their own agreements" ON tour_agreements;
DROP POLICY IF EXISTS "Buyers can create their own agreements" ON tour_agreements;
DROP POLICY IF EXISTS "Buyers can update their own agreements" ON tour_agreements;
DROP POLICY IF EXISTS "Agents can view agreements for their showings" ON tour_agreements;

-- Buyers can view their own agreements
CREATE POLICY "Buyers can view their own agreements" ON tour_agreements
    FOR SELECT
    USING (buyer_id = auth.uid());

-- Buyers can create agreements for themselves
CREATE POLICY "Buyers can create their own agreements" ON tour_agreements
    FOR INSERT
    WITH CHECK (buyer_id = auth.uid());

-- Buyers can update their own agreements (for signing)
CREATE POLICY "Buyers can update their own agreements" ON tour_agreements
    FOR UPDATE
    USING (buyer_id = auth.uid())
    WITH CHECK (buyer_id = auth.uid());

-- Agents can view agreements for showings they're assigned to
CREATE POLICY "Agents can view agreements for their showings" ON tour_agreements
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM showing_requests sr
            WHERE sr.id = tour_agreements.showing_request_id
            AND sr.assigned_agent_id = auth.uid()
        )
    );

-- Also check if showing_requests table has proper status update policy for buyers
DROP POLICY IF EXISTS "Buyers can update status of their own showings" ON showing_requests;

-- Buyers can update specific fields of their own showing requests
CREATE POLICY "Buyers can update status of their own showings" ON showing_requests
    FOR UPDATE
    USING (buyer_id = auth.uid())
    WITH CHECK (buyer_id = auth.uid());

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_tour_agreements_buyer_showing 
ON tour_agreements(buyer_id, showing_request_id);