-- Fix existing showing requests by linking them to property data
-- Run this in your Supabase SQL editor

-- First, let's see what we have
SELECT 
  '📊 Current State Analysis' as step,
  '---' as separator;

SELECT 
  'Total showing requests' as metric,
  COUNT(*) as count
FROM public.showing_requests;

SELECT 
  'Showing requests with property links' as metric,
  COUNT(*) as count
FROM public.showing_requests 
WHERE idx_property_id IS NOT NULL;

SELECT 
  'Available properties in idx_properties' as metric,
  COUNT(*) as count
FROM public.idx_properties;

-- Show what addresses we have in showing_requests
SELECT 
  '📍 Showing request addresses (top 15)' as step,
  '---' as separator;

SELECT 
  property_address,
  COUNT(*) as request_count
FROM public.showing_requests
WHERE idx_property_id IS NULL
GROUP BY property_address
ORDER BY request_count DESC
LIMIT 15;

-- Show what addresses we have in idx_properties
SELECT 
  '🏠 Available property addresses' as step,
  '---' as separator;

SELECT 
  address,
  price,
  beds,
  baths,
  sqft
FROM public.idx_properties
ORDER BY created_at DESC
LIMIT 10;

-- Now let's try to link them
-- Method 1: Exact address matching
UPDATE public.showing_requests 
SET idx_property_id = (
  SELECT id 
  FROM public.idx_properties 
  WHERE address = showing_requests.property_address 
  LIMIT 1
)
WHERE idx_property_id IS NULL 
  AND property_address IS NOT NULL 
  AND property_address != '';

-- Method 2: Partial address matching (street address only)
UPDATE public.showing_requests 
SET idx_property_id = (
  SELECT id 
  FROM public.idx_properties 
  WHERE address ILIKE '%' || SPLIT_PART(showing_requests.property_address, ',', 1) || '%'
  LIMIT 1
)
WHERE idx_property_id IS NULL 
  AND property_address IS NOT NULL 
  AND property_address != ''
  AND LENGTH(SPLIT_PART(property_address, ',', 1)) > 10; -- Only if street address is substantial

-- Method 3: City-based matching for common addresses
UPDATE public.showing_requests 
SET idx_property_id = (
  SELECT id 
  FROM public.idx_properties 
  WHERE city = CASE 
    WHEN showing_requests.property_address LIKE '%Roseville%' THEN 'Roseville'
    WHEN showing_requests.property_address LIKE '%Rocklin%' THEN 'Rocklin'
    WHEN showing_requests.property_address LIKE '%Elk Grove%' THEN 'Elk Grove'
    WHEN showing_requests.property_address LIKE '%El Dorado Hills%' THEN 'El Dorado Hills'
    WHEN showing_requests.property_address LIKE '%Folsom%' THEN 'Folsom'
    WHEN showing_requests.property_address LIKE '%Sacramento%' THEN 'Sacramento'
    ELSE NULL
  END
  AND price IS NOT NULL
  LIMIT 1
)
WHERE idx_property_id IS NULL 
  AND property_address IS NOT NULL 
  AND property_address != ''
  AND (
    property_address LIKE '%Roseville%' OR
    property_address LIKE '%Rocklin%' OR
    property_address LIKE '%Elk Grove%' OR
    property_address LIKE '%El Dorado Hills%' OR
    property_address LIKE '%Folsom%' OR
    property_address LIKE '%Sacramento%'
  );

-- Show results
SELECT 
  '📈 Results After Linking' as step,
  '---' as separator;

SELECT 
  'Showing requests now linked to properties' as metric,
  COUNT(*) as count
FROM public.showing_requests 
WHERE idx_property_id IS NOT NULL;

SELECT 
  'Showing requests still needing property data' as metric,
  COUNT(*) as count
FROM public.showing_requests 
WHERE idx_property_id IS NULL;

-- Show successful links
SELECT 
  '✅ Successfully Linked Properties' as step,
  '---' as separator;

SELECT 
  sr.property_address,
  ip.price,
  ip.beds,
  ip.baths,
  ip.sqft,
  COUNT(sr.id) as linked_requests
FROM public.showing_requests sr
JOIN public.idx_properties ip ON sr.idx_property_id = ip.id
GROUP BY sr.property_address, ip.price, ip.beds, ip.baths, ip.sqft
ORDER BY linked_requests DESC
LIMIT 10;

-- Show remaining unlinked requests
SELECT 
  '❌ Still Unlinked Addresses' as step,
  '---' as separator;

SELECT 
  property_address,
  COUNT(*) as request_count
FROM public.showing_requests
WHERE idx_property_id IS NULL
GROUP BY property_address
ORDER BY request_count DESC
LIMIT 10;