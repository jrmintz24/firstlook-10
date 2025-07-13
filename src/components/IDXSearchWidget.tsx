
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

interface IDXSearchWidgetProps {
  onSearch?: () => void;
  className?: string;
}

const IDXSearchWidget = ({ onSearch, className = "" }: IDXSearchWidgetProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeWidget = () => {
      if (containerRef.current && window.ihfKestrel) {
        try {
          console.log('Initializing IDX Quick Search Widget...');
          
          // Clear the container first
          containerRef.current.innerHTML = '';
          
          // Create script element with the enhanced widget configuration for location-only search
          const script = document.createElement('script');
          script.innerHTML = `
            document.currentScript.replaceWith(ihfKestrel.render({
              "component": "quickSearchWidget",
              "style": "horizontal",
              "propertyType": false,
              "searchType": "location",
              "fields": ["location"],
              "hideFilters": true,
              "placeholder": "Enter city, neighborhood, or zip code",
              "autoComplete": true,
              "showAdvancedSearch": false
            }));
          `;
          
          containerRef.current.appendChild(script);
          
          // Enhanced styling to hide non-location elements and optimize for location search
          const style = document.createElement('style');
          style.textContent = `
            .ihf-quick-search-widget {
              background: white !important;
              border-radius: 1rem !important;
              box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1) !important;
              border: 1px solid rgb(229 231 235) !important;
              padding: 1rem !important;
              transition: all 0.3s ease !important;
            }
            .ihf-quick-search-widget:hover {
              box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1) !important;
            }
            .ihf-quick-search-widget input {
              border: none !important;
              outline: none !important;
              font-size: 1rem !important;
              padding: 0.75rem 1rem !important;
              background: transparent !important;
            }
            .ihf-quick-search-widget input::placeholder {
              color: rgb(107 114 128) !important;
            }
            .ihf-quick-search-widget button {
              background: rgb(17 24 39) !important;
              color: white !important;
              border: none !important;
              border-radius: 0.75rem !important;
              padding: 0.75rem 1.5rem !important;
              font-weight: 500 !important;
              transition: all 0.3s ease !important;
              cursor: pointer !important;
            }
            .ihf-quick-search-widget button:hover {
              background: rgb(0 0 0) !important;
              transform: scale(1.02) !important;
            }
            /* Hide any non-location search elements */
            .ihf-quick-search-widget select,
            .ihf-quick-search-widget .property-type,
            .ihf-quick-search-widget .price-range,
            .ihf-quick-search-widget .beds-baths,
            .ihf-quick-search-widget .advanced-filters,
            .ihf-quick-search-widget .filter-dropdown {
              display: none !important;
            }
            /* Ensure location input takes full available space */
            .ihf-quick-search-widget .location-input,
            .ihf-quick-search-widget input[type="text"] {
              flex: 1 !important;
              min-width: 200px !important;
            }
            @media (max-width: 640px) {
              .ihf-quick-search-widget {
                padding: 0.75rem !important;
              }
              .ihf-quick-search-widget input {
                width: 100% !important;
                margin-bottom: 0.5rem !important;
              }
              .ihf-quick-search-widget button {
                width: 100% !important;
              }
            }
          `;
          document.head.appendChild(style);
          
          console.log('IDX Quick Search Widget initialized successfully with location-only search');
          
          // Set up search event listener
          const handleSearch = () => {
            console.log('IDX location search initiated, navigating to listings...');
            navigate('/listings');
            onSearch?.();
          };

          // Listen for form submissions or button clicks
          setTimeout(() => {
            const searchForm = containerRef.current?.querySelector('form');
            const searchButton = containerRef.current?.querySelector('button');
            
            if (searchForm) {
              searchForm.addEventListener('submit', handleSearch);
            }
            if (searchButton) {
              searchButton.addEventListener('click', handleSearch);
            }
          }, 500);
          
        } catch (error) {
          console.error('Error initializing IDX Quick Search Widget:', error);
          if (containerRef.current) {
            containerRef.current.innerHTML = '<div class="flex items-center justify-center h-16 text-red-600 bg-red-50 rounded-xl border border-red-200"><p>Search widget failed to load</p></div>';
          }
        }
      }
    };

    // Check if ihfKestrel is already available
    if (window.ihfKestrel) {
      initializeWidget();
    } else {
      // Poll for ihfKestrel availability
      const interval = setInterval(() => {
        if (window.ihfKestrel && containerRef.current) {
          clearInterval(interval);
          initializeWidget();
        }
      }, 100);

      // Cleanup after 10 seconds
      setTimeout(() => {
        clearInterval(interval);
        if (!window.ihfKestrel && containerRef.current) {
          containerRef.current.innerHTML = '<div class="flex items-center justify-center h-16 text-yellow-600 bg-yellow-50 rounded-xl border border-yellow-200"><p>Search widget is loading...</p></div>';
        }
      }, 10000);
    }
  }, [navigate, onSearch]);

  return (
    <div className={`w-full max-w-2xl mx-auto ${className}`}>
      <div 
        ref={containerRef}
        className="min-h-[60px] flex items-center justify-center"
      >
        <div className="flex items-center justify-center h-16 text-gray-500">
          Loading location search...
        </div>
      </div>
    </div>
  );
};

export default IDXSearchWidget;
