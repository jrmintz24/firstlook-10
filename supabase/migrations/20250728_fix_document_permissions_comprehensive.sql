-- Comprehensive fix for document upload and access permissions
-- This fixes both storage bucket and RLS policy issues

-- Step 1: Create documents storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;

-- Step 2: Drop existing storage policies to avoid conflicts
DROP POLICY IF EXISTS "Users can upload to their offer folders" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own documents" ON storage.objects;

-- Step 3: Create simplified storage policies
CREATE POLICY "Authenticated users can upload offer documents"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'documents' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = 'offer-documents'
);

CREATE POLICY "Authenticated users can view offer documents"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'documents'
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = 'offer-documents'
);

CREATE POLICY "Authenticated users can update offer documents"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'documents'
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = 'offer-documents'
);

CREATE POLICY "Authenticated users can delete offer documents"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'documents'
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = 'offer-documents'
);

-- Step 4: Update RLS policies for offer_documents table to be more permissive
-- Drop existing policies
DROP POLICY IF EXISTS "Buyers can view their own offer documents" ON public.offer_documents;
DROP POLICY IF EXISTS "Agents can view documents for their offers" ON public.offer_documents;
DROP POLICY IF EXISTS "Buyers can upload documents for their offers" ON public.offer_documents;
DROP POLICY IF EXISTS "Agents can upload documents for their offers" ON public.offer_documents;
DROP POLICY IF EXISTS "Buyers can update their own documents" ON public.offer_documents;
DROP POLICY IF EXISTS "Buyers and agents can delete their documents" ON public.offer_documents;

-- Create more permissive policies
CREATE POLICY "Authenticated users can view offer documents"
ON public.offer_documents
FOR SELECT
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert offer documents"
ON public.offer_documents
FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update offer documents"
ON public.offer_documents
FOR UPDATE
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete offer documents"
ON public.offer_documents
FOR DELETE
USING (auth.role() = 'authenticated');

-- Step 5: Ensure proper indexes exist
CREATE INDEX IF NOT EXISTS offer_documents_storage_path_idx ON public.offer_documents(storage_path);
CREATE INDEX IF NOT EXISTS offer_documents_created_at_idx ON public.offer_documents(created_at);

-- Add comment to track this fix
COMMENT ON TABLE public.offer_documents IS 'Comprehensive permissions fix applied - 2025-07-28';