
export interface PropertyEntry {
  address: string;
  notes: string;
  mlsId?: string;
  source?: 'manual' | 'idx';
  price?: string;
  beds?: string;
  baths?: string;
  sqft?: string;
}

export interface PreferredOption {
  date: string;
  time: string;
}

export interface PropertyRequestFormData {
  // New array-based format
  properties: PropertyEntry[];
  preferredOptions: PreferredOption[];
  notes: string;
  
  // Keep the old fields for backward compatibility with other components
  propertyAddress: string;
  propertyId?: string;
  mlsId?: string;
  preferredDate1: string;
  preferredTime1: string;
  preferredDate2: string;
  preferredTime2: string;
  preferredDate3: string;
  preferredTime3: string;
  selectedProperties: string[];
}
