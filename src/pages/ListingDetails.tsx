
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDocumentHead } from '../hooks/useDocumentHead';
import PropertyTabNavigation from '../components/property/PropertyTabNavigation';
import PropertyActionManager from '../components/property/PropertyActionManager';
import { PropertyData } from '../utils/propertyDataUtils';

const ListingDetails = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { listingId } = useParams<{ listingId: string }>();
  const [property, setProperty] = useState<PropertyData | null>(null);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    actionType: 'tour' | 'offer' | 'favorite' | 'info' | null;
  }>({
    isOpen: false,
    actionType: null
  });
  const [isFavorited, setIsFavorited] = useState(false);

  // Set document head with dynamic title
  useDocumentHead({
    title: listingId ? `Listing ${listingId} - Home Finder Platform` : 'Property Listing - Home Finder Platform',
    description: 'View detailed information about this property listing including photos, amenities, and neighborhood details.',
  });

  const handlePropertyAction = (actionType: 'tour' | 'offer' | 'favorite' | 'info', propertyData?: PropertyData) => {
    const currentProperty = propertyData || property;
    if (currentProperty) {
      setProperty(currentProperty);
      if (actionType === 'favorite') {
        setIsFavorited(!isFavorited);
      }
      setModalState({
        isOpen: true,
        actionType
      });
    }
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      actionType: null
    });
  };

  // Enhanced property data extraction from IDX content
  const extractPropertyFromIDX = () => {
    if (!containerRef.current) return null;
    
    console.log('[ListingDetails] Extracting property data from IDX content');
    console.log('[ListingDetails] Container HTML:', containerRef.current.innerHTML.substring(0, 500));
    
    // First, try to get the complete address by combining listing-address-1 and listing-address-2
    const address1Element = containerRef.current.querySelector('.listing-address-1, p.listing-address-1, .ui-typography.listing-address-1');
    const address2Element = containerRef.current.querySelector('.listing-address-2, p.listing-address-2, .ui-typography.listing-address-2');
    
    let foundAddress = '';
    
    if (address1Element && address2Element) {
      const address1 = address1Element.textContent?.trim() || '';
      const address2 = address2Element.textContent?.trim() || '';
      if (address1 && address2) {
        foundAddress = `${address1}, ${address2}`;
        console.log(`[ListingDetails] Found complete address from IDX elements: "${foundAddress}"`);
      }
    }
    
    // If we didn't find the split address format, fall back to other selectors
    if (!foundAddress) {
      const addressSelectors = [
        // Specific selectors for other IDX formats
        'p[class*="listing-address"]',
        '[class*="listing-address"]',
        // General IDX selectors
        '[data-address]',
        '.address',
        '.property-address', 
        '.listing-address',
        '.ihf-detail-address',
        '.ihf-property-address',
        '.ihf-address',
        'h1',
        'h2',
        '[class*="address"]',
        '[class*="Address"]',
        '[id*="address"]',
        '.detail-address',
        '.property-title',
        '.listing-title'
      ];
      
      // Try each selector until we find a valid address
      let addressElement = null;
      
      for (const selector of addressSelectors) {
        const elements = containerRef.current.querySelectorAll(selector);
        console.log(`[ListingDetails] Checking selector "${selector}", found ${elements.length} elements`);
        
        for (const element of elements) {
          const text = element.textContent?.trim() || '';
          console.log(`[ListingDetails] Element text: "${text}"`);
          
          // Check if this looks like an address (contains numbers and common address words)
          if (text && (
            /\d+\s+\w+/.test(text) || // Number followed by street name
            /\w+\s+(St|Street|Ave|Avenue|Rd|Road|Dr|Drive|Ln|Lane|Blvd|Boulevard|Ct|Court|Pl|Place|Way|Circle|Cir)/i.test(text) ||
            /\d+.*,.*\w{2}\s+\d{5}/.test(text) // Address with state and zip
          )) {
            foundAddress = text;
            addressElement = element;
            console.log(`[ListingDetails] Found valid address: "${foundAddress}"`);
            break;
          }
        }
        
        if (foundAddress) break;
      }
    }
    
    // Enhanced selectors for other property data
    const priceSelectors = ['[data-price]', '.price', '.property-price', '.listing-price', '.ihf-detail-price', '.ihf-price', '[class*="price"]', '[class*="Price"]'];
    const bedsSelectors = ['[data-beds]', '.beds', '.bedroom', '.bedrooms', '.ihf-detail-beds', '.ihf-beds', '[class*="bed"]', '[class*="Bed"]'];
    const bathsSelectors = ['[data-baths]', '.baths', '.bathroom', '.bathrooms', '.ihf-detail-baths', '.ihf-baths', '[class*="bath"]', '[class*="Bath"]'];
    
    const findElementBySelectors = (selectors: string[]) => {
      for (const selector of selectors) {
        const element = containerRef.current?.querySelector(selector);
        if (element?.textContent?.trim()) {
          return element;
        }
      }
      return null;
    };
    
    const priceElement = findElementBySelectors(priceSelectors);
    const bedsElement = findElementBySelectors(bedsSelectors);
    const bathsElement = findElementBySelectors(bathsSelectors);
    
    const propertyData = {
      address: foundAddress || `Property ${listingId}`,
      price: priceElement?.textContent?.trim() || '',
      beds: bedsElement?.textContent?.trim() || '',
      baths: bathsElement?.textContent?.trim() || '',
      mlsId: listingId || ''
    };

    console.log('[ListingDetails] Final extracted property data:', propertyData);
    console.log('[ListingDetails] All elements in container:', Array.from(containerRef.current?.querySelectorAll('*') || []).map(el => ({ tag: el.tagName, class: el.className, text: el.textContent?.substring(0, 50) })));
    
    return propertyData;
  };

  useEffect(() => {
    console.log('[ListingDetails] Starting IDX render for listing:', listingId);

    if (listingId && containerRef.current && window.ihfKestrel) {
      // Clear existing content
      containerRef.current.innerHTML = '';
      
      // Create and execute the embed script using the working pattern from Listings.tsx
      const renderedElement = window.ihfKestrel.render();
      if (renderedElement) {
        containerRef.current.appendChild(renderedElement);
        console.log('[ListingDetails] IDX content successfully rendered');
        
        // Extract property data after render with multiple attempts
        let attempts = 0;
        const maxAttempts = 5;
        
        const extractData = () => {
          attempts++;
          const propertyData = extractPropertyFromIDX();
          if (propertyData && propertyData.address !== `Property ${listingId}`) {
            console.log('[ListingDetails] Property data extracted successfully:', propertyData);
            setProperty(propertyData);
          } else if (attempts < maxAttempts) {
            console.log(`[ListingDetails] Property data extraction attempt ${attempts}/${maxAttempts}, retrying...`);
            setTimeout(extractData, 1000);
          } else {
            console.log('[ListingDetails] Max extraction attempts reached, using fallback data');
            setProperty({
              address: `Property ${listingId}`,
              price: '',
              beds: '',
              baths: '',
              mlsId: listingId || ''
            });
          }
        };
        
        // Start extraction after a short delay
        setTimeout(extractData, 500);
        
      } else {
        console.error('[ListingDetails] IDX render returned null/undefined');
        // Set fallback property data
        setProperty({
          address: `Property ${listingId}`,
          price: '',
          beds: '',
          baths: '',
          mlsId: listingId || ''
        });
      }
    }
  }, [listingId]);

  // Debug logging
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[ListingDetails] Property state updated:', property);
    }
  }, [property]);

  return (
    <div className="min-h-screen bg-background">
      {/* Property Tab Navigation */}
      <PropertyTabNavigation
        property={property}
        onScheduleTour={() => handlePropertyAction('tour')}
        onMakeOffer={() => handlePropertyAction('offer')}
        onFavorite={() => handlePropertyAction('favorite')}
        isFavorited={isFavorited}
        isLoading={!property}
      />
      
      {/* IDX Content */}
      <div className="w-full">
        {!property ? (
          <div className="animate-pulse p-6 space-y-4">
            <div className="h-64 bg-muted rounded-lg"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        ) : (
          <div ref={containerRef} className="w-full min-h-[400px] bg-card">
            {/* IDX listing content will be rendered here */}
          </div>
        )}
      </div>

      {/* Debug info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-3 py-1 rounded text-sm z-50">
          Property: {property?.address || 'Loading...'}
        </div>
      )}

      {/* Property Action Manager for Modals */}
      <PropertyActionManager
        isOpen={modalState.isOpen}
        onClose={closeModal}
        actionType={modalState.actionType}
        property={property}
      />
    </div>
  );
};

export default ListingDetails;
