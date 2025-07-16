-- Add property_id field to showing_requests table to support property ID-based scheduling
ALTER TABLE public.showing_requests 
ADD COLUMN property_id TEXT;

-- Add an index for faster lookups
CREATE INDEX IF NOT EXISTS idx_showing_requests_property_id 
ON public.showing_requests(property_id);