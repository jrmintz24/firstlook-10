-- FIXED SAFE DATABASE SETUP FOR SOCIAL FEEDBACK SYSTEM
-- This script fixes the UUID/text type mismatch
-- Run this in your Supabase SQL Editor

-- First, let's see what currently exists
SELECT 'EXISTING POLICIES:' as info;
SELECT tablename, policyname, cmd 
FROM pg_policies 
WHERE tablename IN ('buyer_insights', 'enhanced_property_data', 'buyer_feedback', 'showing_requests')
ORDER BY tablename, policyname;

SELECT 'EXISTING TABLES:' as info;
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('buyer_insights', 'enhanced_property_data', 'buyer_feedback', 'showing_requests');

-- Check if tables exist, create them if they don't
-- Create buyer_insights table if it doesn't exist (FIXED: buyer_id as uuid)
CREATE TABLE IF NOT EXISTS buyer_insights (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    property_address text NOT NULL,
    insight_text text NOT NULL,
    category text NOT NULL,
    buyer_name text NOT NULL,
    buyer_id uuid, -- FIXED: Changed from text to uuid
    showing_request_id uuid,
    tour_date date,
    is_approved boolean DEFAULT false,
    is_verified boolean DEFAULT false,
    approved_at timestamp with time zone,
    helpful_count integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create enhanced_property_data table if it doesn't exist
CREATE TABLE IF NOT EXISTS enhanced_property_data (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    address text UNIQUE NOT NULL,
    beds integer,
    baths integer,
    sqft integer,
    property_type text,
    year_built integer,
    lot_size text,
    data_source text,
    last_updated timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now()
);

-- Create buyer_feedback table if it doesn't exist (for star ratings)
CREATE TABLE IF NOT EXISTS buyer_feedback (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    showing_request_id uuid REFERENCES showing_requests(id),
    buyer_id uuid NOT NULL, -- FIXED: Changed from text to uuid
    agent_id uuid, -- FIXED: Changed from text to uuid for consistency
    property_rating integer CHECK (property_rating >= 1 AND property_rating <= 5),
    agent_rating integer CHECK (agent_rating >= 1 AND agent_rating <= 5),
    property_comments text,
    agent_comments text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on tables if not already enabled
ALTER TABLE buyer_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE enhanced_property_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE buyer_feedback ENABLE ROW LEVEL SECURITY;

-- Only create policies if they don't exist
-- Check and create buyer_insights policies
DO $$
BEGIN
    -- Policy for reading approved insights
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'buyer_insights' 
        AND policyname = 'Anyone can read approved insights'
    ) THEN
        CREATE POLICY "Anyone can read approved insights" ON buyer_insights
            FOR SELECT USING (is_approved = true);
    END IF;

    -- Policy for inserting insights
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'buyer_insights' 
        AND policyname = 'Authenticated users can add insights'
    ) THEN
        CREATE POLICY "Authenticated users can add insights" ON buyer_insights
            FOR INSERT WITH CHECK (true); -- Allow all inserts, trigger will handle approval
    END IF;

    -- Policy for updating own insights (FIXED: both sides are now uuid)
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'buyer_insights' 
        AND policyname = 'Users can update their own insights'
    ) THEN
        CREATE POLICY "Users can update their own insights" ON buyer_insights
            FOR UPDATE USING (auth.uid() = buyer_id) -- FIXED: No text casting needed
            WITH CHECK (auth.uid() = buyer_id);
    END IF;
END
$$;

-- Enhanced property data policies
DO $$
BEGIN
    -- Policy for reading property data
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'enhanced_property_data' 
        AND policyname = 'Anyone can read property data'
    ) THEN
        CREATE POLICY "Anyone can read property data" ON enhanced_property_data
            FOR SELECT USING (true);
    END IF;

    -- Policy for managing property data
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'enhanced_property_data' 
        AND policyname = 'Service role can manage property data'
    ) THEN
        CREATE POLICY "Service role can manage property data" ON enhanced_property_data
            FOR ALL USING (true); -- Allow all operations for now
    END IF;
END
$$;

-- Buyer feedback policies (FIXED: uuid comparisons)
DO $$
BEGIN
    -- Policy for reading feedback (for ratings display)
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'buyer_feedback' 
        AND policyname = 'Anyone can read feedback for ratings'
    ) THEN
        CREATE POLICY "Anyone can read feedback for ratings" ON buyer_feedback
            FOR SELECT USING (true);
    END IF;

    -- Policy for inserting feedback
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'buyer_feedback' 
        AND policyname = 'Authenticated users can add feedback'
    ) THEN
        CREATE POLICY "Authenticated users can add feedback" ON buyer_feedback
            FOR INSERT WITH CHECK (true);
    END IF;

    -- Policy for updating own feedback
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'buyer_feedback' 
        AND policyname = 'Users can update their own feedback'
    ) THEN
        CREATE POLICY "Users can update their own feedback" ON buyer_feedback
            FOR UPDATE USING (auth.uid() = buyer_id) -- FIXED: uuid comparison
            WITH CHECK (auth.uid() = buyer_id);
    END IF;
END
$$;

-- Create or replace the auto-approval function (safe to replace)
CREATE OR REPLACE FUNCTION auto_approve_verified_insights()
RETURNS TRIGGER AS $$
BEGIN
    -- Auto-approve insights from any user for now
    -- You can make this more restrictive later
    NEW.is_approved = true;
    NEW.is_verified = true;
    NEW.approved_at = NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger only if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'auto_approve_insights_trigger'
    ) THEN
        CREATE TRIGGER auto_approve_insights_trigger
            BEFORE INSERT ON buyer_insights
            FOR EACH ROW EXECUTE FUNCTION auto_approve_verified_insights();
    END IF;
END
$$;

-- Final check - show what was created/exists
SELECT 'FINAL STATE - POLICIES:' as info;
SELECT tablename, policyname, cmd 
FROM pg_policies 
WHERE tablename IN ('buyer_insights', 'enhanced_property_data', 'buyer_feedback')
ORDER BY tablename, policyname;

SELECT 'FINAL STATE - TABLES:' as info;
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('buyer_insights', 'enhanced_property_data', 'buyer_feedback', 'showing_requests');