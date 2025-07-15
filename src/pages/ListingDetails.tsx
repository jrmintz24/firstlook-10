
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDocumentHead } from '../hooks/useDocumentHead';
import PropertyActionHeader from '../components/property/PropertyActionHeader';
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

  // Simple property data extraction from IDX content
  const extractPropertyFromIDX = () => {
    if (!containerRef.current) return null;
    
    console.log('[ListingDetails] Extracting property data from IDX content');
    
    // Try to extract property data from the IDX content
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
  };

  useEffect(() => {
    console.log('[ListingDetails] Starting IDX render for listing:', listingId);

    if (listingId && containerRef.current) {
      // Clear existing content and render IDX
      containerRef.current.innerHTML = '<div id="ihf-kestrel-container"></div>';
      
      // Let IDX render naturally since pop-outs are disabled at dashboard level
      if (window.ihfKestrel) {
        const script = document.createElement('script');
        script.textContent = `ihfKestrel.render();`;
        containerRef.current.appendChild(script);
        
        // Extract property data after render
        setTimeout(() => {
          const propertyData = extractPropertyFromIDX();
          if (propertyData) {
            setProperty(propertyData);
          }
        }, 2000);
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
    <div className="min-h-screen bg-white">
      {/* Sticky Property Action Header */}
      <PropertyActionHeader 
        property={property}
        onScheduleTour={() => handlePropertyAction('tour')}
        onMakeOffer={() => handlePropertyAction('offer')}
        onFavorite={() => handlePropertyAction('favorite')}
      />

      {/* Property Tab Navigation - This is the key component we want to see */}
      <PropertyTabNavigation
        property={property}
        onScheduleTour={() => handlePropertyAction('tour')}
        onMakeOffer={() => handlePropertyAction('offer')}
        onFavorite={() => handlePropertyAction('favorite')}
        isFavorited={isFavorited}
      />
      
      {/* IDX Content */}
      <div ref={containerRef} className="w-full h-full">
        {/* IDX listing content will be rendered here */}
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
