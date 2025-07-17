import { useState, useEffect } from 'react';
import { PropertyData } from '../utils/propertyDataUtils';

export interface IDXPropertyData extends PropertyData {
  price?: string;
  beds?: string;
  baths?: string;
  sqft?: string;
  yearBuilt?: string;
  propertyType?: string;
  description?: string;
  mlsId?: string;
}

// Extend window interface to include iHomeFinder data
declare global {
  interface Window {
    ihfPropertyData?: {
      address: string;
      price: string;
      beds: string;
      baths: string;
      sqft: string;
      mlsId: string;
      extractedAt: string;
    };
  }
}

export const useIDXPropertyExtractor = () => {
  const [propertyData, setPropertyData] = useState<IDXPropertyData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('[useIDXPropertyExtractor] Hook initialized');
    console.log('[useIDXPropertyExtractor] Current URL:', window.location.href);
    
    // First check for globally injected iHomeFinder data
    const checkGlobalData = () => {
      if (window.ihfPropertyData) {
        console.log('[useIDXPropertyExtractor] Found global iHomeFinder data:', window.ihfPropertyData);
        const globalData: IDXPropertyData = {
          address: window.ihfPropertyData.address || '',
          price: window.ihfPropertyData.price || '',
          beds: window.ihfPropertyData.beds || '',
          baths: window.ihfPropertyData.baths || '',
          sqft: window.ihfPropertyData.sqft || '',
          mlsId: window.ihfPropertyData.mlsId || '',
          propertyType: '',
          yearBuilt: '',
          description: ''
        };
        setPropertyData(globalData);
        setIsLoading(false);
        setError(null);
        return true;
      }
      return false;
    };

    // Listen for iHomeFinder data ready event
    const handleIhfDataReady = (event: CustomEvent) => {
      console.log('[useIDXPropertyExtractor] iHomeFinder data ready event received:', event.detail);
      checkGlobalData();
    };

    window.addEventListener('ihfPropertyDataReady', handleIhfDataReady as EventListener);

    // Check immediately for existing global data
    if (checkGlobalData()) {
      return () => {
        window.removeEventListener('ihfPropertyDataReady', handleIhfDataReady as EventListener);
      };
    }
    
    // Fallback to DOM extraction if no global data available
    const extractPropertyData = (): IDXPropertyData | null => {
      try {
        console.log('[useIDXPropertyExtractor] Starting DOM extraction fallback...');
        console.log('[useIDXPropertyExtractor] Current URL:', window.location.href);
        console.log('[useIDXPropertyExtractor] Available global data:', window.ihfPropertyData);
        
        // Check if user is on property detail page
        const urlParams = new URLSearchParams(window.location.search);
        const queryId = urlParams.get('id');
        const pathSegments = window.location.pathname.split('/');
        const listingIndex = pathSegments.findIndex(segment => segment === 'listing');
        const listingId = listingIndex !== -1 ? pathSegments[listingIndex + 1] : null;
        const isPropertyDetailPage = !!listingId || !!queryId;
        
        console.log('[useIDXPropertyExtractor] Is property detail page:', isPropertyDetailPage);
        
        if (!isPropertyDetailPage) {
          console.log('[useIDXPropertyExtractor] Not on property detail page, skipping extraction');
          return null;
        }
        
        return extractFromPropertyDetail();
      } catch (err) {
        console.error('Error extracting property data:', err);
        return null;
      }
    };

    const extractFromPropertyDetail = (): IDXPropertyData | null => {
      console.log('[useIDXPropertyExtractor] Extracting from property detail...');
      
      // Extract MLS ID from URL
      const urlParams = new URLSearchParams(window.location.search);
      let mlsId = urlParams.get('id') || '';
      
      if (!mlsId) {
        const pathSegments = window.location.pathname.split('/');
        const listingIndex = pathSegments.findIndex(segment => segment === 'listing');
        if (listingIndex !== -1 && pathSegments[listingIndex + 1]) {
          mlsId = pathSegments[listingIndex + 1];
        }
      }
      
      console.log('[useIDXPropertyExtractor] MLS ID from URL:', mlsId);

      // Debug: Show what elements are actually on the page
      console.log('🔍 [DEBUG] Page analysis:');
      console.log('  - Page title:', document.title);
      console.log('  - All h1 elements:', document.querySelectorAll('h1'));
      console.log('  - All h2 elements:', document.querySelectorAll('h2'));
      console.log('  - All elements with "ihf" in class:', document.querySelectorAll('[class*="ihf"]'));
      console.log('  - All elements with "address" in class:', document.querySelectorAll('[class*="address"]'));
      console.log('  - All elements with "price" in class:', document.querySelectorAll('[class*="price"]'));
      console.log('  - All elements with "bed" in class:', document.querySelectorAll('[class*="bed"]'));
      console.log('  - All elements with "bath" in class:', document.querySelectorAll('[class*="bath"]'));
      console.log('  - All elements with "sqft" in class:', document.querySelectorAll('[class*="sqft"]'));
      console.log('  - Body innerHTML sample:', document.body.innerHTML.substring(0, 1000));

      // Enhanced selectors for iHomeFinder and other IDX providers
      const addressSelectors = [
        '.ihf-address', '.ihf-listing-address', '.ihf-property-address',
        '.property-address', '.listing-address', '.address', 
        '[data-testid="property-address"]', '.property-info .address',
        'h1[class*="address"]', '[class*="property"][class*="address"]',
        '.listing-details .address', '.property-title', '.listing-title', 'h1'
      ];
      
      const priceSelectors = [
        '.ihf-price', '.ihf-listing-price', '.ihf-property-price',
        '.property-price', '.listing-price', '.price', 
        '[data-testid="property-price"]', '.price-container .price',
        '[class*="price"]', '.listing-details .price'
      ];
      
      const bedsSelectors = [
        '.ihf-beds', '.ihf-bedrooms', '.ihf-bed-count',
        '.property-beds', '.beds', '.bedrooms', '.bed-count',
        '[data-testid="beds"]', '[class*="bed"]', '.listing-details .beds'
      ];
      
      const bathsSelectors = [
        '.ihf-baths', '.ihf-bathrooms', '.ihf-bath-count',
        '.property-baths', '.baths', '.bathrooms', '.bath-count',
        '[data-testid="baths"]', '[class*="bath"]', '.listing-details .baths'
      ];
      
      const sqftSelectors = [
        '.ihf-sqft', '.ihf-square-feet', '.ihf-sq-ft',
        '.property-sqft', '.sqft', '.square-feet', '.sq-ft',
        '[data-testid="sqft"]', '[class*="sqft"]', '[class*="square"]',
        '.listing-details .sqft'
      ];

      const extractFromSelectors = (selectors: string[], fieldName: string): string => {
        console.log(`🔍 [DEBUG] Extracting ${fieldName} from selectors:`, selectors);
        for (const selector of selectors) {
          const element = document.querySelector(selector);
          console.log(`  - Selector "${selector}":`, element, 'Text:', element?.textContent?.trim());
          if (element?.textContent?.trim()) {
            console.log(`✅ [DEBUG] Found ${fieldName} using selector "${selector}":`, element.textContent.trim());
            return element.textContent.trim();
          }
        }
        console.log(`❌ [DEBUG] No ${fieldName} found with any selector`);
        return '';
      };

      const address = extractFromSelectors(addressSelectors, 'address') || 'Address not found';
      const price = extractFromSelectors(priceSelectors, 'price');
      const beds = extractFromSelectors(bedsSelectors, 'beds');
      const baths = extractFromSelectors(bathsSelectors, 'baths');
      const sqft = extractFromSelectors(sqftSelectors, 'sqft');

      const result = { address, mlsId, price, beds, baths, sqft };
      console.log('[useIDXPropertyExtractor] DOM extraction result:', result);
      return result;
    };

    const attemptExtraction = () => {
      const data = extractPropertyData();
      if (data) {
        console.log('[useIDXPropertyExtractor] Successfully extracted property data:', data);
        setPropertyData(data);
        setIsLoading(false);
        setError(null);
      } else {
        console.log('[useIDXPropertyExtractor] No property data found');
        setError('No property data available');
        setIsLoading(false);
      }
    };

    // Initial attempt and observer setup
    attemptExtraction();

    const observer = new MutationObserver(() => {
      if (!window.ihfPropertyData) {
        setTimeout(attemptExtraction, 500);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('ihfPropertyDataReady', handleIhfDataReady as EventListener);
      observer.disconnect();
    };
  }, []);

  return { propertyData, isLoading, error };
};