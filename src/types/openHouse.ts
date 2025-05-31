
export interface OpenHouse {
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
  open_house_date: string;
  open_house_start_time: string;
  open_house_end_time: string;
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

export interface OpenHouseFilters {
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  beds?: number;
  baths?: number;
  propertyType?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'price' | 'date' | 'newest';
  sortOrder?: 'asc' | 'desc';
}

export interface OpenHouseSearchParams {
  page?: number;
  limit?: number;
  filters?: OpenHouseFilters;
}
