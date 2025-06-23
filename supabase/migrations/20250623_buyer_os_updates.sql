
-- Add plan_tier column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS plan_tier text DEFAULT 'free';
ALTER TABLE users ADD COLUMN IF NOT EXISTS plan_updated_at timestamp DEFAULT now();

-- Ensure tours table has created_at if not present
ALTER TABLE tours ADD COLUMN IF NOT EXISTS created_at timestamp DEFAULT now();

-- Create view for monthly tour usage tracking
CREATE OR REPLACE VIEW user_tour_counts AS
SELECT
  buyer_id,
  date_trunc('month', created_at) AS month,
  COUNT(*) as tour_count
FROM tours
WHERE buyer_id IS NOT NULL
GROUP BY buyer_id, date_trunc('month', created_at);

-- Update RLS policy for tours if needed
DROP POLICY IF EXISTS "buyers_can_access_their_tours" ON tours;
CREATE POLICY "buyers_can_access_their_tours"
ON tours
FOR SELECT USING (auth.uid() = buyer_id);

-- Grant access to view
GRANT SELECT ON user_tour_counts TO authenticated;
