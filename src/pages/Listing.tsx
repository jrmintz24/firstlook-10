
import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDocumentHead } from '../hooks/useDocumentHead';
import { LoadingSpinner } from '../components/dashboard/shared/LoadingStates';
import PropertyActionHeader from '../components/property/PropertyActionHeader';
import PropertyTabNavigation from '../components/property/PropertyTabNavigation';
import PropertyActionManager from '../components/property/PropertyActionManager';

interface PropertyData {
  address: string;
  price: string;
  beds: string;
  baths: string;
  mlsId: string;
}

const Listing = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const [property, setProperty] = useState<PropertyData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    actionType: 'tour' | 'offer' | 'favorite' | 'info' | null;
  }>({
    isOpen: false,
    actionType: null,
  });
  const [isFavorited, setIsFavorited] = useState(false);

  // Extract listing ID from query parameter
  const searchParams = new URLSearchParams(location.search);
  const listingId = searchParams.get('id');

  // Set document head with dynamic title
  useDocumentHead({
    title: property?.address || 'Property Listing',
    description: 'View detailed information about this property listing including photos, amenities, and neighborhood details.',
  });

  const extractPropertyFromIDX = (): PropertyData | null => {
    if (!containerRef.current) return null;
    
    try {
      // Enhanced selectors for property data extraction
      const addressSelectors = [
        '[data-address]',
        '.address',
        '.property-address',
        '.listing-address',
        'h1',
        '.property-title',
        '.listing-title'
      ];
      
      const priceSelectors = [
        '[data-price]',
        '.price',
        '.property-price',
        '.listing-price'
      ];
      
      const bedsSelectors = [
        '[data-beds]',
        '.beds',
        '.bedrooms'
      ];
      
      const bathsSelectors = [
        '[data-baths]',
        '.baths',
        '.bathrooms'
      ];
      
      const mlsSelectors = [
        '[data-mls]',
        '.mls',
        '.mls-id'
      ];

      const findText = (selectors: string[]) => {
        for (const selector of selectors) {
          const element = containerRef.current?.querySelector(selector);
          if (element && element.textContent?.trim()) {
            return element.textContent.trim();
          }
        }
        return '';
      };

      const address = findText(addressSelectors);
      const price = findText(priceSelectors);
      const beds = findText(bedsSelectors);
      const baths = findText(bathsSelectors);
      const mlsId = findText(mlsSelectors) || listingId || '';

      if (address) {
        return {
          address,
          price,
          beds,
          baths,
          mlsId
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error extracting property data:', error);
      return null;
    }
  };

  const handlePropertyAction = (actionType: 'tour' | 'offer' | 'favorite' | 'info', propertyData?: PropertyData) => {
    console.log('Property action:', actionType, propertyData);
    setModalState({
      isOpen: true,
      actionType,
    });
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      actionType: null,
    });
  };

  useEffect(() => {
    console.log('[Listing] Starting IDX render for listing:', listingId);

    if (listingId && containerRef.current && window.ihfKestrel) {
      // Clear existing content
      containerRef.current.innerHTML = '';
      
      // Create and execute the embed script using the working pattern from Listings.tsx
      const renderedElement = window.ihfKestrel.render();
      if (renderedElement) {
        containerRef.current.appendChild(renderedElement);
        console.log('[Listing] IDX content successfully rendered');
        
        // Extract property data after render with multiple attempts
        let attempts = 0;
        const maxAttempts = 5;
        
        const extractData = () => {
          attempts++;
          const propertyData = extractPropertyFromIDX();
          if (propertyData && propertyData.address !== `Property ${listingId}`) {
            console.log('[Listing] Property data extracted successfully:', propertyData);
            setProperty(propertyData);
            setIsLoading(false);
          } else if (attempts < maxAttempts) {
            console.log(`[Listing] Property data extraction attempt ${attempts}/${maxAttempts}, retrying...`);
            setTimeout(extractData, 1000);
          } else {
            console.log('[Listing] Max extraction attempts reached, using fallback data');
            setProperty({
              address: `Property ${listingId}`,
              price: '',
              beds: '',
              baths: '',
              mlsId: listingId || ''
            });
            setIsLoading(false);
          }
        };
        
        // Start extraction after a short delay
        setTimeout(extractData, 500);
        
      } else {
        console.error('[Listing] IDX render returned null/undefined');
        // Set fallback property data
        setProperty({
          address: `Property ${listingId}`,
          price: '',
          beds: '',
          baths: '',
          mlsId: listingId || ''
        });
        setIsLoading(false);
      }
    } else {
      setTimeout(() => {
        setIsLoading(false);
        setHasError(true);
      }, 2000);
    }
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
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner size="lg" text="Loading property listing..." />
        </div>
      )}
      
      {/* Property Action Header */}
      <PropertyActionHeader
        property={property}
        onScheduleTour={() => handlePropertyAction('tour', property)}
        onMakeOffer={() => handlePropertyAction('offer', property)}
        onFavorite={() => handlePropertyAction('favorite', property)}
        className="bg-white shadow-sm"
      />
      
      {/* Sticky Property Tab Navigation */}
      <PropertyTabNavigation
        property={property}
        onScheduleTour={() => handlePropertyAction('tour', property)}
        onMakeOffer={() => handlePropertyAction('offer', property)}
        onFavorite={() => handlePropertyAction('favorite', property)}
        isFavorited={isFavorited}
      />
      
      {/* IDX content container with proper spacing */}
      <div className="relative">
        <div 
          ref={containerRef} 
          className={`w-full px-4 py-6 ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          style={{ minHeight: '60vh' }}
        />
      </div>
      
      {/* Property Action Manager for modals */}
      <PropertyActionManager
        isOpen={modalState.isOpen}
        onClose={closeModal}
        actionType={modalState.actionType}
        property={property}
      />
    </div>
  );
};

export default Listing;
