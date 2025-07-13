
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
          
          // Create script element with the updated widget configuration
          const script = document.createElement('script');
          script.innerHTML = `
            document.currentScript.replaceWith(ihfKestrel.render({
              "component": "quickSearchWidget",
              "style": "twoline",
              "propertyType": true
            }));
          `;
          
          containerRef.current.appendChild(script);
          
          // Add custom styling to match our design
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
            .ihf-quick-search-widget select {
              border: none !important;
              outline: none !important;
              font-size: 1rem !important;
              padding: 0.75rem 1rem !important;
              background: transparent !important;
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
            @media (max-width: 640px) {
              .ihf-quick-search-widget {
                padding: 0.75rem !important;
              }
              .ihf-quick-search-widget input,
              .ihf-quick-search-widget select {
                width: 100% !important;
                margin-bottom: 0.5rem !important;
              }
              .ihf-quick-search-widget button {
                width: 100% !important;
              }
            }
          `;
          document.head.appendChild(style);
          
          console.log('IDX Quick Search Widget initialized successfully with twoline style');
          
          // Set up search event listener
          const handleSearch = () => {
            console.log('IDX search initiated, navigating to listings...');
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
          Loading search widget...
        </div>
      </div>
    </div>
  );
};

export default IDXSearchWidget;
