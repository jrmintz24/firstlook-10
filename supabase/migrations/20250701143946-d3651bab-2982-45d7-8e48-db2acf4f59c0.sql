
-- Extend profiles table with new JSONB columns for flexible, structured data
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS buyer_preferences JSONB DEFAULT '{}';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS agent_details JSONB DEFAULT '{}';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS communication_preferences JSONB DEFAULT '{}';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS profile_completion_percentage INTEGER DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS photo_url TEXT;

-- Create profile photos table for better file management
CREATE TABLE IF NOT EXISTS public.profile_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on profile_photos table
ALTER TABLE public.profile_photos ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profile_photos
CREATE POLICY "Users can view their own photos" 
  ON public.profile_photos 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own photos" 
  ON public.profile_photos 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own photos" 
  ON public.profile_photos 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own photos" 
  ON public.profile_photos 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create agent specialties lookup table
CREATE TABLE IF NOT EXISTS public.agent_specialties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert common agent specialties
INSERT INTO public.agent_specialties (name, description) VALUES 
  ('First-Time Buyers', 'Specializes in helping first-time home buyers'),
  ('Luxury Homes', 'Expert in high-end luxury property sales'),
  ('Investment Properties', 'Focuses on real estate investment opportunities'),
  ('VA Loans', 'Experienced with VA loan processes and requirements'),
  ('FHA Loans', 'Specializes in FHA loan transactions'),
  ('Condominiums', 'Expert in condominium sales and regulations'),
  ('New Construction', 'Specializes in new construction homes'),
  ('Historic Properties', 'Expert in historic and heritage properties'),
  ('Commercial Real Estate', 'Focuses on commercial property transactions'),
  ('Relocation Services', 'Helps clients relocating from other areas')
ON CONFLICT (name) DO NOTHING;

-- Enable RLS on agent_specialties (read-only for all authenticated users)
ALTER TABLE public.agent_specialties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view specialties" 
  ON public.agent_specialties 
  FOR SELECT 
  TO authenticated
  USING (true);

-- Add updated_at trigger for profile_photos
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_profile_photos_updated_at ON public.profile_photos;
CREATE TRIGGER update_profile_photos_updated_at 
  BEFORE UPDATE ON public.profile_photos 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
