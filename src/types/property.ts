
export interface Property {
  id: string;
  mls_id?: string;
  address: string;
  city: string;
  state: string;
  zip_code?: string;
  price: number;
  beds: number;
  baths: number;
  sqft?: number;
  lot_size?: string;
  property_type?: string;
  year_built?: number;
  description?: string;
  listing_agent_name?: string;
  listing_agent_phone?: string;
  listing_agent_email?: string;
  images?: string[];
  latitude?: number;
  longitude?: number;
  status?: string;
  created_at: string;
  updated_at: string;
}

export interface PropertyFilters {
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  beds?: number;
  baths?: number;
  propertyType?: string;
  sortBy?: 'price' | 'newest' | 'sqft';
  sortOrder?: 'asc' | 'desc';
}

export interface PropertySearchParams {
  page?: number;
  limit?: number;
  filters?: PropertyFilters;
}
