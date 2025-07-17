-- Create idx_properties table for comprehensive property data storage
CREATE TABLE IF NOT EXISTS public.idx_properties (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  mls_id text UNIQUE NOT NULL,
  listing_id text,
  address text NOT NULL,
  city text,
  state text,
  zip text,
  price numeric,
  beds integer,
  baths numeric,
  sqft integer,
  lot_size text,
  year_built integer,
  property_type text,
  status text,
  description text,
  features jsonb DEFAULT '[]'::jsonb,
  images jsonb DEFAULT '[]'::jsonb,
  virtual_tour_url text,
  latitude numeric,
  longitude numeric,
  agent_name text,
  agent_phone text,
  agent_email text,
  ihf_page_url text,
  raw_data jsonb,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Create indexes for performance (with IF NOT EXISTS)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_properties_mls_id') THEN
    CREATE INDEX idx_properties_mls_id ON public.idx_properties(mls_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_properties_address') THEN
    CREATE INDEX idx_properties_address ON public.idx_properties(address);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_properties_status') THEN
    CREATE INDEX idx_properties_status ON public.idx_properties(status);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_properties_price') THEN
    CREATE INDEX idx_properties_price ON public.idx_properties(price);
  END IF;
END $$;

-- Add foreign key references to existing tables if columns don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'property_favorites' AND column_name = 'idx_property_id') THEN
    ALTER TABLE public.property_favorites ADD COLUMN idx_property_id uuid REFERENCES public.idx_properties(id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'property_favorites' AND column_name = 'mls_id') THEN
    ALTER TABLE public.property_favorites ADD COLUMN mls_id text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'showing_requests' AND column_name = 'idx_property_id') THEN
    ALTER TABLE public.showing_requests ADD COLUMN idx_property_id uuid REFERENCES public.idx_properties(id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'showing_requests' AND column_name = 'mls_id') THEN
    ALTER TABLE public.showing_requests ADD COLUMN mls_id text;
  END IF;
END $$;

-- Enable RLS
ALTER TABLE public.idx_properties ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (with checks for existing policies)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'idx_properties' AND policyname = 'Anyone can view idx properties') THEN
    CREATE POLICY "Anyone can view idx properties" ON public.idx_properties
      FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'idx_properties' AND policyname = 'Service role can manage idx properties') THEN
    CREATE POLICY "Service role can manage idx properties" ON public.idx_properties
      FOR ALL USING (auth.jwt()->>'role' = 'service_role');
  END IF;
END $$;