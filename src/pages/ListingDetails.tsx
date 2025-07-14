
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDocumentHead } from '../hooks/useDocumentHead';
import PropertyActionHeader from '../components/property/PropertyActionHeader';
import PropertyActionManager from '../components/property/PropertyActionManager';
import { PropertyData } from '../utils/propertyDataUtils';

const ListingDetails = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { listingId } = useParams<{ listingId: string }>();
  const [property, setProperty] = useState<PropertyData | null>(null);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    actionType: 'tour' | 'offer' | 'favorite' | null;
  }>({
    isOpen: false,
    actionType: null
  });

  // Set document head with dynamic title
  useDocumentHead({
    title: listingId ? `Listing ${listingId} - Home Finder Platform` : 'Property Listing - Home Finder Platform',
    description: 'View detailed information about this property listing including photos, amenities, and neighborhood details.',
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

  const handlePropertyAction = (actionType: 'tour' | 'offer' | 'favorite') => {
    const propertyData = extractPropertyFromIDX();
    if (propertyData) {
      setProperty(propertyData);
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

  useEffect(() => {
    // Ensure the IDX script is loaded before rendering
    if (window.ihfKestrel && containerRef.current) {
      // Clear any existing content
      containerRef.current.innerHTML = '';
      
      try {
        // Create a script element with the embed code
        const script = document.createElement('script');
        
        // Configure for inline detail view to prevent modals
        if (listingId) {
          // Force inline detail view configuration
          script.textContent = `
            try {
              // Configure iHomeFinder to use inline views
              if (window.ihfKestrel.config) {
                window.ihfKestrel.config.modalMode = false;
                window.ihfKestrel.config.popupMode = false;
                window.ihfKestrel.config.inlineMode = true;
              }
              
              const element = ihfKestrel.render({
                listingId: '${listingId}',
                view: 'detail',
                modalMode: false,
                popupMode: false,
                inlineMode: true,
                container: 'inline'
              });
              
              if (element) {
                element.style.position = 'static';
                element.style.zIndex = 'auto';
                document.currentScript.replaceWith(element);
              } else {
                // Fallback to standard render with inline config
                const fallbackElement = ihfKestrel.render({
                  modalMode: false,
                  popupMode: false,
                  inlineMode: true
                });
                if (fallbackElement) {
                  fallbackElement.style.position = 'static';
                  fallbackElement.style.zIndex = 'auto';
                }
                document.currentScript.replaceWith(fallbackElement);
              }
            } catch (e) {
              // Fallback to standard render if specific listing render fails
              const fallbackElement = ihfKestrel.render();
              if (fallbackElement) {
                fallbackElement.style.position = 'static';
                fallbackElement.style.zIndex = 'auto';
              }
              document.currentScript.replaceWith(fallbackElement);
            }
          `;
        } else {
          // Standard render with inline configuration
          script.textContent = `
            try {
              if (window.ihfKestrel.config) {
                window.ihfKestrel.config.modalMode = false;
                window.ihfKestrel.config.popupMode = false;
                window.ihfKestrel.config.inlineMode = true;
              }
              
              const element = ihfKestrel.render({
                modalMode: false,
                popupMode: false,
                inlineMode: true
              });
              
              if (element) {
                element.style.position = 'static';
                element.style.zIndex = 'auto';
              }
              
              document.currentScript.replaceWith(element);
            } catch (e) {
              document.currentScript.replaceWith(ihfKestrel.render());
            }
          `;
        }
        
        // Append the script to the container
        containerRef.current.appendChild(script);
        
        // Extract property data after a short delay
        setTimeout(() => {
          const propertyData = extractPropertyFromIDX();
          if (propertyData) {
            setProperty(propertyData);
          }
        }, 1000);
        
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
  }, [listingId]);

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Property Action Header */}
      <PropertyActionHeader 
        property={property}
        onScheduleTour={() => handlePropertyAction('tour')}
        onMakeOffer={() => handlePropertyAction('offer')}
        onFavorite={() => handlePropertyAction('favorite')}
        className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md"
      />
      
      {/* IDX Content */}
      <div ref={containerRef} className="w-full h-full pt-20">
        {/* IDX listing content will be rendered here */}
      </div>

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
