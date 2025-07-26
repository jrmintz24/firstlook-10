-- CLEAN DATABASE SETUP FOR SOCIAL FEEDBACK SYSTEM
-- Run this in your Supabase SQL Editor

-- Create buyer_insights table if it doesn't exist
CREATE TABLE IF NOT EXISTS buyer_insights (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    property_address text NOT NULL,
    insight_text text NOT NULL,
    category text NOT NULL,
    buyer_name text NOT NULL,
    buyer_id uuid,
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

-- Create buyer_feedback table if it doesn't exist
CREATE TABLE IF NOT EXISTS buyer_feedback (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    showing_request_id uuid,
    buyer_id uuid NOT NULL,
    agent_id uuid,
    property_rating integer CHECK (property_rating >= 1 AND property_rating <= 5),
    agent_rating integer CHECK (agent_rating >= 1 AND agent_rating <= 5),
    property_comments text,
    agent_comments text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on tables
ALTER TABLE buyer_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE enhanced_property_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE buyer_feedback ENABLE ROW LEVEL SECURITY;

-- Create policies for buyer_insights
DROP POLICY IF EXISTS "Anyone can read approved insights" ON buyer_insights;
CREATE POLICY "Anyone can read approved insights" ON buyer_insights
    FOR SELECT USING (is_approved = true);

DROP POLICY IF EXISTS "Authenticated users can add insights" ON buyer_insights;
CREATE POLICY "Authenticated users can add insights" ON buyer_insights
    FOR INSERT WITH CHECK (true);

-- Create policies for enhanced_property_data
DROP POLICY IF EXISTS "Anyone can read property data" ON enhanced_property_data;
CREATE POLICY "Anyone can read property data" ON enhanced_property_data
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Service role can manage property data" ON enhanced_property_data;
CREATE POLICY "Service role can manage property data" ON enhanced_property_data
    FOR ALL USING (true);

-- Create policies for buyer_feedback
DROP POLICY IF EXISTS "Anyone can read feedback for ratings" ON buyer_feedback;
CREATE POLICY "Anyone can read feedback for ratings" ON buyer_feedback
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can add feedback" ON buyer_feedback;
CREATE POLICY "Authenticated users can add feedback" ON buyer_feedback
    FOR INSERT WITH CHECK (true);

-- Create auto-approval function
CREATE OR REPLACE FUNCTION auto_approve_verified_insights()
RETURNS TRIGGER AS $$
BEGIN
    NEW.is_approved = true;
    NEW.is_verified = true;
    NEW.approved_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS auto_approve_insights_trigger ON buyer_insights;
CREATE TRIGGER auto_approve_insights_trigger
    BEFORE INSERT ON buyer_insights
    FOR EACH ROW EXECUTE FUNCTION auto_approve_verified_insights();