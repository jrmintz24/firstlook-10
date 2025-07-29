-- Add consultation completion tracking fields
ALTER TABLE consultation_bookings 
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS completion_method VARCHAR(50), -- 'agent_manual', 'auto_time', 'buyer_report', 'agent_report'
ADD COLUMN IF NOT EXISTS consultation_notes TEXT,
ADD COLUMN IF NOT EXISTS issue_reported BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS issue_details TEXT,
ADD COLUMN IF NOT EXISTS issue_reported_by VARCHAR(10); -- 'agent' or 'buyer'

-- Add index for finding consultations that need auto-completion
CREATE INDEX IF NOT EXISTS idx_consultation_bookings_auto_complete 
ON consultation_bookings(scheduled_at, status, completed_at) 
WHERE status = 'confirmed' AND completed_at IS NULL;

-- Create a function to auto-complete consultations after 2 hours
CREATE OR REPLACE FUNCTION auto_complete_consultations()
RETURNS void AS $$
BEGIN
  UPDATE consultation_bookings
  SET 
    status = 'completed',
    completed_at = NOW(),
    completion_method = 'auto_time',
    updated_at = NOW()
  WHERE 
    status = 'confirmed'
    AND completed_at IS NULL
    AND scheduled_at < NOW() - INTERVAL '2 hours'
    AND issue_reported = FALSE;
END;
$$ LANGUAGE plpgsql;

-- You could call this function periodically via a cron job or trigger
-- For now, it can be called manually or via application logic