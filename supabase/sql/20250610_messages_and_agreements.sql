-- Adds messaging and agreement tables for showing workflow

-- Messages table stores communication between agents and buyers
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  showing_request_id uuid REFERENCES showing_requests(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  receiver_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Buyer agreements table tracks non-exclusive buyer agreements for tours
CREATE TABLE IF NOT EXISTS tour_agreements (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  showing_request_id uuid REFERENCES showing_requests(id) ON DELETE CASCADE,
  agent_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  buyer_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  signed boolean NOT NULL DEFAULT false,
  signed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
