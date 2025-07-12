
export interface IHomefinderProperty {
  mlsNumber?: string;
  id?: string | number;
  listPrice?: number;
  price?: number;
  streetNumber?: string;
  streetName?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  zipCode?: string;
  fullAddress?: string;
  latitude?: number;
  lat?: number;
  longitude?: number;
  lng?: number;
  bedrooms?: number;
  beds?: number;
  bathsFull?: number;
  baths?: number;
  bathsHalf?: number;
  squareFeet?: number;
  area?: number;
  propertyType?: string;
  propertySubType?: string;
  listingAgent?: {
    name?: string;
    phone?: string;
    email?: string;
  };
  listingOffice?: {
    name?: string;
  };
  photos?: string[];
  remarks?: string;
  description?: string;
  status?: string;
  daysOnMarket?: number;
  listDate?: string;
  modificationTimestamp?: string;
}

export interface IHomefinderWidgetState {
  isLoaded: boolean;
  error: string | null;
  debugInfo: string[];
  scriptLoadAttempts: number;
  isInitializing: boolean;
}

export interface UseIHomefinderWidgetReturn {
  containerRef: React.RefObject<HTMLDivElement>;
  state: IHomefinderWidgetState;
  retryInitialization: () => void;
  addDebugInfo: (message: string) => void;
}

// Extend the global window object to include iHomeFinder types
declare global {
  interface Window {
    ihfKestrel: {
      render: () => HTMLElement;
      config: {
        platform: string;
        activationToken: string;
      };
      onPropertySelect?: (propertyData: any) => void;
    };
  }
}
