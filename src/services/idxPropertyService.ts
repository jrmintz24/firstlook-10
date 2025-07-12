
import { Property, SearchFilters } from "@/types/simplyrets";

export interface IDXSearchResult {
  properties: Property[];
  totalCount: number;
  searchTerm: string;
}

class IDXPropertyService {
  // The actual iHomeFinder integration is now handled by the widget
  // This service now primarily handles data transformation and caching
  
  async searchProperties(filters: SearchFilters): Promise<IDXSearchResult> {
    // Since iHomeFinder widget handles the actual search,
    // this method now serves as a fallback or for cached results
    console.log('IDX Search via widget - filters:', filters);
    
    return {
      properties: [],
      totalCount: 0,
      searchTerm: filters.cities || 'Widget Search'
    };
  }

  async getPropertyDetails(mlsId: string): Promise<Property | null> {
    // Property details are now provided directly by the widget
    // This could be used for caching or additional data fetching if needed
    console.log('Getting IDX property details for:', mlsId);
    return null;
  }

  // Helper method to validate iHomeFinder property data
  validatePropertyData(property: any): boolean {
    return property && 
           (property.mlsNumber || property.id) && 
           (property.listPrice || property.price) &&
           property.city &&
           property.state;
  }

  // Helper method to create a standardized property object
  createStandardProperty(ihfProperty: any): Property {
    return {
      mlsId: `IHF${ihfProperty.mlsNumber || ihfProperty.id || Date.now()}`,
      listPrice: ihfProperty.listPrice || ihfProperty.price || 0,
      listDate: ihfProperty.listDate || new Date().toISOString(),
      modificationTimestamp: ihfProperty.modificationTimestamp || new Date().toISOString(),
      address: {
        streetNumber: ihfProperty.streetNumber || '',
        streetName: ihfProperty.streetName || '',
        city: ihfProperty.city || '',
        state: ihfProperty.state || '',
        postalCode: ihfProperty.postalCode || ihfProperty.zipCode || '',
        country: 'US',
        full: ihfProperty.fullAddress || `${ihfProperty.streetNumber || ''} ${ihfProperty.streetName || ''}, ${ihfProperty.city || ''}, ${ihfProperty.state || ''} ${ihfProperty.postalCode || ihfProperty.zipCode || ''}`.trim()
      },
      geo: {
        lat: ihfProperty.latitude || ihfProperty.lat || 0,
        lng: ihfProperty.longitude || ihfProperty.lng || 0
      },
      property: {
        bedrooms: ihfProperty.bedrooms || ihfProperty.beds || 0,
        bathsFull: ihfProperty.bathsFull || ihfProperty.baths || 0,
        bathsHalf: ihfProperty.bathsHalf || 0,
        area: ihfProperty.squareFeet || ihfProperty.area || 0,
        type: ihfProperty.propertyType || 'Single Family',
        subType: ihfProperty.propertySubType || 'Detached'
      },
      listingAgent: {
        name: ihfProperty.listingAgent?.name || 'iHomeFinder Agent',
        phone: ihfProperty.listingAgent?.phone || '',
        email: ihfProperty.listingAgent?.email || ''
      },
      office: {
        name: ihfProperty.listingOffice?.name || 'iHomeFinder Office'
      },
      photos: ihfProperty.photos || [],
      remarks: ihfProperty.remarks || ihfProperty.description || 'Property via iHomeFinder',
      status: ihfProperty.status || 'Active',
      mls: {
        status: ihfProperty.status || 'Active',
        area: ihfProperty.area || ihfProperty.city || '',
        daysOnMarket: ihfProperty.daysOnMarket || 0
      }
    };
  }
}

export const idxPropertyService = new IDXPropertyService();
