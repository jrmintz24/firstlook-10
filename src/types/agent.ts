
export interface AgentProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  photoUrl?: string;
  rating: number;
  reviewCount: number;
  propertiesSold: number;
  avgDaysOnMarket: number;
  specialties: string[];
  bio?: string;
  location: string;
  licenseNumber?: string;
  yearsExperience?: number;
}

export interface AgentStats {
  propertiesSold: number;
  avgDaysOnMarket: number;
  avgSalePrice?: number;
  clientSatisfactionRate?: number;
}

export interface AgentSpecialty {
  id: string;
  name: string;
  description?: string;
}
