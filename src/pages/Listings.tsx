
import React, { useEffect, useRef } from 'react';
import { useDocumentHead } from '../hooks/useDocumentHead';

const Listings = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Set document head with static title as specified
  useDocumentHead({
    title: 'Property Search - Home Finder Platform',
    description: 'Search and browse available properties with advanced filtering options and detailed listings.',
  });

  useEffect(() => {
    // Ensure the IDX script is loaded before rendering
    if (window.ihfKestrel && containerRef.current) {
      // Clear any existing content
      containerRef.current.innerHTML = '';
      
      // Create a script element with the embed code
      const script = document.createElement('script');
      script.textContent = 'document.currentScript.replaceWith(ihfKestrel.render());';
      
      // Append the script to the container
      containerRef.current.appendChild(script);
    }
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div ref={containerRef} className="w-full h-full">
        {/* IDX search content will be rendered here */}
      </div>
    </div>
  );
};

export default Listings;
