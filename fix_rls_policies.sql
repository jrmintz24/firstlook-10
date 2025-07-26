-- Fix RLS policies to allow buyer insights submission and display
-- This script should be run in the Supabase SQL editor

-- First, let's check current policies
-- You can run this to see existing policies:
-- SELECT tablename, policyname, cmd, permissive, roles, qual, with_check 
-- FROM pg_policies WHERE tablename IN ('buyer_insights', 'enhanced_property_data');

-- Drop and recreate buyer_insights policies with more permissive rules
DROP POLICY IF EXISTS "Anyone can read approved insights" ON buyer_insights;
DROP POLICY IF EXISTS "Buyers can add insights for their tours" ON buyer_insights;
DROP POLICY IF EXISTS "Users can update their own insights" ON buyer_insights;

-- Allow anyone to read approved insights (for public display)
CREATE POLICY "Anyone can read approved insights" ON buyer_insights
  FOR SELECT USING (is_approved = true);

-- Allow authenticated users to insert insights (we'll rely on the trigger for approval)
CREATE POLICY "Authenticated users can add insights" ON buyer_insights
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow users to update their own insights
CREATE POLICY "Users can update their own insights" ON buyer_insights
  FOR UPDATE USING (auth.uid()::text = buyer_id)
  WITH CHECK (auth.uid()::text = buyer_id);

-- Enhanced property data policies
DROP POLICY IF EXISTS "Anyone can read property data" ON enhanced_property_data;
DROP POLICY IF EXISTS "System can manage property data" ON enhanced_property_data;

-- Allow anyone to read property data
CREATE POLICY "Anyone can read property data" ON enhanced_property_data
  FOR SELECT USING (true);

-- Allow authenticated users to manage property data
CREATE POLICY "Authenticated users can manage property data" ON enhanced_property_data
  FOR ALL WITH CHECK (auth.role() = 'authenticated');

-- Update the auto-approval function to be more permissive
CREATE OR REPLACE FUNCTION auto_approve_verified_insights()
RETURNS TRIGGER AS $$
BEGIN
  -- Auto-approve insights from authenticated users
  -- In production, you might want more strict verification
  IF auth.role() = 'authenticated' THEN
    NEW.is_approved = true;
    NEW.is_verified = true;
    NEW.approved_at = NOW();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure the trigger exists
DROP TRIGGER IF EXISTS auto_approve_insights_trigger ON buyer_insights;
CREATE TRIGGER auto_approve_insights_trigger
  BEFORE INSERT ON buyer_insights
  FOR EACH ROW EXECUTE FUNCTION auto_approve_verified_insights();