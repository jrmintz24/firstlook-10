
-- Add consultation-specific fields to offer_intents table
ALTER TABLE offer_intents 
ADD COLUMN consultation_type text CHECK (consultation_type IN ('property_specific', 'general_representation')),
ADD COLUMN consultation_duration integer DEFAULT 30,
ADD COLUMN consultation_notes text,
ADD COLUMN follow_up_scheduled_at timestamp with time zone;

-- Create agent availability table for scheduling
CREATE TABLE agent_availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid NOT NULL,
  day_of_week integer NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0 = Sunday, 6 = Saturday
  start_time time NOT NULL,
  end_time time NOT NULL,
  is_available boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create consultation bookings table
CREATE TABLE consultation_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  offer_intent_id uuid NOT NULL REFERENCES offer_intents(id),
  agent_id uuid NOT NULL,
  buyer_id uuid NOT NULL,
  scheduled_at timestamp with time zone NOT NULL,
  duration_minutes integer DEFAULT 30,
  status text DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'rescheduled')),
  meeting_link text,
  agent_notes text,
  buyer_notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Add RLS policies for agent_availability
ALTER TABLE agent_availability ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Agents can manage their own availability" ON agent_availability
  FOR ALL USING (agent_id = auth.uid());

CREATE POLICY "Public can view agent availability" ON agent_availability
  FOR SELECT USING (is_available = true);

-- Add RLS policies for consultation_bookings
ALTER TABLE consultation_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Buyers can view their own bookings" ON consultation_bookings
  FOR SELECT USING (buyer_id = auth.uid());

CREATE POLICY "Agents can view their bookings" ON consultation_bookings
  FOR SELECT USING (agent_id = auth.uid());

CREATE POLICY "Buyers can create bookings" ON consultation_bookings
  FOR INSERT WITH CHECK (buyer_id = auth.uid());

CREATE POLICY "Agents can update their bookings" ON consultation_bookings
  FOR UPDATE USING (agent_id = auth.uid());

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_consultation_bookings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_consultation_bookings_updated_at
    BEFORE UPDATE ON consultation_bookings
    FOR EACH ROW
    EXECUTE PROCEDURE update_consultation_bookings_updated_at();

CREATE TRIGGER update_agent_availability_updated_at
    BEFORE UPDATE ON agent_availability
    FOR EACH ROW
    EXECUTE PROCEDURE update_consultation_bookings_updated_at();
