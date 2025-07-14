
import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const Listings = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Determine if this is a property detail page based on query parameters
  const isDetailPage = location.pathname === '/listing' && location.search.includes('id=');

  useEffect(() => {
    const initializeIDX = () => {
      if (containerRef.current && window.ihfKestrel) {
        try {
          console.log('Initializing IDX widget...');
          console.log('Current URL:', window.location.href);
          console.log('Location pathname:', location.pathname);
          console.log('Location search:', location.search);
          console.log('Is detail page:', isDetailPage);
          
          // Clear previous content
          containerRef.current.innerHTML = '';
          
          // Safely set base URL if config exists
          if (window.ihfKestrel.config) {
            // Use type assertion to access baseUrl property
            (window.ihfKestrel.config as any).baseUrl = window.location.origin;
            console.log('IDX baseUrl set to:', window.location.origin);
          }
          
          // Let IDX handle URL routing with proper base URL
          const widgetElement = window.ihfKestrel.render();
          
          if (widgetElement && containerRef.current) {
            if (widgetElement instanceof HTMLElement) {
              containerRef.current.appendChild(widgetElement);
            } else if (typeof widgetElement === 'string') {
              containerRef.current.innerHTML = widgetElement;
            }
            console.log('IDX widget initialized successfully');
            
            // Add URL debugging after render
            setTimeout(() => {
              const links = containerRef.current?.querySelectorAll('a[href]');
              if (links) {
                console.log('IDX generated links sample:', Array.from(links).slice(0, 3).map(link => link.getAttribute('href')));
              }
            }, 2000);
          }
        } catch (error) {
          console.error('Error initializing IDX widget:', error);
        }
      }
    };

    // Initialize immediately if available
    if (window.ihfKestrel) {
      initializeIDX();
    } else {
      // Fallback with timeout
      setTimeout(() => {
        if (window.ihfKestrel) {
          initializeIDX();
        } else {
          console.warn('IDX widget failed to load after timeout');
        }
      }, 1000);
    }
  }, [location.pathname, location.search, isDetailPage]);

  return (
    <div className="min-h-screen bg-white">
      {/* IDX Container */}
      <div 
        ref={containerRef}
        className="w-full min-h-screen"
      >
        <div className="flex items-center justify-center h-64 text-gray-500">
          {isDetailPage ? 'Loading property details...' : 'Loading MLS listings...'}
        </div>
      </div>
    </div>
  );
};

export default Listings;
