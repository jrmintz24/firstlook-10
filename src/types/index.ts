
// Core application types
export interface User {
  id: string;
  email: string;
  user_metadata?: {
    first_name?: string;
    last_name?: string;
    phone?: string;
    user_type?: 'buyer' | 'agent';
  };
}

export interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  user_type: 'buyer' | 'agent';
  license_number?: string;
  created_at: string;
  updated_at: string;
}

export interface ShowingRequest {
  id: string;
  user_id: string;
  property_address: string;
  preferred_date?: string;
  preferred_time?: string;
  message?: string;
  status: ShowingStatus;
  assigned_agent_id?: string;
  assigned_agent_name?: string;
  assigned_agent_phone?: string;
  assigned_agent_email?: string;
  estimated_confirmation_date?: string;
  internal_notes?: string;
  status_updated_at?: string;
  created_at: string;
  updated_at: string;
}

export type ShowingStatus = 
  | 'submitted' 
  | 'under_review' 
  | 'agent_assigned' 
  | 'confirmed' 
  | 'scheduled' 
  | 'completed' 
  | 'cancelled' 
  | 'pending';

export interface AgentInfo {
  id: string;
  name: string;
  phone: string;
  email: string;
}

export interface DashboardStats {
  pendingRequests: number;
  activeShowings: number;
  completedShowings: number;
  unassignedCount?: number;
  myRequestsCount?: number;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  limit: number;
}

// Form types
export interface PropertyRequestForm {
  properties: string[];
  preferredDate: string;
  preferredTime: string;
  message: string;
}

export interface UserSignupForm {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  userType: 'buyer' | 'agent';
  licenseNumber?: string;
}

// Hook return types
export interface UseShowingRequestsReturn {
  data: ShowingRequest[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export interface UseUserProfileReturn {
  data: UserProfile | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

// Component prop types
export interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export interface ErrorStateProps {
  error: Error | string;
  onRetry?: () => void;
  title?: string;
}

export interface DashboardHeaderProps {
  displayName: string;
  onRequestShowing?: () => void;
}

export interface TabsProps {
  unassignedRequests?: ShowingRequest[];
  myRequests?: ShowingRequest[];
  activeShowings?: ShowingRequest[];
  pendingRequests?: ShowingRequest[];
  completedShowings?: ShowingRequest[];
  profile?: UserProfile;
  currentUser?: User;
  displayName?: string;
  isLoading?: boolean;
  onAssignToSelf?: (requestId: string) => void;
  onUpdateStatus?: (requestId: string) => void;
  onCancelShowing?: (requestId: string) => void;
  onRescheduleShowing?: (requestId: string) => void;
  onRequestShowing?: () => void;
}
