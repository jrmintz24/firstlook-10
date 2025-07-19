-- Clean up fake data from idx_properties table
-- Remove entries that were generated with fake data patterns

DELETE FROM idx_properties 
WHERE 
  -- Remove entries with generic fake prices
  (price IN (650000, 750000, 850000, 950000, 1200000))
  OR
  -- Remove entries with fake sqft patterns
  (sqft IN (1800, 2200, 2600, 3000, 3400))
  OR
  -- Remove entries with generic unsplash images
  (images::text LIKE '%unsplash%')
  OR
  -- Remove entries with fake address patterns
  (address = 'Property Address Not Available')
  OR
  -- Remove entries that look like generated data (created in the last hour with suspicious patterns)
  (created_at > NOW() - INTERVAL '24 hours' AND 
   price IN (650000, 750000, 850000, 950000, 1200000) AND
   sqft IN (1800, 2200, 2600, 3000, 3400));

-- Show remaining entries for verification
SELECT idx_id, mls_id, address, price, beds, baths, sqft, created_at 
FROM idx_properties 
ORDER BY created_at DESC 
LIMIT 10;