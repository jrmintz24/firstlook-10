
// Re-export existing types from Supabase integration
export type { Database } from '@/integrations/supabase/types';

// Core entity types that extend the database types
export interface UserProfile {
  id: string;
  user_type: 'buyer' | 'agent';
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  license_number: string | null;
  created_at: string;
  updated_at: string;
}

export interface ShowingRequest {
  id: string;
  user_id: string;
  property_address: string;
  property_city?: string;
  property_state?: string;
  property_zip?: string;
  preferred_date?: string | null;
  preferred_time?: string | null;
  message?: string | null;
  status: 'pending' | 'assigned' | 'confirmed' | 'completed' | 'cancelled';
  assigned_agent_id?: string | null;
  assigned_agent_name?: string | null;
  assigned_agent_email?: string | null;
  assigned_agent_phone?: string | null;
  estimated_confirmation_date?: string | null;
  created_at: string;
  updated_at: string;
  status_updated_at?: string | null;
  internal_notes?: string | null;
}

// UI and component types
export type ShowingStatus = ShowingRequest['status'];

export interface DashboardStats {
  total: number;
  pending: number;
  confirmed: number;
  completed: number;
}

export interface NotificationSettings {
  email: boolean;
  sms: boolean;
  push: boolean;
}

export interface UserPreferences {
  notifications: NotificationSettings;
  defaultSearchRadius: number;
  preferredContactMethod: 'email' | 'phone' | 'text';
}

export interface AgentProfile extends UserProfile {
  user_type: 'agent';
  license_number: string;
  service_areas: string[];
  bio?: string;
  rating?: number;
  total_showings?: number;
}

export interface BuyerProfile extends UserProfile {
  user_type: 'buyer';
  budget_min?: number;
  budget_max?: number;
  preferred_areas?: string[];
  requirements?: string;
}

// Form and validation types
export interface PropertyRequestFormData {
  property_address: string;
  property_city: string;
  property_state: string;
  property_zip: string;
  preferred_date?: string;
  preferred_time?: string;
  message?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

// Agent assignment types
export interface AgentInfo {
  id: string;
  name: string;
  phone: string;
  email: string;
}
