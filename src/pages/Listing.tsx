
import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDocumentHead } from '../hooks/useDocumentHead';
import { LoadingSpinner } from '../components/dashboard/shared/LoadingStates';
import { PropertyToolbar } from '../components/property/PropertyToolbar';

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

    const renderIDXContent = () => {
      if (listingId && containerRef.current && window.ihfKestrel?.render) {
        try {
          // Clear existing content
          containerRef.current.innerHTML = '';
          
          // Render IDX content using the embed code pattern
          const script = document.createElement('script');
          script.textContent = 'document.currentScript.replaceWith(ihfKestrel.render());';
          containerRef.current.appendChild(script);
          
          console.log('[Listing] IDX embed script injected successfully');
          setIsLoading(false);
          return true;
        } catch (error) {
          console.error('[Listing] Error rendering IDX content:', error);
          return false;
        }
      }
      return false;
    };

    // Try immediate render
    if (renderIDXContent()) {
      return;
    }

    // If immediate render fails, wait for ihfKestrel to load
    let attempts = 0;
    const maxAttempts = 20;
    const interval = setInterval(() => {
      attempts++;
      console.log(`[Listing] IDX loading attempt ${attempts}/${maxAttempts}`, {
        listingId,
        hasContainer: !!containerRef.current,
        hasIhfKestrel: !!window.ihfKestrel,
        hasRender: !!window.ihfKestrel?.render
      });

      if (renderIDXContent()) {
        clearInterval(interval);
      } else if (attempts >= maxAttempts) {
        clearInterval(interval);
        console.error('[Listing] Failed to load IDX content after', maxAttempts, 'attempts');
        setIsLoading(false);
        setHasError(true);
      }
    }, 500);

    return () => clearInterval(interval);
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
      {/* Property Toolbar */}
      {!isLoading && <PropertyToolbar />}
      
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner size="lg" text="Loading property listing..." />
        </div>
      )}
      
      {/* IDX Content */}
      <div ref={containerRef} className={`w-full min-h-screen ${!isLoading ? 'pt-32' : ''}`}>
        {/* IDX listing content will be rendered here */}
      </div>
    </div>
  );
};

export default Listing;
