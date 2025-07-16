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
}

export const useIDXPropertyExtractor = () => {
  const [propertyData, setPropertyData] = useState<IDXPropertyData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const extractPropertyData = (): IDXPropertyData | null => {
      try {
        console.log('[useIDXPropertyExtractor] Starting property data extraction...');
        
        // Extract property ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        const mlsId = urlParams.get('id') || window.location.pathname.split('/').pop() || '';
        console.log('[useIDXPropertyExtractor] MLS ID from URL:', mlsId);

        // Enhanced IDX selectors for property data
        const addressSelectors = [
          'h1', 
          'h1.address',
          'h1.property-address',
          '.ihf-address', 
          '.property-address',
          '.listing-address',
          '.property-title',
          '.listing-title',
          '[data-testid="property-address"]',
          '[data-property="address"]',
          '.address-line',
          '.property-street-address',
          '.street-address',
          '.full-address'
        ];

        const priceSelectors = [
          '.ihf-price',
          '.property-price', 
          '.listing-price',
          '.price',
          '.price-display',
          '[data-testid="property-price"]',
          '[data-property="price"]'
        ];

        const bedsSelectors = [
          '.ihf-beds',
          '.beds',
          '.bedrooms',
          '.bed-count',
          '[data-testid="beds"]',
          '[data-property="beds"]'
        ];

        const bathsSelectors = [
          '.ihf-baths', 
          '.baths',
          '.bathrooms',
          '.bath-count',
          '[data-testid="baths"]',
          '[data-property="baths"]'
        ];

        const sqftSelectors = [
          '.ihf-sqft',
          '.square-feet',
          '.sqft',
          '.sq-ft',
          '.living-area',
          '[data-testid="sqft"]',
          '[data-property="sqft"]'
        ];

        // Helper function to try multiple selectors
        const extractFromSelectors = (selectors: string[], fieldName: string): string => {
          for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element?.textContent?.trim()) {
              console.log(`[useIDXPropertyExtractor] Found ${fieldName} using selector "${selector}":`, element.textContent.trim());
              return element.textContent.trim();
            }
          }
          console.log(`[useIDXPropertyExtractor] No ${fieldName} found using selectors:`, selectors);
          return '';
        };

        const address = extractFromSelectors(addressSelectors, 'address');
        const price = extractFromSelectors(priceSelectors, 'price');
        const beds = extractFromSelectors(bedsSelectors, 'beds');
        const baths = extractFromSelectors(bathsSelectors, 'baths');
        const sqft = extractFromSelectors(sqftSelectors, 'sqft');

        // Debug all found elements
        console.log('[useIDXPropertyExtractor] Extracted data:', {
          address,
          price,
          beds,
          baths,
          sqft,
          mlsId
        });

        if (!address && !mlsId) {
          console.log('[useIDXPropertyExtractor] No property data found - no address or MLS ID');
          throw new Error('No property data found on page');
        }

        const result = {
          address: address || 'Address not found',
          mlsId,
          price,
          beds,
          baths,
          sqft
        };

        console.log('[useIDXPropertyExtractor] Final extracted data:', result);
        return result;
      } catch (err) {
        console.error('Error extracting property data:', err);
        return null;
      }
    };

    const attemptExtraction = () => {
      console.log('[useIDXPropertyExtractor] Attempting property data extraction...');
      const data = extractPropertyData();
      if (data) {
        console.log('[useIDXPropertyExtractor] Successfully extracted property data');
        setPropertyData(data);
        setIsLoading(false);
        setError(null);
      } else {
        console.log('[useIDXPropertyExtractor] Failed to extract property data');
        setError('Unable to extract property information');
        setIsLoading(false);
      }
    };

    // Initial attempt
    attemptExtraction();

    // Set up MutationObserver to watch for IDX content changes
    const observer = new MutationObserver((mutations) => {
      const hasContentChanges = mutations.some(
        mutation => mutation.type === 'childList' && mutation.addedNodes.length > 0
      );
      
      if (hasContentChanges) {
        setTimeout(attemptExtraction, 500); // Small delay for IDX to render
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => observer.disconnect();
  }, []);

  return { propertyData, isLoading, error };
};