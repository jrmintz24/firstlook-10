
export interface PropertyRequestFormData {
  propertyAddress: string;
  mlsId: string;
  preferredDate1: string;
  preferredTime1: string;
  preferredDate2: string;
  preferredTime2: string;
  preferredDate3: string;
  preferredTime3: string;
  notes: string;
  selectedProperties: string[];
}

export interface EligibilityResult {
  eligible: boolean;
  reason: string;
  active_showing_count?: number;
  subscription_tier?: string;
}

export interface PreferredOption {
  date: string;
  time: string;
}
