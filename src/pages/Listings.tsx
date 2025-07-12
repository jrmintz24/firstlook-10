
import React, { useEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import ListingHead from '@/components/listings/ListingHead';
import ListingPageLayout from '@/components/listings/ListingPageLayout';

const Listings = () => {
  const { address } = useParams<{ address?: string }>();
  const [searchParams] = useSearchParams();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Extract listing data from URL parameters or route params
  const listingAddress = address || searchParams.get('address') || undefined;
  const listingCity = searchParams.get('city') || undefined;
  const listingPhotoUrl = searchParams.get('photo') || undefined;
  const listingPhotoWidth = searchParams.get('photoWidth') || '1200';
  const listingPhotoHeight = searchParams.get('photoHeight') || '800';

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

  return (
    <>
      {/* SEO Head Management */}
      <ListingHead
        listingAddress={listingAddress}
        listingCity={listingCity}
        listingPhotoUrl={listingPhotoUrl}
        listingPhotoWidth={listingPhotoWidth}
        listingPhotoHeight={listingPhotoHeight}
      />

      {/* Page Layout */}
      <ListingPageLayout>
        <div className="p-6">
          {/* Page Title */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              {listingAddress || 'Property Search'}
            </h1>
            {listingCity && (
              <p className="text-gray-600 mt-2">
                {listingCity} Real Estate
              </p>
            )}
          </div>

          {/* iHomeFinder IDX Container - Direct widget rendering */}
          <div 
            ref={containerRef} 
            className="min-h-[600px] w-full border rounded-lg bg-white"
            style={{ minHeight: '600px' }}
          >
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500">Loading iHomeFinder IDX...</p>
            </div>
          </div>
        </div>
      </ListingPageLayout>
    </>
  );
};

export default Listings;
