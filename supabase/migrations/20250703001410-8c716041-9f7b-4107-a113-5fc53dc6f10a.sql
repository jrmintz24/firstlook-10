
-- Create storage bucket for offer documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'offer-documents', 
  'offer-documents', 
  false, 
  10485760, -- 10MB limit
  ARRAY['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
);

-- Create offer_documents table
CREATE TABLE public.offer_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  offer_intent_id UUID NOT NULL REFERENCES public.offer_intents(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  document_category TEXT NOT NULL DEFAULT 'general',
  uploaded_by UUID NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on offer_documents
ALTER TABLE public.offer_documents ENABLE ROW LEVEL SECURITY;

-- RLS policies for offer_documents
CREATE POLICY "Users can view documents for their offers"
  ON public.offer_documents
  FOR SELECT
  USING (
    offer_intent_id IN (
      SELECT id FROM public.offer_intents 
      WHERE buyer_id = auth.uid() OR agent_id = auth.uid()
    )
  );

CREATE POLICY "Users can upload documents for their offers"
  ON public.offer_documents
  FOR INSERT
  WITH CHECK (
    uploaded_by = auth.uid() AND
    offer_intent_id IN (
      SELECT id FROM public.offer_intents 
      WHERE buyer_id = auth.uid() OR agent_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own documents"
  ON public.offer_documents
  FOR DELETE
  USING (uploaded_by = auth.uid());

-- Storage policies for offer-documents bucket
CREATE POLICY "Users can view offer documents"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'offer-documents' AND
    (storage.foldername(name))[1] IN (
      SELECT id::text FROM public.offer_intents 
      WHERE buyer_id = auth.uid() OR agent_id = auth.uid()
    )
  );

CREATE POLICY "Users can upload offer documents"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'offer-documents' AND
    auth.uid()::text = owner AND
    (storage.foldername(name))[1] IN (
      SELECT id::text FROM public.offer_intents 
      WHERE buyer_id = auth.uid() OR agent_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own offer documents"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'offer-documents' AND
    auth.uid()::text = owner
  );
