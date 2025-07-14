
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDocumentHead } from '../hooks/useDocumentHead';
import PropertyActionHeader from '../components/property/PropertyActionHeader';
import PropertyTabNavigation from '../components/property/PropertyTabNavigation';
import PropertyActionManager from '../components/property/PropertyActionManager';
import { PropertyData } from '../utils/propertyDataUtils';
import { useIDXButtonInterception } from '../hooks/useIDXButtonInterception';

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

  // Set up IDX button interception
  const { scanForButtons, interceptedCount } = useIDXButtonInterception({
    onScheduleTour: (propertyData) => handlePropertyAction('tour', propertyData),
    onMakeOffer: (propertyData) => handlePropertyAction('offer', propertyData),
    onFavorite: (propertyData) => handlePropertyAction('favorite', propertyData),
    onRequestInfo: (propertyData) => handlePropertyAction('info', propertyData)
  });

  const extractPropertyFromIDX = () => {
    if (!containerRef.current) return null;
    
    // Try to extract property data from the IDX content
    const addressElement = containerRef.current.querySelector('[data-address], .address, .property-address, h1, .listing-address');
    const priceElement = containerRef.current.querySelector('[data-price], .price, .property-price, .listing-price');
    const bedsElement = containerRef.current.querySelector('[data-beds], .beds, .bedroom, .bedrooms');
    const bathsElement = containerRef.current.querySelector('[data-baths], .baths, .bathroom, .bathrooms');
    
    return {
      address: addressElement?.textContent?.trim() || `Property ${listingId}`,
      price: priceElement?.textContent?.trim() || '',
      beds: bedsElement?.textContent?.trim() || '',
      baths: bathsElement?.textContent?.trim() || '',
      mlsId: listingId || ''
    };
  };

  const removeIDXFormsFromContainer = () => {
    if (!containerRef.current) return;
    
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
      console.log('Removing IDX form from container:', form);
      form.remove();
    });
  };

  useEffect(() => {
    // Ensure the IDX script is loaded before rendering
    if (window.ihfKestrel && containerRef.current) {
      // Clear any existing content
      containerRef.current.innerHTML = '';
      
      try {
        // Create a script element with the embed code
        const script = document.createElement('script');
        
        // If we have a listing ID, try to render the specific listing
        if (listingId) {
          // Try to configure IDX to show specific listing if possible
          script.textContent = `
            try {
              const element = ihfKestrel.render({
                listingId: '${listingId}',
                view: 'detail'
              });
              if (element) {
                document.currentScript.replaceWith(element);
              } else {
                // Fallback to standard render
                document.currentScript.replaceWith(ihfKestrel.render());
              }
            } catch (e) {
              // Fallback to standard render if specific listing render fails
              document.currentScript.replaceWith(ihfKestrel.render());
            }
          `;
        } else {
          // Standard render without specific listing
          script.textContent = 'document.currentScript.replaceWith(ihfKestrel.render());';
        }
        
        // Append the script to the container
        containerRef.current.appendChild(script);
        
        // Extract property data after IDX loads and scan for buttons
        setTimeout(() => {
          const propertyData = extractPropertyFromIDX();
          if (propertyData) {
            setProperty(propertyData);
          }
          // Trigger button scan and form removal after IDX content is loaded
          scanForButtons();
          removeIDXFormsFromContainer();
        }, 2000);
        
        // Additional cleanup after a longer delay to catch late-loading forms
        setTimeout(() => {
          removeIDXFormsFromContainer();
        }, 5000);
        
      } catch (error) {
        console.error('Error rendering IDX content:', error);
        // Fallback: show a message if IDX fails to load
        if (containerRef.current) {
          containerRef.current.innerHTML = `
            <div class="flex items-center justify-center h-96 text-gray-500">
              <div class="text-center">
                <p class="text-lg mb-2">Loading property details...</p>
                <p class="text-sm">If this takes too long, please try refreshing the page.</p>
              </div>
            </div>
          `;
        }
      }
    }
  }, [listingId, scanForButtons]);

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Property Action Header */}
      <PropertyActionHeader 
        property={property}
        onScheduleTour={() => handlePropertyAction('tour')}
        onMakeOffer={() => handlePropertyAction('offer')}
        onFavorite={() => handlePropertyAction('favorite')}
      />

      {/* Property Tab Navigation */}
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

      {/* Debug info (remove in production) */}
      {process.env.NODE_ENV === 'development' && interceptedCount > 0 && (
        <div className="fixed bottom-4 left-4 bg-blue-600 text-white px-3 py-1 rounded text-sm">
          Enhanced {interceptedCount} IDX buttons
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
