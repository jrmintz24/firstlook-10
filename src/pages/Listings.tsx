
import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const Listings = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    const initializeIDX = () => {
      if (containerRef.current && window.ihfKestrel) {
        try {
          console.log('Initializing IDX with script-based rendering...');
          console.log('Current URL:', window.location.href);
          console.log('Location pathname:', location.pathname);
          console.log('Location search:', location.search);
          
          // Clear previous content
          containerRef.current.innerHTML = '';
          
          // Use script-based rendering pattern - same as IDXSearchWidget
          const script = document.createElement('script');
          script.innerHTML = `
            document.currentScript.replaceWith(ihfKestrel.render());
          `;
          
          containerRef.current.appendChild(script);
          
          console.log('IDX script-based widget initialized successfully');
        } catch (error) {
          console.error('Error initializing IDX widget:', error);
          if (containerRef.current) {
            containerRef.current.innerHTML = '<div class="flex items-center justify-center h-64 text-red-600 bg-red-50 rounded-xl border border-red-200"><p>IDX widget failed to load</p></div>';
          }
        }
      }
    };

    // Initialize immediately if available
    if (window.ihfKestrel) {
      initializeIDX();
    } else {
      // Poll for ihfKestrel availability
      const interval = setInterval(() => {
        if (window.ihfKestrel && containerRef.current) {
          clearInterval(interval);
          initializeIDX();
        }
      }, 100);

      // Cleanup after 10 seconds
      setTimeout(() => {
        clearInterval(interval);
        if (!window.ihfKestrel && containerRef.current) {
          containerRef.current.innerHTML = '<div class="flex items-center justify-center h-64 text-yellow-600 bg-yellow-50 rounded-xl border border-yellow-200"><p>IDX widget is loading...</p></div>';
        }
      }, 10000);
      
      return () => clearInterval(interval);
    }
  }, [location.pathname, location.search]);

  return (
    <div className="min-h-screen bg-white">
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
