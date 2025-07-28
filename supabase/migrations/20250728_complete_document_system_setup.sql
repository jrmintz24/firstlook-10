-- Complete document system setup - creates table and fixes permissions
-- Run this migration to set up the entire document upload system

-- Step 1: Create the offer_documents table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.offer_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  offer_intent_id uuid NOT NULL REFERENCES public.offer_intents(id) ON DELETE CASCADE,
  buyer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  agent_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- File information
  file_name text NOT NULL,
  file_size bigint,
  file_type text NOT NULL,
  storage_path text NOT NULL, -- Path in Supabase Storage
  
  -- Document metadata
  document_type text NOT NULL CHECK (document_type IN (
    'pre_approval_letter',
    'proof_of_funds',
    'bank_statement',
    'identification',
    'purchase_agreement',
    'addendum',
    'inspection_report',
    'appraisal',
    'other'
  )),
  document_category text DEFAULT 'buyer_provided' CHECK (document_category IN (
    'buyer_provided',
    'agent_generated',
    'system_generated'
  )),
  
  -- Status and processing
  upload_status text DEFAULT 'pending' CHECK (upload_status IN (
    'pending',
    'uploaded',
    'processing',
    'verified',
    'rejected',
    'expired'
  )),
  
  -- Additional metadata
  description text,
  notes text,
  is_required boolean DEFAULT false,
  is_sensitive boolean DEFAULT true, -- Most offer docs are sensitive
  expires_at timestamp with time zone,
  
  -- Audit fields
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  uploaded_by uuid REFERENCES auth.users(id)
);

-- Step 2: Create indexes for performance
CREATE INDEX IF NOT EXISTS offer_documents_offer_intent_id_idx ON public.offer_documents(offer_intent_id);
CREATE INDEX IF NOT EXISTS offer_documents_buyer_id_idx ON public.offer_documents(buyer_id);
CREATE INDEX IF NOT EXISTS offer_documents_agent_id_idx ON public.offer_documents(agent_id);
CREATE INDEX IF NOT EXISTS offer_documents_document_type_idx ON public.offer_documents(document_type);
CREATE INDEX IF NOT EXISTS offer_documents_upload_status_idx ON public.offer_documents(upload_status);
CREATE INDEX IF NOT EXISTS offer_documents_storage_path_idx ON public.offer_documents(storage_path);
CREATE INDEX IF NOT EXISTS offer_documents_created_at_idx ON public.offer_documents(created_at);

-- Step 3: Enable RLS
ALTER TABLE public.offer_documents ENABLE ROW LEVEL SECURITY;

-- Step 4: Drop any existing policies to avoid conflicts
DROP POLICY IF EXISTS "Buyers can view their own offer documents" ON public.offer_documents;
DROP POLICY IF EXISTS "Agents can view documents for their offers" ON public.offer_documents;
DROP POLICY IF EXISTS "Buyers can upload documents for their offers" ON public.offer_documents;
DROP POLICY IF EXISTS "Agents can upload documents for their offers" ON public.offer_documents;
DROP POLICY IF EXISTS "Buyers can update their own documents" ON public.offer_documents;
DROP POLICY IF EXISTS "Buyers and agents can delete their documents" ON public.offer_documents;
DROP POLICY IF EXISTS "Authenticated users can view offer documents" ON public.offer_documents;
DROP POLICY IF EXISTS "Authenticated users can insert offer documents" ON public.offer_documents;
DROP POLICY IF EXISTS "Authenticated users can update offer documents" ON public.offer_documents;
DROP POLICY IF EXISTS "Authenticated users can delete offer documents" ON public.offer_documents;

-- Step 5: Create working RLS policies
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

-- Step 6: Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_offer_documents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_offer_documents_updated_at ON public.offer_documents;
CREATE TRIGGER update_offer_documents_updated_at
    BEFORE UPDATE ON public.offer_documents
    FOR EACH ROW
    EXECUTE PROCEDURE update_offer_documents_updated_at();

-- Step 7: Set up storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;

-- Step 8: Drop existing storage policies to avoid conflicts
DROP POLICY IF EXISTS "Users can upload to their offer folders" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload offer documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can view offer documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update offer documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete offer documents" ON storage.objects;

-- Step 9: Create working storage policies
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

-- Add comment to track this setup
COMMENT ON TABLE public.offer_documents IS 'Complete document system setup applied - 2025-07-28';