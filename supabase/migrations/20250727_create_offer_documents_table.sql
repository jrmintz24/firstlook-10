-- Create offer documents table for managing offer-related file uploads
-- This table will store references to documents uploaded to Supabase Storage

CREATE TABLE public.offer_documents (
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

-- Create indexes for performance
CREATE INDEX offer_documents_offer_intent_id_idx ON public.offer_documents(offer_intent_id);
CREATE INDEX offer_documents_buyer_id_idx ON public.offer_documents(buyer_id);
CREATE INDEX offer_documents_agent_id_idx ON public.offer_documents(agent_id);
CREATE INDEX offer_documents_document_type_idx ON public.offer_documents(document_type);
CREATE INDEX offer_documents_upload_status_idx ON public.offer_documents(upload_status);

-- Enable RLS
ALTER TABLE public.offer_documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Buyers can view their own offer documents"
  ON public.offer_documents
  FOR SELECT
  USING (auth.uid() = buyer_id);

CREATE POLICY "Agents can view documents for their offers"
  ON public.offer_documents
  FOR SELECT
  USING (auth.uid() = agent_id OR auth.uid() = buyer_id);

CREATE POLICY "Buyers can upload documents for their offers"
  ON public.offer_documents
  FOR INSERT
  WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Agents can upload documents for their offers"
  ON public.offer_documents
  FOR INSERT
  WITH CHECK (auth.uid() = agent_id OR auth.uid() = buyer_id);

CREATE POLICY "Buyers can update their own documents"
  ON public.offer_documents
  FOR UPDATE
  USING (auth.uid() = buyer_id OR auth.uid() = agent_id);

CREATE POLICY "Buyers and agents can delete their documents"
  ON public.offer_documents
  FOR DELETE
  USING (auth.uid() = buyer_id OR auth.uid() = agent_id);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_offer_documents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_offer_documents_updated_at
    BEFORE UPDATE ON public.offer_documents
    FOR EACH ROW
    EXECUTE PROCEDURE update_offer_documents_updated_at();