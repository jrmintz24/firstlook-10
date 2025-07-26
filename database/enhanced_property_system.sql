-- Enhanced Property Data System
-- Objective property data from public records/APIs

CREATE TABLE IF NOT EXISTS enhanced_property_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  address TEXT NOT NULL UNIQUE,
  beds INTEGER,
  baths DECIMAL(3,1),
  sqft INTEGER,
  property_type TEXT,
  year_built INTEGER,
  lot_size TEXT,
  data_source TEXT DEFAULT 'Public Records',
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Indexes for performance
  CONSTRAINT valid_beds CHECK (beds >= 0 AND beds <= 50),
  CONSTRAINT valid_baths CHECK (baths >= 0 AND baths <= 20),
  CONSTRAINT valid_sqft CHECK (sqft >= 0 AND sqft <= 50000),
  CONSTRAINT valid_year CHECK (year_built >= 1800 AND year_built <= 2030)
);

-- Buyer insights and social proof
CREATE TABLE IF NOT EXISTS buyer_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_address TEXT NOT NULL,
  insight_text TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('neighborhood', 'condition', 'value', 'highlights', 'concerns', 'other')),
  buyer_name TEXT,
  buyer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  tour_date DATE,
  showing_request_id UUID REFERENCES showing_requests(id) ON DELETE CASCADE,
  
  -- Moderation fields
  is_approved BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,
  approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  approved_at TIMESTAMP WITH TIME ZONE,
  
  -- Engagement metrics
  helpful_count INTEGER DEFAULT 0,
  report_count INTEGER DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT insight_length CHECK (char_length(insight_text) >= 10 AND char_length(insight_text) <= 500),
  CONSTRAINT buyer_name_length CHECK (char_length(buyer_name) >= 2 AND char_length(buyer_name) <= 50)
);

-- Track helpful votes on insights
CREATE TABLE IF NOT EXISTS insight_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  insight_id UUID REFERENCES buyer_insights(id) ON DELETE CASCADE,
  voter_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  vote_type TEXT CHECK (vote_type IN ('helpful', 'report')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Prevent duplicate votes
  UNIQUE(insight_id, voter_id, vote_type)
);

-- Indexes for performance
CREATE INDEX idx_enhanced_property_address ON enhanced_property_data(address);
CREATE INDEX idx_enhanced_property_updated ON enhanced_property_data(last_updated);

CREATE INDEX idx_buyer_insights_address ON buyer_insights(property_address);
CREATE INDEX idx_buyer_insights_approved ON buyer_insights(is_approved, created_at);
CREATE INDEX idx_buyer_insights_category ON buyer_insights(category);

CREATE INDEX idx_insight_votes_insight ON insight_votes(insight_id);

-- RLS Policies

-- Enhanced property data - readable by all authenticated users
ALTER TABLE enhanced_property_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enhanced property data readable by authenticated users" ON enhanced_property_data
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enhanced property data writable by system" ON enhanced_property_data
  FOR ALL USING (auth.role() = 'service_role');

-- Buyer insights - readable by all, writable by buyers, moderated by agents/admins
ALTER TABLE buyer_insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Buyer insights readable by all authenticated users" ON buyer_insights
  FOR SELECT USING (auth.role() = 'authenticated' AND is_approved = true);

CREATE POLICY "Buyers can create insights" ON buyer_insights
  FOR INSERT WITH CHECK (
    auth.uid() = buyer_id AND 
    showing_request_id IS NOT NULL
  );

CREATE POLICY "Buyers can update their own insights" ON buyer_insights
  FOR UPDATE USING (auth.uid() = buyer_id)
  WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Agents and admins can moderate insights" ON buyer_insights
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE user_id = auth.uid() 
      AND user_type IN ('agent', 'admin')
    )
  );

-- Insight votes - users can vote on insights
ALTER TABLE insight_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can vote on insights" ON insight_votes
  FOR INSERT WITH CHECK (auth.uid() = voter_id);

CREATE POLICY "Users can see vote counts" ON insight_votes
  FOR SELECT USING (auth.role() = 'authenticated');

-- Functions to update helpful counts
CREATE OR REPLACE FUNCTION update_insight_helpful_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE buyer_insights 
    SET helpful_count = helpful_count + CASE WHEN NEW.vote_type = 'helpful' THEN 1 ELSE 0 END,
        report_count = report_count + CASE WHEN NEW.vote_type = 'report' THEN 1 ELSE 0 END
    WHERE id = NEW.insight_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE buyer_insights 
    SET helpful_count = helpful_count - CASE WHEN OLD.vote_type = 'helpful' THEN 1 ELSE 0 END,
        report_count = report_count - CASE WHEN OLD.vote_type = 'report' THEN 1 ELSE 0 END
    WHERE id = OLD.insight_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update counts
CREATE TRIGGER insight_vote_count_trigger
  AFTER INSERT OR DELETE ON insight_votes
  FOR EACH ROW EXECUTE FUNCTION update_insight_helpful_count();

-- Function to auto-approve insights from verified buyers
CREATE OR REPLACE FUNCTION auto_approve_verified_insights()
RETURNS TRIGGER AS $$
BEGIN
  -- Auto-approve insights from buyers who have completed tours
  IF EXISTS (
    SELECT 1 FROM showing_requests sr
    JOIN profiles p ON sr.user_id = p.user_id
    WHERE sr.id = NEW.showing_request_id 
    AND sr.status IN ('completed')
    AND p.user_type = 'buyer'
  ) THEN
    NEW.is_approved = true;
    NEW.is_verified = true;
    NEW.approved_at = NOW();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for auto-approval
CREATE TRIGGER auto_approve_insights_trigger
  BEFORE INSERT ON buyer_insights
  FOR EACH ROW EXECUTE FUNCTION auto_approve_verified_insights();