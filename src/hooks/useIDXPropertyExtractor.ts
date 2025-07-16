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

export const useIDXPropertyExtractor = () => {
  const [propertyData, setPropertyData] = useState<IDXPropertyData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const extractPropertyData = (): IDXPropertyData | null => {
      try {
        console.log('[useIDXPropertyExtractor] Starting property data extraction...');
        
        // Check if user is on property detail page - support both URL patterns
        const urlParams = new URLSearchParams(window.location.search);
        const queryId = urlParams.get('id');
        const pathSegments = window.location.pathname.split('/');
        const listingIndex = pathSegments.findIndex(segment => segment === 'listing');
        const listingId = listingIndex !== -1 ? pathSegments[listingIndex + 1] : null;
        const isPropertyDetailPage = !!listingId || !!queryId;
        
        console.log('[useIDXPropertyExtractor] Current path:', window.location.pathname);
        console.log('[useIDXPropertyExtractor] Query ID:', queryId);
        console.log('[useIDXPropertyExtractor] Listing ID:', listingId);
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
      
      // Extract property ID from URL - prioritize URL parameter, then path segment
      const urlParams = new URLSearchParams(window.location.search);
      let mlsId = urlParams.get('id') || '';
      
      // If no URL parameter, extract from path (e.g., /listing/123456)
      if (!mlsId) {
        const pathSegments = window.location.pathname.split('/');
        const listingIndex = pathSegments.findIndex(segment => segment === 'listing');
        if (listingIndex !== -1 && pathSegments[listingIndex + 1]) {
          mlsId = pathSegments[listingIndex + 1];
        }
      }
      
      console.log('[useIDXPropertyExtractor] MLS ID from URL:', mlsId);

        // Helper function to find elements by text content
        const findElementsByText = (selectors: string[], searchTerms: string[]): Element | null => {
          for (const selector of selectors) {
            const elements = document.querySelectorAll(selector);
            for (const element of elements) {
              const text = element.textContent || '';
              if (searchTerms.some(term => text.includes(term))) {
                return element;
              }
            }
          }
          return null;
        };

        // Enhanced IDX selectors for property data - prioritize most specific first
        const addressSelectors = [
          // iHomeFinder specific
          '.ihf-address', '.ihf-listing-address', '.ihf-property-address',
          '.ihf-detail-address', '.ihf-listing-street-address',
          
          // Common IDX providers
          '.idx-address', '.idx-property-address', '.idx-listing-address',
          '.flexmls-address', '.trestle-address', '.rets-address',
          '.listing-street-address', '.mls-address',
          
          // Page title and headers (often contain address)
          'h1', 'h2', '.page-title', '.listing-title',
          
          // Property detail containers
          '.property-address', '.listing-address', '.property-title',
          '.address', '.full-address', '.street-address',
          '.property-street-address', '.address-line', '.address-display',
          
          // Data attributes
          '[data-testid="property-address"]', '[data-testid="address"]',
          '[data-property="address"]', '[data-field="address"]',
          '[data-address]', '[data-street-address]',
          
          // Schema.org structured data
          '[itemtype*="schema.org/SingleFamilyResidence"] [itemprop="address"]',
          '[itemtype*="schema.org/Residence"] [itemprop="address"]',
          '[itemtype*="RealEstate"] [itemprop="address"]',
          
          // Generic containers
          '.property-details .address', '.listing-info .address',
          '.property-summary .address', '.listing-header .address'
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

        // Try to extract from JSON-LD structured data
        const extractFromJSONLD = (property: string): string => {
          const scripts = document.querySelectorAll('script[type="application/ld+json"]');
          for (const script of scripts) {
            try {
              const data = JSON.parse(script.textContent || '');
              const value = data?.address?.streetAddress || data?.address || data?.[property];
              if (value && typeof value === 'string') {
                console.log(`[useIDXPropertyExtractor] Found ${property} in JSON-LD:`, value);
                return value;
              }
            } catch (e) {
              // Ignore JSON parsing errors
            }
          }
          return '';
        };

        // Try to extract from meta tags
        const extractFromMeta = (property: string): string => {
          const metaSelectors = [
            `meta[name="property:${property}"]`,
            `meta[property="property:${property}"]`,
            `meta[name="${property}"]`,
            `meta[property="${property}"]`
          ];
          
          for (const selector of metaSelectors) {
            const meta = document.querySelector(selector);
            const content = meta?.getAttribute('content');
            if (content?.trim()) {
              console.log(`[useIDXPropertyExtractor] Found ${property} in meta:`, content);
              return content.trim();
            }
          }
          return '';
        };

        // Try to extract from window globals (common in IDX systems)
        const extractFromGlobals = (property: string): string => {
          try {
            const win = window as any;
            const sources = [
              win.ihfKestrel?.property,
              win.ihfKestrel?.listing,
              win.IDX?.property,
              win.IDX?.listing,
              win.listing,
              win.propertyData,
              win.listingData,
              win.property,
              win._ihf_listing_data,
              win.IHF_LISTING_DATA
            ];
            
            for (const source of sources) {
              if (source && source[property]) {
                console.log(`[useIDXPropertyExtractor] Found ${property} in globals:`, source[property]);
                return String(source[property]);
              }
            }
          } catch (e) {
            // Ignore errors accessing globals
          }
          return '';
        };

        // Extract from page title (many IDX systems include address)
        const extractAddressFromTitle = (): string => {
          const title = document.title;
          console.log('[useIDXPropertyExtractor] Page title:', title);
          
          // Look for address pattern in title
          const addressPattern = /\d+\s+[A-Za-z\s,.-]+(?:Street|St|Avenue|Ave|Road|Rd|Lane|Ln|Drive|Dr|Court|Ct|Place|Pl|Boulevard|Blvd|Way|Circle|Cir|Parkway|Pkwy)/i;
          const match = title.match(addressPattern);
          if (match) {
            const address = match[0].trim();
            console.log('[useIDXPropertyExtractor] Found address in title:', address);
            return address;
          }
          return '';
        };

        // Extract from URL patterns (some IDX systems encode property info in URL)
        const extractAddressFromURL = (): string => {
          const url = window.location.href;
          const pathname = window.location.pathname;
          console.log('[useIDXPropertyExtractor] Current URL:', url);
          
          // Decode URL components that might contain address
          try {
            const decodedPath = decodeURIComponent(pathname);
            const addressPattern = /\d+[-\s]+[A-Za-z\s,-]+(?:Street|St|Avenue|Ave|Road|Rd|Lane|Ln|Drive|Dr|Court|Ct|Place|Pl|Boulevard|Blvd|Way|Circle|Cir)/i;
            const match = decodedPath.match(addressPattern);
            if (match) {
              const address = match[0].replace(/-/g, ' ').trim();
              console.log('[useIDXPropertyExtractor] Found address in URL:', address);
              return address;
            }
          } catch (e) {
            console.log('[useIDXPropertyExtractor] Error parsing URL:', e);
          }
          return '';
        };

        // Try multiple extraction methods for address in order of preference
        let address = extractFromSelectors(addressSelectors, 'address') ||
                     findElementsByText(['h1', 'h2'], ['Street', 'Ave', 'Avenue', 'Road', 'Drive', 'Lane', 'Way', 'Court', 'Place', 'Boulevard'])?.textContent?.trim() ||
                     extractFromGlobals('address') ||
                     extractAddressFromTitle() ||
                     extractAddressFromURL() ||
                     extractFromJSONLD('address') ||
                     extractFromMeta('address');

        // If still no address, try comprehensive text pattern matching
        if (!address) {
          console.log('[useIDXPropertyExtractor] Trying text pattern matching as fallback...');
          const bodyText = document.body.textContent || '';
          
          // More comprehensive address patterns
          const patterns = [
            /\d+\s+[A-Za-z\s,.-]+(?:Street|St|Avenue|Ave|Road|Rd|Lane|Ln|Drive|Dr|Court|Ct|Place|Pl|Boulevard|Blvd|Way|Circle|Cir|Parkway|Pkwy)\b[^,\n]*/gi,
            /\d+\s+[A-Za-z\s,.-]+(?:Street|St|Avenue|Ave|Road|Rd|Lane|Ln|Drive|Dr|Court|Ct|Place|Pl|Boulevard|Blvd|Way|Circle|Cir|Parkway|Pkwy)/gi
          ];
          
          for (const pattern of patterns) {
            const matches = bodyText.match(pattern);
            if (matches && matches.length > 0) {
              // Take the first reasonable match
              address = matches[0].trim();
              console.log('[useIDXPropertyExtractor] Found address via pattern matching:', address);
              break;
            }
          }
        }

        // Debug: Log all available elements with text content for debugging
        console.log('[useIDXPropertyExtractor] Debug - All h1 elements:', 
          Array.from(document.querySelectorAll('h1')).map(el => el.textContent?.trim()));
        console.log('[useIDXPropertyExtractor] Debug - Elements with "address" class:', 
          Array.from(document.querySelectorAll('[class*="address"]')).map(el => el.textContent?.trim()));
        console.log('[useIDXPropertyExtractor] Debug - Elements with data attributes:', 
          Array.from(document.querySelectorAll('[data-address], [data-property], [data-testid*="address"]')).map(el => el.textContent?.trim()));

        const price = extractFromSelectors(priceSelectors, 'price') ||
                     extractFromJSONLD('price') ||
                     extractFromMeta('price') ||
                     extractFromGlobals('price');
        
        const beds = extractFromSelectors(bedsSelectors, 'beds') ||
                    extractFromJSONLD('numberOfRooms') ||
                    extractFromMeta('beds') ||
                    extractFromGlobals('beds');
        
        const baths = extractFromSelectors(bathsSelectors, 'baths') ||
                     extractFromJSONLD('numberOfBathroomsTotal') ||
                     extractFromMeta('baths') ||
                     extractFromGlobals('baths');
        
        const sqft = extractFromSelectors(sqftSelectors, 'sqft') ||
                    extractFromJSONLD('floorSize') ||
                    extractFromMeta('sqft') ||
                    extractFromGlobals('sqft');

        // Debug all found elements
        console.log('[useIDXPropertyExtractor] Extracted data:', {
          address,
          price,
          beds,
          baths,
          sqft,
          mlsId
        });

        // If no address found, show helpful error message
        if (!address) {
          console.warn('[useIDXPropertyExtractor] No address found on property detail page. Property data extraction failed.');
          console.log('[useIDXPropertyExtractor] Available elements for debugging:');
          console.log('- Page title:', document.title);
          console.log('- URL:', window.location.href);
          console.log('- H1 elements:', Array.from(document.querySelectorAll('h1')).map(el => el.textContent?.trim()));
          console.log('- Elements with "address" in class:', Array.from(document.querySelectorAll('[class*="address"]')).map(el => el.textContent?.trim()));
        }

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