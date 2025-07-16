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
        // Extract property ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        const mlsId = urlParams.get('id') || window.location.pathname.split('/').pop() || '';

        // Common IDX selectors for property data
        const addressSelectors = [
          'h1', 
          '.ihf-address', 
          '.property-address',
          '[data-testid="property-address"]',
          '.listing-address'
        ];

        const priceSelectors = [
          '.ihf-price',
          '.property-price', 
          '.listing-price',
          '[data-testid="property-price"]'
        ];

        const bedsSelectors = [
          '.ihf-beds',
          '.beds',
          '.bedrooms',
          '[data-testid="beds"]'
        ];

        const bathsSelectors = [
          '.ihf-baths', 
          '.baths',
          '.bathrooms',
          '[data-testid="baths"]'
        ];

        const sqftSelectors = [
          '.ihf-sqft',
          '.square-feet',
          '.sqft',
          '[data-testid="sqft"]'
        ];

        // Helper function to try multiple selectors
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
        const beds = extractFromSelectors(bedsSelectors);
        const baths = extractFromSelectors(bathsSelectors);
        const sqft = extractFromSelectors(sqftSelectors);

        if (!address && !mlsId) {
          throw new Error('No property data found on page');
        }

        return {
          address: address || 'Address not found',
          mlsId,
          price,
          beds,
          baths,
          sqft
        };
      } catch (err) {
        console.error('Error extracting property data:', err);
        return null;
      }
    };

    const attemptExtraction = () => {
      const data = extractPropertyData();
      if (data) {
        setPropertyData(data);
        setIsLoading(false);
        setError(null);
      } else {
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