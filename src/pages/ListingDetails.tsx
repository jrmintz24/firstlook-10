
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDocumentHead } from '../hooks/useDocumentHead';
import PropertyActionHeader from '../components/property/PropertyActionHeader';
import PropertyTabNavigation from '../components/property/PropertyTabNavigation';
import PropertyActionManager from '../components/property/PropertyActionManager';
import { PropertyData } from '../utils/propertyDataUtils';
import { useSimplifiedIDXInterception } from '../hooks/useSimplifiedIDXInterception';

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

  // Set up simplified IDX interception
  const { scanForElements, interceptedCount } = useSimplifiedIDXInterception({
    onScheduleTour: (propertyData) => handlePropertyAction('tour', propertyData),
    onMakeOffer: (propertyData) => handlePropertyAction('offer', propertyData),
    onFavorite: (propertyData) => handlePropertyAction('favorite', propertyData),
    onRequestInfo: (propertyData) => handlePropertyAction('info', propertyData)
  });

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

  const removeIDXFormsFromContainer = () => {
    if (!containerRef.current) return;
    
    console.log('[ListingDetails] Removing IDX forms from container');
    
    // Additional cleanup specifically for the container
    const formsToRemove = containerRef.current.querySelectorAll(`
      .ihf-contact-form,
      .ihf-request-info,
      .ihf-lead-form,
      .contact-form,
      .request-info-form,
      .lead-capture-form,
      .sidebar-contact,
      .property-contact-form,
      form[action*="contact"],
      form[action*="request"],
      form[action*="lead"]
    `);
    
    formsToRemove.forEach(form => {
      console.log('[ListingDetails] Removing IDX form from container:', form);
      form.remove();
    });
  };

  // Function to render specific listing using IDX
  const renderListing = (propertyId: string) => {
    if (window.ihfKestrel && containerRef.current) {
      console.log('[ListingDetails] Rendering listing:', propertyId);
      
      try {
        // Create a script element with the embed code for specific listing
        const script = document.createElement('script');
        script.textContent = `
          try {
            console.log('[IDX Detail] Rendering listing: ${propertyId}');
            const element = ihfKestrel.render({
              listingId: '${propertyId}',
              view: 'detail',
              modalMode: false,
              popupMode: false,
              inlineMode: true
            });
            if (element) {
              document.currentScript.replaceWith(element);
            } else {
              document.currentScript.replaceWith(ihfKestrel.render());
            }
          } catch (e) {
            console.error('[IDX Detail] Render error:', e);
            document.currentScript.replaceWith(ihfKestrel.render());
          }
        `;
        containerRef.current.appendChild(script);
      } catch (error) {
        console.error('[ListingDetails] Error rendering listing:', error);
      }

      // Extract property data and scan for elements after render
      setTimeout(() => {
        const propertyData = extractPropertyFromIDX();
        if (propertyData) {
          setProperty(propertyData);
        }
        scanForElements();
        removeIDXFormsFromContainer();
      }, 2000);
    }
  };

  useEffect(() => {
    console.log('[ListingDetails] Starting IDX render for listing:', listingId);

    if (listingId && containerRef.current) {
      // Clear existing content
      containerRef.current.innerHTML = '<div id="ihf-kestrel-container"></div>';
      
      // Render the specific listing
      renderListing(listingId);
    }
  }, [listingId, scanForElements]);

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
