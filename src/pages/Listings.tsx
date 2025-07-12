
import React, { useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import ListingHead from '@/components/listings/ListingHead';
import ModernTourSchedulingModal from '@/components/ModernTourSchedulingModal';
import { IDX_SCHEDULE_TOUR_EVENT, PropertyData, IDX_CUSTOM_CSS } from '@/utils/idxCommunication';

const Listings = () => {
  const { address } = useParams<{ address?: string }>();
  const [searchParams] = useSearchParams();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<PropertyData | null>(null);
  
  // Extract listing data from URL parameters or route params
  const listingAddress = address || searchParams.get('address') || undefined;
  const listingCity = searchParams.get('city') || undefined;
  const listingPhotoUrl = searchParams.get('photo') || undefined;
  const listingPhotoWidth = searchParams.get('photoWidth') || '1200';
  const listingPhotoHeight = searchParams.get('photoHeight') || '800';

  // Handle tour scheduling events from IDX
  useEffect(() => {
    const handleTourScheduling = (event: CustomEvent<PropertyData>) => {
      console.log('Tour scheduling triggered:', event.detail);
      setSelectedProperty(event.detail);
      setIsModalOpen(true);
    };

    window.addEventListener(IDX_SCHEDULE_TOUR_EVENT, handleTourScheduling as EventListener);
    
    return () => {
      window.removeEventListener(IDX_SCHEDULE_TOUR_EVENT, handleTourScheduling as EventListener);
    };
  }, []);

  // Inject custom CSS into IDX
  useEffect(() => {
    const injectCustomCSS = () => {
      // Inject CSS only
      if (!document.querySelector('#idx-custom-styles')) {
        const styleElement = document.createElement('style');
        styleElement.id = 'idx-custom-styles';
        styleElement.textContent = IDX_CUSTOM_CSS;
        document.head.appendChild(styleElement);
      }
    };

    // Inject CSS after a short delay to ensure IDX is loaded
    const timer = setTimeout(injectCustomCSS, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const initializeIDX = () => {
      if (containerRef.current && window.ihfKestrel) {
        try {
          console.log('iHomeFinder available, initializing widget directly...');
          console.log('ihfKestrel config:', window.ihfKestrel.config);
          console.log('ihfKestrel render function:', typeof window.ihfKestrel.render);
          
          // Clear the container first
          containerRef.current.innerHTML = '';
          
          // Call ihfKestrel.render() directly and handle the returned element
          const widgetElement = window.ihfKestrel.render();
          
          console.log('Widget element returned:', widgetElement);
          console.log('Widget element type:', typeof widgetElement);
          console.log('Widget element tagName:', widgetElement?.tagName);
          
          if (widgetElement && containerRef.current) {
            // If it's a DOM element, append it directly
            if (widgetElement instanceof HTMLElement) {
              containerRef.current.appendChild(widgetElement);
              console.log('iHomeFinder widget appended successfully');
              
            } else {
              console.error('Widget element is not a valid DOM element:', widgetElement);
              // Try to create a div and set innerHTML if it's a string
              if (typeof widgetElement === 'string') {
                const div = document.createElement('div');
                div.innerHTML = widgetElement;
                containerRef.current.appendChild(div);
                console.log('Widget rendered as HTML string');
              }
            }
          } else {
            console.error('Failed to render iHomeFinder widget - no widget returned or container missing');
            console.log('Container exists:', !!containerRef.current);
            console.log('Widget returned:', !!widgetElement);
            
            // Show error message in container
            if (containerRef.current) {
              containerRef.current.innerHTML = '<div class="flex items-center justify-center h-64 text-red-600"><p>Failed to load IDX widget. Please check configuration.</p></div>';
            }
          }
        } catch (error) {
          console.error('Error initializing iHomeFinder widget:', error);
          console.error('Error details:', {
            message: error.message,
            stack: error.stack
          });
          
          // Show error message in container
          if (containerRef.current) {
            containerRef.current.innerHTML = '<div class="flex items-center justify-center h-64 text-red-600"><p>Error loading IDX widget. Check console for details.</p></div>';
          }
        }
      } else {
        console.log('iHomeFinder not ready yet. ihfKestrel available:', !!window.ihfKestrel);
        console.log('Container available:', !!containerRef.current);
      }
    };

    // Check if iHomeFinder is already available
    if (window.ihfKestrel) {
      console.log('iHomeFinder already available, initializing immediately');
      initializeIDX();
    } else {
      // Poll for ihfKestrel availability with more detailed logging
      console.log('Polling for iHomeFinder availability...');
      const interval = setInterval(() => {
        console.log('Checking for ihfKestrel...', !!window.ihfKestrel);
        if (window.ihfKestrel && containerRef.current) {
          console.log('iHomeFinder now available, clearing interval');
          clearInterval(interval);
          initializeIDX();
        }
      }, 100);

      // Cleanup after 10 seconds
      setTimeout(() => {
        clearInterval(interval);
        if (!window.ihfKestrel) {
          console.error('iHomeFinder failed to load after 10 seconds');
          if (containerRef.current) {
            containerRef.current.innerHTML = '<div class="flex items-center justify-center h-64 text-yellow-600"><p>IDX widget is taking longer than expected to load. Please refresh the page.</p></div>';
          }
        }
      }, 10000);
    }
  }, []);

  const pageTitle = listingAddress ? `${listingAddress} - Property Details` : 'Property Search';

  return (
    <>
      <ListingHead 
        listingAddress={listingAddress}
        listingCity={listingCity}
        listingPhotoUrl={listingPhotoUrl}
        listingPhotoWidth={listingPhotoWidth}
        listingPhotoHeight={listingPhotoHeight}
      />
      <div 
        ref={containerRef}
        className="w-full min-h-screen"
      >
        <div className="flex items-center justify-center h-32 text-gray-500">
          Loading MLS listings...
        </div>
      </div>
      
      <ModernTourSchedulingModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProperty(null);
        }}
        onSuccess={async () => {
          setIsModalOpen(false);
          setSelectedProperty(null);
        }}
      />
    </>
  );
};

export default Listings;
