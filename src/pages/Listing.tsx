
import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDocumentHead } from '../hooks/useDocumentHead';
import { LoadingSpinner } from '../components/dashboard/shared/LoadingStates';
import { PropertyToolbar } from '../components/property/PropertyToolbar';
import EnhancedPropertyDisplay from '../components/property/EnhancedPropertyDisplay';

const Listing = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [propertyAddress, setPropertyAddress] = useState<string | null>(null);
  

  // Extract listing ID from query parameter
  const searchParams = new URLSearchParams(location.search);
  const listingId = searchParams.get('id');

  // Set document head with dynamic title
  useDocumentHead({
    title: 'Property Listing',
    description: 'View detailed information about this property listing including photos, amenities, and neighborhood details.',
  });

  // Function to extract property details from IDX DOM
  const getListingDetails = () => {
    console.log('[Listing] Extracting property details from DOM...');
    
    try {
      // Multiple selector strategies for each field
      const extractors = {
        price: [
          '.ihf-detail-price',
          '.price',
          '.listing-price',
          '[class*="price"]',
          '.detail-price'
        ],
        beds: [
          '.ihf-detail-beds',
          '.beds',
          '.bedrooms',
          '[class*="bed"]',
          '.detail-beds'
        ],
        baths: [
          '.ihf-detail-baths', 
          '.baths',
          '.bathrooms',
          '[class*="bath"]',
          '.detail-baths'
        ],
        sqft: [
          '.ihf-detail-sqft',
          '.sqft',
          '.square-feet',
          '[class*="sqft"]',
          '.detail-sqft'
        ],
        address: [
          '.ihf-detail-address',
          '.address',
          '.property-address',
          '[class*="address"]',
          '.detail-address',
          'h1', // Often the address is in the main heading
          '.listing-address'
        ],
        image: [
          '.ihf-primary-photo img',
          '.primary-photo img',
          '.hero-image img',
          '.main-photo img',
          '.listing-photo img',
          '.property-image img',
          'img[alt*="property"]',
          'img[alt*="listing"]'
        ]
      };

      const extractValue = (selectors: string[]) => {
        for (const selector of selectors) {
          const element = document.querySelector(selector);
          if (element) {
            if (element.tagName === 'IMG') {
              return (element as HTMLImageElement).src;
            }
            const text = element.textContent?.trim();
            if (text && text.length > 0) {
              console.log(`[Listing] Found value "${text}" using selector "${selector}"`);
              return text;
            }
          }
        }
        return null;
      };

      const extractedAddress = extractValue(extractors.address);
      const pageTitle = document.title;
      
      // Better address fallback logic
      let finalAddress = extractedAddress;
      if (!finalAddress && pageTitle && pageTitle !== 'Property Listing') {
        finalAddress = pageTitle;
      }
      
      // If still no address, try to get it from the iHomeFinder extractor results
      if (!finalAddress && window.currentListingDetails?.address) {
        finalAddress = window.currentListingDetails.address;
      }
      
      const details = {
        price: extractValue(extractors.price),
        beds: extractValue(extractors.beds),
        baths: extractValue(extractors.baths),
        sqft: extractValue(extractors.sqft),
        image: extractValue(extractors.image),
        address: finalAddress,
        link: window.location.href,
        listingId: listingId,
        extractedAt: new Date().toISOString()
      };

      console.log('[Listing] Extracted property details:', details);
      
      // Store globally for other components to access
      window.currentListingDetails = details;
      
      // Set the property address for enhanced display
      if (details.address) {
        setPropertyAddress(details.address);
      }
      
      // Dispatch event for components that might be listening
      window.dispatchEvent(new CustomEvent('listingDetailsExtracted', { 
        detail: details 
      }));

      return details;
    } catch (error) {
      console.error('[Listing] Error extracting property details:', error);
      return null;
    }
  };

  useEffect(() => {
    console.log('[Listing] Starting IDX render for listing:', listingId);
    
    // Listen for iHomeFinder property data extraction events
    const handlePropertyDataExtracted = (event) => {
      if (event.detail?.address && !propertyAddress) {
        console.log('[Listing] Setting property address from iHomeFinder:', event.detail.address);
        setPropertyAddress(event.detail.address);
      }
    };
    
    // Listen for custom property data events
    window.addEventListener('propertyDataExtracted', handlePropertyDataExtracted);
    
    // Also check for address in page title periodically
    const checkForAddress = () => {
      if (!propertyAddress) {
        const title = document.title;
        // If title looks like an address (contains numbers and common street words)
        if (title && title !== 'Property Listing' && /\d/.test(title) && 
            (title.includes('Drive') || title.includes('Street') || title.includes('Ave') || 
             title.includes('Rd') || title.includes('Blvd') || title.includes('Ln') || 
             title.includes('Ct') || title.includes('Way') || title.includes('Pl'))) {
          console.log('[Listing] Setting property address from page title:', title);
          setPropertyAddress(title);
        }
      }
    };
    
    // Check immediately and then every 2 seconds for up to 20 seconds
    checkForAddress();
    const addressCheckInterval = setInterval(checkForAddress, 2000);
    setTimeout(() => clearInterval(addressCheckInterval), 20000);
    
    // Cleanup
    const cleanup = () => {
      window.removeEventListener('propertyDataExtracted', handlePropertyDataExtracted);
      clearInterval(addressCheckInterval);
    };

    const renderIDXContent = () => {
      if (listingId && containerRef.current && window.ihfKestrel?.render) {
        try {
          // Clear existing content
          containerRef.current.innerHTML = '';
          
          // Render IDX content using the embed code pattern
          const script = document.createElement('script');
          script.textContent = 'document.currentScript.replaceWith(ihfKestrel.render());';
          containerRef.current.appendChild(script);
          
          console.log('[Listing] IDX embed script injected successfully');
          
          // Set up periodic property detail extraction
          setTimeout(() => {
            setupPropertyDetailExtraction();
          }, 2000);
          
          setIsLoading(false);
          return true;
        } catch (error) {
          console.error('[Listing] Error rendering IDX content:', error);
          return false;
        }
      }
      return false;
    };

    // Set up property detail extraction with retry mechanism
    const setupPropertyDetailExtraction = () => {
      let attempts = 0;
      const maxAttempts = 10;
      
      const tryExtraction = () => {
        attempts++;
        console.log(`[Listing] Property extraction attempt ${attempts}/${maxAttempts}`);
        
        const details = getListingDetails();
        
        // Check if we got meaningful data
        const hasData = details && (details.price || details.address || details.beds);
        
        if (hasData) {
          console.log('[Listing] ✅ Property details extracted successfully');
          return true;
        } else if (attempts < maxAttempts) {
          // Try again with exponential backoff
          const delay = 1000 + (attempts * 500);
          setTimeout(tryExtraction, delay);
        } else {
          console.warn('[Listing] ❌ Failed to extract property details after', maxAttempts, 'attempts');
        }
        
        return false;
      };
      
      // Start extraction
      tryExtraction();
      
      // Also set up a mutation observer to detect when content changes
      const observer = new MutationObserver((mutations) => {
        const hasNewContent = mutations.some(mutation => 
          mutation.addedNodes.length > 0 || mutation.type === 'childList'
        );
        
        if (hasNewContent && !window.currentListingDetails) {
          console.log('[Listing] DOM changed, attempting property extraction...');
          setTimeout(tryExtraction, 500);
        }
      });
      
      if (containerRef.current) {
        observer.observe(containerRef.current, {
          childList: true,
          subtree: true,
          attributes: false
        });
      }
      
      // Clean up observer after 30 seconds
      setTimeout(() => observer.disconnect(), 30000);
    };

    // Try immediate render
    if (renderIDXContent()) {
      return;
    }

    // If immediate render fails, wait for ihfKestrel to load
    let attempts = 0;
    const maxAttempts = 20;
    const interval = setInterval(() => {
      attempts++;
      console.log(`[Listing] IDX loading attempt ${attempts}/${maxAttempts}`, {
        listingId,
        hasContainer: !!containerRef.current,
        hasIhfKestrel: !!window.ihfKestrel,
        hasRender: !!window.ihfKestrel?.render
      });

      if (renderIDXContent()) {
        clearInterval(interval);
      } else if (attempts >= maxAttempts) {
        clearInterval(interval);
        console.error('[Listing] Failed to load IDX content after', maxAttempts, 'attempts');
        setIsLoading(false);
        setHasError(true);
      }
    }, 500);

    return () => {
      clearInterval(interval);
      cleanup();
    };
  }, [listingId]);

  if (hasError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-4">Unable to load property listing</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Property Toolbar */}
      {!isLoading && <PropertyToolbar />}
      
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner size="lg" text="Loading property listing..." />
        </div>
      )}
      
      {/* IDX Content Container with improved styling */}
      <div className={`${!isLoading ? 'pt-36' : 'pt-20'} pb-8`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div 
            ref={containerRef} 
            className="w-full min-h-screen bg-white rounded-xl shadow-lg border border-border overflow-hidden"
            style={{
              /* Ensure IDX content has proper spacing */
              '--idx-content-padding': '2rem',
            }}
          >
            {/* IDX listing content will be rendered here */}
          </div>
          
          {/* Enhanced Property Display with Ratings and Insights */}
          {propertyAddress && !isLoading && (
            <div className="mt-8">
              <EnhancedPropertyDisplay 
                address={propertyAddress}
                mlsId={listingId}
                showInsightForm={true}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Listing;
