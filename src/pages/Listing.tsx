
import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDocumentHead } from '../hooks/useDocumentHead';
import { LoadingSpinner } from '../components/dashboard/shared/LoadingStates';

const Listing = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  

  // Extract listing ID from query parameter
  const searchParams = new URLSearchParams(location.search);
  const listingId = searchParams.get('id');

  // Set document head with dynamic title
  useDocumentHead({
    title: 'Property Listing',
    description: 'View detailed information about this property listing including photos, amenities, and neighborhood details.',
  });

  useEffect(() => {
    console.log('[Listing] Starting IDX render for listing:', listingId);

    if (listingId && containerRef.current && window.ihfKestrel) {
      // Clear existing content
      containerRef.current.innerHTML = '';
      
      // Render IDX content
      const renderedElement = window.ihfKestrel.render();
      if (renderedElement) {
        containerRef.current.appendChild(renderedElement);
        console.log('[Listing] IDX content successfully rendered');
        setIsLoading(false);
      } else {
        console.error('[Listing] IDX render returned null/undefined');
        setIsLoading(false);
        setHasError(true);
      }
    } else {
      setTimeout(() => {
        setIsLoading(false);
        setHasError(true);
      }, 2000);
    }
  }, [listingId]);

  if (hasError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-4">Unable to load property listing</p>
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
    <div className="min-h-screen bg-background">
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner size="lg" text="Loading property listing..." />
        </div>
      )}
      
      {/* IDX Content */}
      <div ref={containerRef} className="w-full min-h-screen">
        {/* IDX listing content will be rendered here */}
      </div>
    </div>
  );
};

export default Listing;
