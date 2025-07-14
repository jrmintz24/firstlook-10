
import React, { useEffect, useRef } from 'react';

const Listings = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Ultra-minimal IDX initialization - no complexity, no polling, no interference
  useEffect(() => {
    const initializeIDX = () => {
      if (containerRef.current && window.ihfKestrel) {
        try {
          console.log('Initializing IDX widget...');
          containerRef.current.innerHTML = '';
          
          // Use the simplest possible approach
          const widgetElement = window.ihfKestrel.render();
          
          if (widgetElement && containerRef.current) {
            if (widgetElement instanceof HTMLElement) {
              containerRef.current.appendChild(widgetElement);
            } else if (typeof widgetElement === 'string') {
              containerRef.current.innerHTML = widgetElement;
            }
            console.log('IDX widget initialized successfully');
          }
        } catch (error) {
          console.error('Error initializing IDX widget:', error);
        }
      }
    };

    // Simple initialization - try immediately, then once more after a short delay
    if (window.ihfKestrel) {
      initializeIDX();
    } else {
      setTimeout(() => {
        if (window.ihfKestrel) {
          initializeIDX();
        }
      }, 1000);
    }
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Minimal container - let IDX handle everything */}
      <div 
        ref={containerRef}
        className="w-full min-h-screen"
      >
        <div className="flex items-center justify-center h-64 text-gray-500">
          Loading MLS listings...
        </div>
      </div>
    </div>
  );
};

export default Listings;
