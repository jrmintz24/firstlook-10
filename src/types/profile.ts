
export interface BuyerPreferences {
  budget?: {
    min: number;
    max: number;
  };
  desiredAreas?: string[];
  homeTypes?: string[];
  bedrooms?: {
    min: number;
    max?: number;
  };
  bathrooms?: {
    min: number;
    max?: number;
  };
  mustHaves?: string[];
  tourPreferences?: {
    preferredDays: string[];
    preferredTimes: string[];
    advanceNotice: number; // hours
  };
}

export interface AgentDetails {
  brokerage?: string;
  licenseNumber?: string;
  yearsExperience?: number;
  areasServed?: string[];
  specialties?: string[];
  website?: string;
  bio?: string;
  metrics?: {
    completedTours: number;
    averageRating: number;
  };
  referralFeePercent?: number;
  commissionRebateOffered?: boolean;
}

export interface CommunicationPreferences {
  contactMethod?: 'email' | 'sms' | 'phone';
  notifyOnNewMatches?: boolean;
  notifyOnStatusUpdates?: boolean;
  notifyOnMessages?: boolean;
}

export interface EnhancedProfile {
  id: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  user_type?: 'buyer' | 'agent' | 'admin';
  photo_url?: string;
  buyer_preferences?: BuyerPreferences;
  agent_details?: AgentDetails;
  communication_preferences?: CommunicationPreferences;
  onboarding_completed?: boolean;
  profile_completion_percentage?: number;
  created_at: string;
  updated_at: string;
}

export interface AgentSpecialty {
  id: string;
  name: string;
  description?: string;
}
