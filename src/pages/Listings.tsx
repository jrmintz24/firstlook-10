
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
    // Use the exact iHomeFinder embed code
    if (containerRef.current && window.ihfKestrel) {
      try {
        console.log('Initializing iHomeFinder with exact embed code...');
        
        // Clear the container first
        containerRef.current.innerHTML = '';
        
        // Create a script element with the exact embed code provided by iHomeFinder
        const script = document.createElement('script');
        script.innerHTML = 'document.currentScript.replaceWith(ihfKestrel.render());';
        
        // Append the script to the container
        containerRef.current.appendChild(script);
        
        console.log('iHomeFinder embed code executed successfully');
      } catch (error) {
        console.error('Failed to load iHomeFinder widget:', error);
      }
    } else {
      // Poll for ihfKestrel availability
      const interval = setInterval(() => {
        if (window.ihfKestrel && containerRef.current) {
          clearInterval(interval);
          try {
            console.log('iHomeFinder now available, initializing...');
            
            // Clear the container first
            containerRef.current.innerHTML = '';
            
            // Create a script element with the exact embed code
            const script = document.createElement('script');
            script.innerHTML = 'document.currentScript.replaceWith(ihfKestrel.render());';
            
            // Append the script to the container
            containerRef.current.appendChild(script);
            
            console.log('iHomeFinder embed code executed successfully');
          } catch (error) {
            console.error('Failed to load iHomeFinder widget:', error);
          }
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

          {/* iHomeFinder IDX Container with exact embed code */}
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
