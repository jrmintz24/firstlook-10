
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
          console.log('Initializing IDX Quick Search Widget with location-only configuration...');
          
          // Clear the container first
          containerRef.current.innerHTML = '';
          
          // Create persistent style element first
          const persistentStyle = document.createElement('style');
          persistentStyle.id = 'idx-location-only-styles';
          persistentStyle.textContent = `
            /* Core widget styling */
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
            
            /* Aggressively hide ALL non-location elements */
            .ihf-quick-search-widget select,
            .ihf-quick-search-widget .property-type,
            .ihf-quick-search-widget .price-range,
            .ihf-quick-search-widget .beds-baths,
            .ihf-quick-search-widget .advanced-filters,
            .ihf-quick-search-widget .filter-dropdown,
            .ihf-quick-search-widget .ihf-price-field,
            .ihf-quick-search-widget .ihf-beds-field,
            .ihf-quick-search-widget .ihf-baths-field,
            .ihf-quick-search-widget .ihf-property-type-field,
            .ihf-quick-search-widget .ihf-min-price,
            .ihf-quick-search-widget .ihf-max-price,
            .ihf-quick-search-widget .ihf-bedrooms,
            .ihf-quick-search-widget .ihf-bathrooms,
            .ihf-quick-search-widget [class*="price"],
            .ihf-quick-search-widget [class*="bed"],
            .ihf-quick-search-widget [class*="bath"],
            .ihf-quick-search-widget [class*="type"],
            .ihf-quick-search-widget [class*="filter"]:not([class*="location"]) {
              display: none !important;
              visibility: hidden !important;
              opacity: 0 !important;
              height: 0 !important;
              width: 0 !important;
              overflow: hidden !important;
            }
            
            /* Ensure location input takes full space */
            .ihf-quick-search-widget .location-input,
            .ihf-quick-search-widget input[type="text"],
            .ihf-quick-search-widget .ihf-location-field,
            .ihf-quick-search-widget [class*="location"] input {
              flex: 1 !important;
              min-width: 200px !important;
              width: 100% !important;
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
          
          // Remove existing style if present and add new one
          const existingStyle = document.getElementById('idx-location-only-styles');
          if (existingStyle) {
            existingStyle.remove();
          }
          document.head.appendChild(persistentStyle);
          
          // Create script element with location-only configuration
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
              "showAdvancedSearch": false,
              "enableFilters": false,
              "showPropertyType": false,
              "showPriceRange": false,
              "showBedsBaths": false
            }));
          `;
          
          containerRef.current.appendChild(script);
          
          console.log('IDX Quick Search Widget initialized with location-only search');
          
          // Set up mutation observer to maintain location-only configuration
          const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
              if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // Reapply our hiding styles when new elements are added
                setTimeout(() => {
                  const widget = containerRef.current?.querySelector('.ihf-quick-search-widget');
                  if (widget) {
                    // Hide any newly added non-location elements
                    const elementsToHide = widget.querySelectorAll('select, .property-type, .price-range, .beds-baths, .advanced-filters, .filter-dropdown, [class*="price"], [class*="bed"], [class*="bath"], [class*="type"]:not([class*="location"])');
                    elementsToHide.forEach(el => {
                      (el as HTMLElement).style.display = 'none';
                      (el as HTMLElement).style.visibility = 'hidden';
                      (el as HTMLElement).style.opacity = '0';
                    });
                    
                    // Ensure location input is visible and styled
                    const locationInputs = widget.querySelectorAll('input[type="text"], .location-input, [class*="location"] input');
                    locationInputs.forEach(input => {
                      (input as HTMLElement).style.display = 'block';
                      (input as HTMLElement).style.visibility = 'visible';
                      (input as HTMLElement).style.opacity = '1';
                    });
                  }
                }, 100);
              }
            });
          });
          
          // Start observing the container
          if (containerRef.current) {
            observer.observe(containerRef.current, {
              childList: true,
              subtree: true
            });
          }
          
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
          
          // Cleanup function to disconnect observer
          return () => {
            observer.disconnect();
          };
          
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
      const cleanup = initializeWidget();
      return cleanup;
    } else {
      // Poll for ihfKestrel availability
      const interval = setInterval(() => {
        if (window.ihfKestrel && containerRef.current) {
          clearInterval(interval);
          const cleanup = initializeWidget();
          return cleanup;
        }
      }, 100);

      // Cleanup after 10 seconds
      setTimeout(() => {
        clearInterval(interval);
        if (!window.ihfKestrel && containerRef.current) {
          containerRef.current.innerHTML = '<div class="flex items-center justify-center h-16 text-yellow-600 bg-yellow-50 rounded-xl border border-yellow-200"><p>Search widget is loading...</p></div>';
        }
      }, 10000);

      return () => clearInterval(interval);
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
