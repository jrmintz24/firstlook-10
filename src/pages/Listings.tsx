
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
    // Simple iHomeFinder integration following their exact instructions
    const initializeIDX = () => {
      if (containerRef.current && window.ihfKestrel) {
        try {
          console.log('Initializing iHomeFinder widget...');
          const widget = window.ihfKestrel.render();
          if (widget && containerRef.current) {
            containerRef.current.innerHTML = '';
            containerRef.current.appendChild(widget);
            console.log('iHomeFinder widget loaded successfully');
          }
        } catch (error) {
          console.error('Failed to load iHomeFinder widget:', error);
        }
      }
    };

    // Wait for iHomeFinder to be available
    if (window.ihfKestrel) {
      initializeIDX();
    } else {
      // Poll for availability
      const interval = setInterval(() => {
        if (window.ihfKestrel) {
          clearInterval(interval);
          initializeIDX();
        }
      }, 100);

      // Cleanup after 10 seconds
      setTimeout(() => clearInterval(interval), 10000);
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

          {/* Simple IDX Container */}
          <div 
            ref={containerRef} 
            className="min-h-[600px] w-full border rounded-lg bg-white"
            style={{ minHeight: '600px' }}
          >
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500">Loading property search...</p>
            </div>
          </div>
        </div>
      </ListingPageLayout>
    </>
  );
};

export default Listings;
