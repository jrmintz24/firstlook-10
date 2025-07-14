
import React, { useEffect, useRef } from 'react';

interface IDXSearchWidgetProps {
  onSearch?: () => void;
  className?: string;
}

const IDXSearchWidget = ({ className = "" }: IDXSearchWidgetProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initializeWidget = () => {
      if (containerRef.current && window.ihfKestrel) {
        try {
          console.log('Initializing IDX Quick Search Widget...');
          
          // Clear the container first
          containerRef.current.innerHTML = '';
          
          // Create script element with minimal widget configuration
          const script = document.createElement('script');
          script.innerHTML = `
            document.currentScript.replaceWith(ihfKestrel.render({
              "component": "quickSearchWidget"
            }));
          `;
          
          containerRef.current.appendChild(script);
          
          console.log('IDX Quick Search Widget initialized successfully');
          
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
  }, []);

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
