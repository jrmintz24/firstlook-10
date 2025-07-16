/**
 * Property Data Service
 * Provides methods to fetch and cache property data by property ID
 */

export interface PropertyData {
  address: string;
  price?: string;
  beds?: string;
  baths?: string;
  sqft?: string;
  yearBuilt?: string;
  propertyType?: string;
  description?: string;
  mlsId?: string;
  images?: string[];
}

// Simple in-memory cache to avoid repeated DOM parsing
const propertyCache = new Map<string, PropertyData>();

/**
 * Fetches property data by property ID using IDX page lookup
 */
export const fetchPropertyDataById = async (propertyId: string): Promise<PropertyData | null> => {
  console.log('[PropertyDataService] Fetching property data for ID:', propertyId);
  
  // Check cache first
  if (propertyCache.has(propertyId)) {
    console.log('[PropertyDataService] Returning cached data for:', propertyId);
    return propertyCache.get(propertyId)!;
  }

  try {
    // For now, we'll use the current page's property data if it matches the ID
    // In a full implementation, this would make an API call to IDX
    const currentPropertyData = extractCurrentPropertyData();
    
    if (currentPropertyData && currentPropertyData.mlsId === propertyId) {
      console.log('[PropertyDataService] Current page matches requested ID, caching data');
      propertyCache.set(propertyId, currentPropertyData);
      return currentPropertyData;
    }

    // If we can't find the property on the current page, return null
    // In a full implementation, this would fetch from IDX API
    console.log('[PropertyDataService] Property ID not found on current page');
    return null;
  } catch (error) {
    console.error('[PropertyDataService] Error fetching property data:', error);
    return null;
  }
};

/**
 * Extracts property data from the current page
 */
const extractCurrentPropertyData = (): PropertyData | null => {
  try {
    // Get property ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const mlsId = urlParams.get('id') || window.location.pathname.split('/').pop() || '';

    // Use similar extraction logic as useIDXPropertyExtractor
    const addressSelectors = [
      '.ihf-address', '.ihf-listing-address', '.ihf-property-address',
      '.idx-address', '.property-address', '.listing-address',
      'h1', 'h2', '.page-title', '.listing-title'
    ];

    const priceSelectors = [
      '.ihf-price', '.property-price', '.listing-price', '.price'
    ];

    const extractFromSelectors = (selectors: string[]): string => {
      for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (element?.textContent?.trim()) {
          return element.textContent.trim();
        }
      }
      return '';
    };

    const address = extractFromSelectors(addressSelectors);
    const price = extractFromSelectors(priceSelectors);

    if (!address) {
      return null;
    }

    return {
      address,
      price,
      mlsId
    };
  } catch (error) {
    console.error('[PropertyDataService] Error extracting current property data:', error);
    return null;
  }
};

/**
 * Clears the property cache
 */
export const clearPropertyCache = (): void => {
  propertyCache.clear();
};

/**
 * Gets cached property data without making a network request
 */
export const getCachedPropertyData = (propertyId: string): PropertyData | null => {
  return propertyCache.get(propertyId) || null;
};