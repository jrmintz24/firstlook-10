
-- Create houses table for available properties
CREATE TABLE public.houses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  address TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'Washington',
  state TEXT NOT NULL DEFAULT 'DC',
  zip_code TEXT,
  beds INTEGER NOT NULL,
  baths NUMERIC NOT NULL,
  sqft INTEGER,
  price NUMERIC NOT NULL,
  description TEXT,
  image_url TEXT,
  available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create house assignments table
CREATE TABLE public.house_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  house_id UUID REFERENCES public.houses(id) ON DELETE CASCADE NOT NULL,
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'active',
  UNIQUE(user_id) -- One house per user
);

-- Enable RLS on both tables
ALTER TABLE public.houses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.house_assignments ENABLE ROW LEVEL SECURITY;

-- RLS policies for houses (public read, admin write)
CREATE POLICY "Anyone can view available houses" 
  ON public.houses 
  FOR SELECT 
  USING (available = true);

-- RLS policies for house assignments (users can see their own)
CREATE POLICY "Users can view their own assignment" 
  ON public.house_assignments 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own assignment" 
  ON public.house_assignments 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own assignment" 
  ON public.house_assignments 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Insert some sample houses
INSERT INTO public.houses (address, city, state, zip_code, beds, baths, sqft, price, description, image_url) VALUES
('123 Main St', 'Washington', 'DC', '20001', 3, 2, 1200, 450000, 'Beautiful 3-bedroom home in downtown DC', '/placeholder.svg'),
('456 Oak Ave', 'Washington', 'DC', '20002', 2, 1, 900, 350000, 'Cozy 2-bedroom apartment near Metro', '/placeholder.svg'),
('789 Pine St', 'Washington', 'DC', '20003', 4, 3, 1800, 650000, 'Spacious family home with modern amenities', '/placeholder.svg'),
('321 Elm Dr', 'Washington', 'DC', '20004', 1, 1, 600, 250000, 'Studio apartment perfect for young professionals', '/placeholder.svg'),
('654 Maple Ln', 'Washington', 'DC', '20005', 3, 2.5, 1400, 525000, 'Updated townhouse with parking', '/placeholder.svg');

-- Add trigger to update updated_at timestamp
CREATE TRIGGER update_houses_updated_at 
  BEFORE UPDATE ON public.houses 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
