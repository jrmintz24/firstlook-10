-- Create sample property data for testing enhanced tour cards
INSERT INTO idx_properties (
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
  'SAMPLE-001',
  '4224 Grand Elm Ln, Rocklin, CA 95765, USA',
  'Rocklin',
  'CA',
  '95765',
  749000,
  4,
  3,
  2100,
  'Single Family Residential',
  'Active',
  'Beautiful 4-bedroom home in desirable Rocklin location with modern amenities and spacious floor plan.',
  '["https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop", "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop"]',
  'https://www.example-idx.com/properties/4224-grand-elm-ln-rocklin-ca',
  NOW(),
  NOW()
);

-- Link the showing requests to this property record
UPDATE showing_requests 
SET idx_property_id = (
  SELECT id FROM idx_properties 
  WHERE address = '4224 Grand Elm Ln, Rocklin, CA 95765, USA' 
  LIMIT 1
)
WHERE property_address = '4224 Grand Elm Ln, Rocklin, CA 95765, USA';