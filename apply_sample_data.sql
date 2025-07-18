-- Manual script to add sample property data for testing enhanced tour cards
-- Run this in your Supabase SQL editor

-- Create sample property data for testing
INSERT INTO public.idx_properties (
  mls_id,
  address,
  city,
  state,
  zip,
  price,
  beds,
  baths,
  sqft,
  property_type,
  status,
  description,
  images,
  ihf_page_url,
  created_at,
  updated_at
) VALUES (
  'SAMPLE-4224-GRAND-ELM',
  '4224 Grand Elm Ln, Rocklin, CA 95765, USA',
  'Rocklin',
  'CA',
  '95765',
  749000.00,
  4,
  3.0,
  2100,
  'Single Family Residential',
  'Active',
  'Beautiful 4-bedroom home in desirable Rocklin location with modern amenities, spacious floor plan, and updated kitchen.',
  '["https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop&auto=format", "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop&auto=format", "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop&auto=format"]'::jsonb,
  'https://www.example-idx.com/properties/4224-grand-elm-ln-rocklin-ca-95765',
  timezone('utc'::text, now()),
  timezone('utc'::text, now())
) ON CONFLICT (mls_id) DO UPDATE SET
  address = EXCLUDED.address,
  price = EXCLUDED.price,
  beds = EXCLUDED.beds,
  baths = EXCLUDED.baths,
  sqft = EXCLUDED.sqft,
  images = EXCLUDED.images,
  ihf_page_url = EXCLUDED.ihf_page_url,
  updated_at = timezone('utc'::text, now());

-- Link existing showing requests to this property record
UPDATE public.showing_requests 
SET idx_property_id = (
  SELECT id FROM public.idx_properties 
  WHERE address = '4224 Grand Elm Ln, Rocklin, CA 95765, USA' 
  LIMIT 1
)
WHERE property_address = '4224 Grand Elm Ln, Rocklin, CA 95765, USA'
  AND idx_property_id IS NULL;

-- Check results
SELECT 
  'idx_properties' as table_name,
  count(*) as records
FROM public.idx_properties
WHERE address = '4224 Grand Elm Ln, Rocklin, CA 95765, USA'

UNION ALL

SELECT 
  'showing_requests_linked' as table_name,
  count(*) as records
FROM public.showing_requests
WHERE property_address = '4224 Grand Elm Ln, Rocklin, CA 95765, USA'
  AND idx_property_id IS NOT NULL;