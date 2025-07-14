
import React, { useEffect, useRef, useState } from 'react';
import { useDocumentHead } from '../hooks/useDocumentHead';
import { LoadingSpinner } from '../components/dashboard/shared/LoadingStates';
import { useIDXButtonInterception } from '../hooks/useIDXButtonInterception';
import { PropertyData } from '../utils/propertyDataUtils';
import PropertyActionManager from '../components/property/PropertyActionManager';

const Listings = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    actionType: 'tour' | 'offer' | 'favorite' | 'info' | null;
  }>({
    isOpen: false,
    actionType: null
  });
  const [selectedProperty, setSelectedProperty] = useState<PropertyData | null>(null);

  // Set document head with static title as specified
  useDocumentHead({
    title: 'Property Search',
    description: 'Search and browse available properties with advanced filtering options and detailed listings.',
  });

  const handlePropertyAction = (actionType: 'tour' | 'offer' | 'favorite' | 'info', propertyData: PropertyData) => {
    setSelectedProperty(propertyData);
    setModalState({
      isOpen: true,
      actionType
    });
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      actionType: null
    });
    setSelectedProperty(null);
  };

  // Set up IDX button interception
  const { scanForButtons, interceptedCount } = useIDXButtonInterception({
    onScheduleTour: (propertyData) => handlePropertyAction('tour', propertyData),
    onMakeOffer: (propertyData) => handlePropertyAction('offer', propertyData),
    onFavorite: (propertyData) => handlePropertyAction('favorite', propertyData),
    onRequestInfo: (propertyData) => handlePropertyAction('info', propertyData)
  });

  useEffect(() => {
    const loadIDX = async () => {
      try {
        // Ensure the IDX script is loaded
        if (window.ihfKestrel && containerRef.current) {
          // Clear any existing content
          containerRef.current.innerHTML = '';
          
          // Create a script element with the embed code
          const script = document.createElement('script');
          script.textContent = `
            try {
              const element = ihfKestrel.render({
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
              console.error('IDX render error:', e);
              document.currentScript.replaceWith(ihfKestrel.render());
            }
          `;
          
          // Append the script to the container
          containerRef.current.appendChild(script);
          
          // Set loading to false and scan for buttons after content renders
          setTimeout(() => {
            setIsLoading(false);
            // Scan for IDX buttons to intercept
            scanForButtons();
          }, 2000);
        } else {
          // If IDX is not available, show error after a delay
          setTimeout(() => {
            setIsLoading(false);
            setHasError(true);
          }, 2000);
        }
      } catch (error) {
        console.error('Error loading IDX content:', error);
        setIsLoading(false);
        setHasError(true);
      }
    };

    loadIDX();
  }, [scanForButtons]);

  if (hasError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-4">Unable to load property search</p>
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
    <div className="min-h-screen bg-white">
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner size="lg" text="Loading property search..." />
        </div>
      )}
      
      {/* IDX content will be rendered here */}
      <div 
        ref={containerRef} 
        className={`w-full ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
      />

      {/* Debug info (remove in production) */}
      {process.env.NODE_ENV === 'development' && interceptedCount > 0 && (
        <div className="fixed bottom-4 left-4 bg-green-600 text-white px-3 py-1 rounded text-sm">
          Enhanced {interceptedCount} IDX buttons
        </div>
      )}

      {/* Property Action Manager for Modals */}
      <PropertyActionManager
        isOpen={modalState.isOpen}
        onClose={closeModal}
        actionType={modalState.actionType}
        property={selectedProperty}
      />
    </div>
  );
};

export default Listings;
