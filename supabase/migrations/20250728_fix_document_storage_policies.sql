-- Fix document storage bucket policies for offer document uploads
-- This script creates the necessary storage bucket and policies

-- Create the documents storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for the documents bucket

-- Policy to allow authenticated users to upload files to their offer folders
CREATE POLICY "Users can upload to their offer folders"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'documents' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = 'offer-documents'
);

-- Policy to allow users to view their own uploaded documents
CREATE POLICY "Users can view their own documents"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'documents'
  AND auth.role() = 'authenticated'
  AND (
    -- Users can see documents they uploaded
    owner = auth.uid()
    OR
    -- Or documents in offer folders they have access to (we'll check via join)
    EXISTS (
      SELECT 1 FROM public.offer_documents od
      WHERE od.storage_path = name
      AND (od.buyer_id = auth.uid() OR od.agent_id = auth.uid())
    )
  )
);

-- Policy to allow users to update their own documents
CREATE POLICY "Users can update their own documents"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'documents'
  AND auth.role() = 'authenticated'
  AND (
    owner = auth.uid()
    OR
    EXISTS (
      SELECT 1 FROM public.offer_documents od
      WHERE od.storage_path = name
      AND (od.buyer_id = auth.uid() OR od.agent_id = auth.uid())
    )
  )
);

-- Policy to allow users to delete their own documents
CREATE POLICY "Users can delete their own documents"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'documents'
  AND auth.role() = 'authenticated'
  AND (
    owner = auth.uid()
    OR
    EXISTS (
      SELECT 1 FROM public.offer_documents od
      WHERE od.storage_path = name
      AND (od.buyer_id = auth.uid() OR od.agent_id = auth.uid())
    )
  )
);

-- Add some additional helpful indexes if they don't exist
CREATE INDEX IF NOT EXISTS offer_documents_storage_path_idx ON public.offer_documents(storage_path);

-- Add a comment to track this migration
COMMENT ON TABLE storage.objects IS 'Storage bucket policies updated for offer document uploads - 2025-07-28';