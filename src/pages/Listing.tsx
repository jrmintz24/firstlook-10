
import React, { useEffect, useRef, useState } from 'react';
import { useDocumentHead } from '../hooks/useDocumentHead';
import { LoadingSpinner } from '../components/dashboard/shared/LoadingStates';

const Listing = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [listingAddress, setListingAddress] = useState('Property Listing');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Set document head with dynamic title
  useDocumentHead({
    title: listingAddress,
    description: 'View detailed information about this property listing including photos, amenities, and neighborhood details.',
  });

  const extractListingAddress = () => {
    if (!containerRef.current) return;
    
    // Try to extract property address from IDX content after it loads
    const checkForAddress = () => {
      const addressSelectors = [
        '[data-address]',
        '.address',
        '.property-address',
        '.listing-address',
        'h1',
        '.property-title'
      ];
      
      for (const selector of addressSelectors) {
        const element = containerRef.current?.querySelector(selector);
        if (element && element.textContent?.trim()) {
          const address = element.textContent.trim();
          if (address && address !== 'Property Listing') {
            setListingAddress(address);
            return true;
          }
        }
      }
      return false;
    };

    // Try immediately and then with delays
    if (!checkForAddress()) {
      setTimeout(() => {
        if (!checkForAddress()) {
          setTimeout(checkForAddress, 2000);
        }
      }, 1000);
    }
  };

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
          
          // Extract address for title after IDX loads
          setTimeout(() => {
            extractListingAddress();
            setIsLoading(false);
          }, 1000);
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
  }, []);

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
    <div className="min-h-screen bg-white">
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner size="lg" text="Loading property listing..." />
        </div>
      )}
      
      {/* IDX content will be rendered here */}
      <div 
        ref={containerRef} 
        className={`w-full ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
      />
    </div>
  );
};

export default Listing;
