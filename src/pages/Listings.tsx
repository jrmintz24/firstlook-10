
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
          console.log('iHomeFinder available, initializing with exact embed code...');
          console.log('ihfKestrel config:', window.ihfKestrel.config);
          
          // Clear the container first
          containerRef.current.innerHTML = '';
          
          // Use the exact embed code provided by iHomeFinder
          // This creates a temporary script element that gets replaced by the widget
          const embedScript = document.createElement('script');
          embedScript.innerHTML = 'document.currentScript.replaceWith(ihfKestrel.render());';
          
          // Append to container - the script will execute and replace itself with the widget
          containerRef.current.appendChild(embedScript);
          
          console.log('iHomeFinder exact embed code executed successfully');
        } catch (error) {
          console.error('Error initializing iHomeFinder widget:', error);
        }
      } else {
        console.log('iHomeFinder not ready yet. ihfKestrel available:', !!window.ihfKestrel);
      }
    };

    // Check if iHomeFinder is already available
    if (window.ihfKestrel) {
      initializeIDX();
    } else {
      // Poll for ihfKestrel availability with more detailed logging
      console.log('Polling for iHomeFinder availability...');
      const interval = setInterval(() => {
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

          {/* iHomeFinder IDX Container - Using exact embed code */}
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
