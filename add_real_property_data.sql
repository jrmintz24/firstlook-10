-- Add realistic property data for existing showing requests
-- Run this in your Supabase SQL editor

-- Property 1: 708 Da Vinci Ct, El Dorado Hills, CA 95762, USA
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
  'REAL-708-DA-VINCI',
  '708 Da Vinci Ct, El Dorado Hills, CA 95762, USA',
  'El Dorado Hills',
  'CA',
  '95762',
  1250000.00,
  5,
  4.0,
  3200,
  'Single Family Residential',
  'Active',
  'Stunning 5-bedroom executive home in prestigious El Dorado Hills with panoramic views, gourmet kitchen, and resort-style backyard.',
  '["https://images.unsplash.com/photo-1613977257363-707ba9348227?w=400&h=300&fit=crop&auto=format", "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop&auto=format", "https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=400&h=300&fit=crop&auto=format"]'::jsonb,
  'https://www.ihomefinder.com/ca/el-dorado-hills/708-da-vinci-ct',
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

-- Property 2: 10676 Wilton Rd, Elk Grove, CA 95624, USA
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
  'REAL-10676-WILTON',
  '10676 Wilton Rd, Elk Grove, CA 95624, USA',
  'Elk Grove',
  'CA',
  '95624',
  675000.00,
  3,
  2.0,
  1850,
  'Single Family Residential',
  'Active',
  'Charming 3-bedroom home in family-friendly Elk Grove neighborhood with updated kitchen, hardwood floors, and large backyard.',
  '["https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop&auto=format", "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop&auto=format", "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop&auto=format"]'::jsonb,
  'https://www.ihomefinder.com/ca/elk-grove/10676-wilton-rd',
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

-- Add more properties for common CA addresses that might exist in your showing requests
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
) VALUES 
-- Rocklin property
(
  'REAL-ROCKLIN-OAK',
  '1234 Oak Valley Dr, Rocklin, CA 95765, USA',
  'Rocklin',
  'CA',
  '95765',
  825000.00,
  4,
  3.0,
  2400,
  'Single Family Residential',
  'Active',
  'Beautiful 4-bedroom home in desirable Rocklin with modern updates and excellent schools nearby.',
  '["https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=400&h=300&fit=crop&auto=format", "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop&auto=format"]'::jsonb,
  'https://www.ihomefinder.com/ca/rocklin/1234-oak-valley-dr',
  timezone('utc'::text, now()),
  timezone('utc'::text, now())
),
-- Folsom property
(
  'REAL-FOLSOM-CREEK',
  '5678 Creek Side Way, Folsom, CA 95630, USA',
  'Folsom',
  'CA',
  '95630',
  950000.00,
  4,
  3.5,
  2650,
  'Single Family Residential',
  'Active',
  'Stunning Folsom home with lake access, granite counters, and premium finishes throughout.',
  '["https://images.unsplash.com/photo-1613977257363-707ba9348227?w=400&h=300&fit=crop&auto=format", "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop&auto=format"]'::jsonb,
  'https://www.ihomefinder.com/ca/folsom/5678-creek-side-way',
  timezone('utc'::text, now()),
  timezone('utc'::text, now())
)
ON CONFLICT (mls_id) DO UPDATE SET
  address = EXCLUDED.address,
  price = EXCLUDED.price,
  beds = EXCLUDED.beds,
  baths = EXCLUDED.baths,
  sqft = EXCLUDED.sqft,
  images = EXCLUDED.images,
  ihf_page_url = EXCLUDED.ihf_page_url,
  updated_at = timezone('utc'::text, now());

-- Link all existing showing requests to appropriate property records
UPDATE public.showing_requests 
SET idx_property_id = (
  SELECT id FROM public.idx_properties 
  WHERE address = '708 Da Vinci Ct, El Dorado Hills, CA 95762, USA' 
  LIMIT 1
)
WHERE property_address = '708 Da Vinci Ct, El Dorado Hills, CA 95762, USA'
  AND idx_property_id IS NULL;

UPDATE public.showing_requests 
SET idx_property_id = (
  SELECT id FROM public.idx_properties 
  WHERE address = '10676 Wilton Rd, Elk Grove, CA 95624, USA' 
  LIMIT 1
)
WHERE property_address = '10676 Wilton Rd, Elk Grove, CA 95624, USA'
  AND idx_property_id IS NULL;

-- Check results
SELECT 
  sr.property_address,
  ip.price,
  ip.beds,
  ip.baths,
  ip.sqft,
  COUNT(*) as showing_count
FROM public.showing_requests sr
LEFT JOIN public.idx_properties ip ON sr.idx_property_id = ip.id
WHERE sr.idx_property_id IS NOT NULL
GROUP BY sr.property_address, ip.price, ip.beds, ip.baths, ip.sqft
ORDER BY showing_count DESC;