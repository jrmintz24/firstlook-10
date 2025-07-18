-- Real property data backfill script
-- This will show you what showing requests exist and need real property data

-- First, let's see what we're working with
SELECT 
  '🔍 Analysis: Total showing requests' as step,
  COUNT(*) as count
FROM public.showing_requests;

SELECT 
  '🔍 Analysis: Showing requests already linked to properties' as step,
  COUNT(*) as count
FROM public.showing_requests 
WHERE idx_property_id IS NOT NULL;

SELECT 
  '🔍 Analysis: Showing requests needing property data' as step,
  COUNT(*) as count
FROM public.showing_requests 
WHERE idx_property_id IS NULL;

-- Show the most common addresses that need property data
SELECT 
  '📍 Top addresses needing property data:' as step,
  property_address,
  COUNT(*) as request_count
FROM public.showing_requests
WHERE idx_property_id IS NULL
GROUP BY property_address
ORDER BY request_count DESC
LIMIT 15;

-- Show which properties already have data
SELECT 
  '✅ Properties with existing data:' as step,
  ip.address,
  ip.price,
  ip.beds,
  ip.baths,
  COUNT(sr.id) as linked_requests
FROM public.idx_properties ip
LEFT JOIN public.showing_requests sr ON ip.id = sr.idx_property_id
GROUP BY ip.address, ip.price, ip.beds, ip.baths
ORDER BY linked_requests DESC;

-- Instructions for next steps:
SELECT 
  '📋 NEXT STEPS:' as step,
  'Visit the property pages on your IDX site to automatically extract real data' as instructions

UNION ALL

SELECT 
  '1. Visit IDX pages' as step,
  'Go to property pages in your iHomeFinder IDX site' as instructions

UNION ALL

SELECT 
  '2. Check extraction' as step,
  'Look for console logs showing property data extraction' as instructions

UNION ALL

SELECT 
  '3. Verify dashboard' as step,
  'Check buyer dashboard for enhanced property cards' as instructions

UNION ALL

SELECT 
  '4. Manual linking' as step,
  'If needed, manually link properties using address matching' as instructions;

-- If you want to clean up old fake/sample data, uncomment this:
-- DELETE FROM public.idx_properties WHERE mls_id LIKE 'SAMPLE-%' OR mls_id LIKE 'REAL-%';

-- Reset all property links to force fresh extraction:
-- UPDATE public.showing_requests SET idx_property_id = NULL WHERE idx_property_id IS NOT NULL;