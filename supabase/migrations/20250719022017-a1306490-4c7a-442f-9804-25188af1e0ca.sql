-- Switch to using idx_id as primary identifier for IDX properties
-- This simplifies the system by using IDX ID consistently everywhere

-- Add idx_id column to showing_requests table
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'showing_requests' AND column_name = 'idx_id') THEN
    ALTER TABLE public.showing_requests ADD COLUMN idx_id text;
  END IF;
END $$;

-- Migrate existing mls_id values to idx_id (they're the same IDX identifiers)
UPDATE public.showing_requests 
SET idx_id = mls_id 
WHERE idx_id IS NULL AND mls_id IS NOT NULL;

-- Add idx_id column to property_favorites table  
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'property_favorites' AND column_name = 'idx_id') THEN
    ALTER TABLE public.property_favorites ADD COLUMN idx_id text;
  END IF;
END $$;

-- Migrate existing mls_id values to idx_id in favorites
UPDATE public.property_favorites 
SET idx_id = mls_id 
WHERE idx_id IS NULL AND mls_id IS NOT NULL;

-- Add idx_id column to idx_properties table as an alias for mls_id
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'idx_properties' AND column_name = 'idx_id') THEN
    ALTER TABLE public.idx_properties ADD COLUMN idx_id text UNIQUE;
  END IF;
END $$;

-- Migrate existing mls_id values to idx_id in properties
UPDATE public.idx_properties 
SET idx_id = mls_id 
WHERE idx_id IS NULL AND mls_id IS NOT NULL;

-- Create index for performance
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_properties_idx_id') THEN
    CREATE INDEX idx_properties_idx_id ON public.idx_properties(idx_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'showing_requests_idx_id') THEN
    CREATE INDEX showing_requests_idx_id ON public.showing_requests(idx_id);
  END IF;
END $$;