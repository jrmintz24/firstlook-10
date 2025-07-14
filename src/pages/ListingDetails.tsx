
import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDocumentHead } from '../hooks/useDocumentHead';
import { useIdxIntegration } from '../hooks/useIdxIntegration';
import PropertyActionHeader from '../components/property/PropertyActionHeader';
import PropertyActionManager from '../components/property/PropertyActionManager';

const ListingDetails = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [searchParams] = useSearchParams();
  const listingId = searchParams.get('id');
  const [useIframe, setUseIframe] = useState(false);
  const [idxError, setIdxError] = useState(false);
  const [showActionManager, setShowActionManager] = useState(false);
  
  const { property, loading, error } = useIdxIntegration(listingId);

  // Set document head with dynamic title
  useDocumentHead({
    title: property?.address ? `${property.address} - Home Finder Platform` : 'Property Listing - Home Finder Platform',
    description: 'View detailed information about this property listing including photos, amenities, and neighborhood details.',
  });

  const handleScheduleTour = () => {
    setShowActionManager(true);
    // Trigger tour action
    setTimeout(() => {
      const tourBtn = document.querySelector('[data-action="tour"]') as HTMLElement;
      tourBtn?.click();
    }, 100);
  };

  const handleMakeOffer = () => {
    setShowActionManager(true);
    // Trigger offer action  
    setTimeout(() => {
      const offerBtn = document.querySelector('[data-action="offer"]') as HTMLElement;
      offerBtn?.click();
    }, 100);
  };

  const handleFavorite = () => {
    setShowActionManager(true);
    // Trigger favorite action
    setTimeout(() => {
      const favoriteBtn = document.querySelector('[data-action="favorite"]') as HTMLElement;
      favoriteBtn?.click();
    }, 100);
  };

  useEffect(() => {
    if (!listingId) return;

    // Try IDX widget first
    if (window.ihfKestrel && containerRef.current && !useIframe) {
      try {
        // Clear any existing content
        containerRef.current.innerHTML = '';
        
        // Try to render the IDX widget
        const renderedElement = window.ihfKestrel.render();
        if (renderedElement) {
          containerRef.current.appendChild(renderedElement);
          
          // Try to navigate to the specific listing within the widget
          setTimeout(() => {
            if ((window as any).ihfKestrel?.navigate) {
              (window as any).ihfKestrel.navigate(`/listing/${listingId}`);
            } else if ((window as any).ihf?.showListing) {
              (window as any).ihf.showListing(listingId);
            } else {
              console.log('IDX navigation methods not available, using iframe fallback');
              setUseIframe(true);
            }
          }, 1000);
        } else {
          console.log('IDX widget render failed, using iframe fallback');
          setUseIframe(true);
        }
      } catch (error) {
        console.error('Error rendering IDX widget:', error);
        setIdxError(true);
        setUseIframe(true);
      }
    }
  }, [listingId, useIframe]);

  if (!listingId) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg mb-2 text-red-600">No property ID provided</p>
          <button 
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (useIframe && listingId) {
    // Iframe fallback approach
    return (
      <div className="min-h-screen bg-white">
        {/* Enhanced Property Action Header */}
        <PropertyActionHeader 
          property={property} 
          onScheduleTour={handleScheduleTour}
          onMakeOffer={handleMakeOffer}
          onFavorite={handleFavorite}
        />
        
        {/* Iframe Container */}
        <div className="w-full" style={{ height: 'calc(100vh - 80px)' }}>
          <iframe
            src={`https://kestrel.idxhome.com/listing/${listingId}`}
            className="w-full h-full border-0"
            title={`Property Listing ${listingId}`}
            onError={() => setIdxError(true)}
          />
          
          {idxError && (
            <div className="flex items-center justify-center h-96 text-gray-500">
              <div className="text-center">
                <p className="text-lg mb-2">Unable to load property details</p>
                <p className="text-sm">Property ID: {listingId}</p>
                <button 
                  onClick={() => window.history.back()}
                  className="mt-4 px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                >
                  Go Back
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Property Action Manager */}
        {showActionManager && property && (
          <PropertyActionManager
            property={property}
            agentName="Your Agent" // Replace with actual agent name
            onClose={() => setShowActionManager(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Enhanced Property Action Header */}
      <PropertyActionHeader 
        property={property} 
        onScheduleTour={handleScheduleTour}
        onMakeOffer={handleMakeOffer}
        onFavorite={handleFavorite}
      />
      
      {/* IDX Content Container */}
      <div 
        ref={containerRef} 
        className="w-full"
        style={{ minHeight: 'calc(100vh - 80px)' }}
      >
        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center h-96 text-gray-500">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
              <p className="text-lg mb-2">Loading property details...</p>
              <p className="text-sm">Property ID: {listingId}</p>
            </div>
          </div>
        )}
      </div>
      
      {(idxError || error) && (
        <div className="fixed inset-0 bg-white flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg mb-2 text-red-600">Error loading property details</p>
            <p className="text-sm text-gray-600 mb-4">Property ID: {listingId}</p>
            <div className="space-x-4">
              <button 
                onClick={() => setUseIframe(true)}
                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
              >
                Try Alternative View
              </button>
              <button 
                onClick={() => window.history.back()}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Property Action Manager */}
      {showActionManager && property && (
        <PropertyActionManager
          property={property}
          agentName="Your Agent" // Replace with actual agent name
          onClose={() => setShowActionManager(false)}
        />
      )}
    </div>
  );
};

export default ListingDetails;
