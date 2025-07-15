
import React, { useEffect, useRef, useState } from 'react';
import { useDocumentHead } from '../hooks/useDocumentHead';
import { LoadingSpinner } from '../components/dashboard/shared/LoadingStates';

const Listings = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Set document head with static title as specified
  useDocumentHead({
    title: 'Property Search',
    description: 'Search and browse available properties with advanced filtering options and detailed listings.',
  });

  useEffect(() => {
    console.log('[Listings] Starting IDX load process');

    const loadIDX = async () => {
      try {
        // Ensure the IDX script is loaded
        if (window.ihfKestrel && containerRef.current) {
          console.log('[Listings] IDX Kestrel found, rendering...');
          
          // Clear any existing content
          containerRef.current.innerHTML = '';
          
          // Create and execute the embed script using the working pattern from Idx.tsx
          const renderedElement = window.ihfKestrel.render();
          if (renderedElement) {
            containerRef.current.appendChild(renderedElement);
            console.log('[Listings] IDX content successfully rendered');
          } else {
            console.error('[Listings] IDX render returned null/undefined');
            setHasError(true);
          }
          
          // Set loading to false after content renders
          setTimeout(() => {
            console.log('[Listings] IDX load complete');
            setIsLoading(false);
          }, 1000);
          
        } else {
          console.log('[Listings] IDX Kestrel not available, showing error');
          // If IDX is not available, show error after a delay
          setTimeout(() => {
            setIsLoading(false);
            setHasError(true);
          }, 2000);
        }
      } catch (error) {
        console.error('[Listings] Error loading IDX content:', error);
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

    </div>
  );
};

export default Listings;
