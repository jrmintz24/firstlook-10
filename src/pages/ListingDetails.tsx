
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useDocumentHead } from '../hooks/useDocumentHead';
import PropertyActionHeader from '../components/property/PropertyActionHeader';
import PropertyTabNavigation from '../components/property/PropertyTabNavigation';
import PropertyActionManager from '../components/property/PropertyActionManager';
import { PropertyData } from '../utils/propertyDataUtils';
import { useIDXButtonInterception } from '../hooks/useIDXButtonInterception';

// Global function to render listing in-frame
declare global {
  interface Window {
    renderListing: (listingId: string) => void;
  }
}

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
  useDocumentHead(
    listingId ? `Listing ${listingId} - Home Finder Platform` : 'Property Listing - Home Finder Platform',
    'View detailed information about this property listing including photos, amenities, and neighborhood details.'
  );

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

  // Set up IDX button interception
  const { scanForButtons, interceptedCount } = useIDXButtonInterception({
    onScheduleTour: (propertyData) => handlePropertyAction('tour', propertyData),
    onMakeOffer: (propertyData) => handlePropertyAction('offer', propertyData),
    onFavorite: (propertyData) => handlePropertyAction('favorite', propertyData),
    onRequestInfo: (propertyData) => handlePropertyAction('info', propertyData)
  });

  const extractPropertyFromIDX = useCallback(() => {
    if (!containerRef.current) return null;
    
    console.log('[ListingDetails] Extracting property data from IDX content');
    
    const addressElement = containerRef.current.querySelector('[data-address], .address, .property-address, h1, .listing-address, .ihf-detail-address');
    const priceElement = containerRef.current.querySelector('[data-price], .price, .property-price, .listing-price, .ihf-detail-price');
    const bedsElement = containerRef.current.querySelector('[data-beds], .beds, .bedroom, .bedrooms, .ihf-detail-beds');
    const bathsElement = containerRef.current.querySelector('[data-baths], .baths, .bathroom, .bathrooms, .ihf-detail-baths');
    
    const propertyData = {
      address: addressElement?.textContent?.trim() || `Property ${listingId}`,
      price: priceElement?.textContent?.trim() || '',
      beds: bedsElement?.textContent?.trim() || '',
      baths: bathsElement?.textContent?.trim() || '',
      mlsId: listingId || ''
    };

    console.log('[ListingDetails] Extracted property data:', propertyData);
    return propertyData;
  }, [listingId]);

  // In-frame listing renderer function as specified in the instructions
  const renderListing = useCallback((listingId: string) => {
    console.log('[ListingDetails] Rendering listing in-frame:', listingId);
    
    if (window.ihfKestrel && containerRef.current) {
      try {
        // Clear existing content
        containerRef.current.innerHTML = '';
        
        // Use ihfKestrel.render with container and route as specified
        const element = window.ihfKestrel.render({
          container: containerRef.current,
          route: `listing/${listingId}`,
          modalMode: false,
          popupMode: false,
          inlineMode: true
        });

        console.log('[ListingDetails] IDX listing rendered in-frame');
        
        // Extract property data after rendering
        setTimeout(() => {
          const propertyData = extractPropertyFromIDX();
          if (propertyData) {
            setProperty(propertyData);
          }
          scanForButtons();
        }, 1000);
        
      } catch (error) {
        console.error('[ListingDetails] Error rendering IDX listing:', error);
        // Fallback rendering
        if (containerRef.current) {
          containerRef.current.innerHTML = `
            <div class="flex items-center justify-center h-96 text-gray-500">
              <div class="text-center">
                <p class="text-lg mb-2">Loading property details...</p>
                <p class="text-sm">Listing ID: ${listingId}</p>
              </div>
            </div>
          `;
        }
      }
    }
  }, [extractPropertyFromIDX, scanForButtons]);

  // Make renderListing available globally as specified
  useEffect(() => {
    window.renderListing = renderListing;
    
    return () => {
      delete window.renderListing;
    };
  }, [renderListing]);

  // Handle initial page load and render listing
  useEffect(() => {
    console.log('[ListingDetails] Component mounted with listingId:', listingId);
    
    if (listingId) {
      // Check if IDX is available
      if (window.ihfKestrel) {
        renderListing(listingId);
      } else {
        // Wait for IDX to load
        const checkIDX = setInterval(() => {
          if (window.ihfKestrel) {
            clearInterval(checkIDX);
            renderListing(listingId);
          }
        }, 100);
        
        // Clear interval after 10 seconds if IDX doesn't load
        setTimeout(() => clearInterval(checkIDX), 10000);
      }
    }
  }, [listingId, renderListing]);

  // Debug logging
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[ListingDetails] Property state updated:', property);
      console.log('[ListingDetails] Intercepted count:', interceptedCount);
    }
  }, [property, interceptedCount]);

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Property Action Header */}
      <PropertyActionHeader 
        property={property}
        onScheduleTour={() => handlePropertyAction('tour')}
        onMakeOffer={() => handlePropertyAction('offer')}
        onFavorite={() => handlePropertyAction('favorite')}
      />

      {/* Property Tab Navigation - Positioned above IDX content */}
      <PropertyTabNavigation
        property={property}
        onScheduleTour={() => handlePropertyAction('tour')}
        onMakeOffer={() => handlePropertyAction('offer')}
        onFavorite={() => handlePropertyAction('favorite')}
        isFavorited={isFavorited}
      />
      
      {/* IDX Kestrel Container - In-frame rendering */}
      <div 
        id="ihf-kestrel-container"
        ref={containerRef} 
        className="w-full h-full"
      >
        {/* IDX listing content will be rendered here in-frame */}
        {!listingId && (
          <div className="flex items-center justify-center h-96 text-gray-500">
            <div className="text-center">
              <p className="text-lg mb-2">No listing ID provided</p>
              <p className="text-sm">Please navigate to a specific listing</p>
            </div>
          </div>
        )}
      </div>

      {/* Debug info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-3 py-1 rounded text-sm z-50">
          Property: {property?.address || 'Loading...'} | Enhanced: {interceptedCount}
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
