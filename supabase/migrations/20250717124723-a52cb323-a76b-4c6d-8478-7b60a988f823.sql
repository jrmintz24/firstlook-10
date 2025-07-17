-- Create idx_properties table for comprehensive property data storage
CREATE TABLE public.idx_properties (
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

-- Create indexes for performance
CREATE INDEX idx_properties_mls_id ON public.idx_properties(mls_id);
CREATE INDEX idx_properties_address ON public.idx_properties(address);
CREATE INDEX idx_properties_status ON public.idx_properties(status);
CREATE INDEX idx_properties_price ON public.idx_properties(price);

-- Add foreign key references to existing tables
ALTER TABLE public.property_favorites 
ADD COLUMN idx_property_id uuid REFERENCES public.idx_properties(id),
ADD COLUMN mls_id text;

ALTER TABLE public.showing_requests
ADD COLUMN idx_property_id uuid REFERENCES public.idx_properties(id),
ADD COLUMN mls_id text;

-- Enable RLS
ALTER TABLE public.idx_properties ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Anyone can view idx properties" ON public.idx_properties
  FOR SELECT USING (true);

CREATE POLICY "Service role can manage idx properties" ON public.idx_properties
  FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- Create property views analytics table (optional)
CREATE TABLE public.property_views (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id),
  idx_property_id uuid REFERENCES public.idx_properties(id),
  mls_id text,
  viewed_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

CREATE INDEX idx_property_views_user_id ON public.property_views(user_id);
CREATE INDEX idx_property_views_property_id ON public.property_views(idx_property_id);

-- Enable RLS for property views
ALTER TABLE public.property_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own property views" ON public.property_views
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage property views" ON public.property_views
  FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- Add updated_at trigger for idx_properties
CREATE TRIGGER update_idx_properties_updated_at
    BEFORE UPDATE ON public.idx_properties
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();