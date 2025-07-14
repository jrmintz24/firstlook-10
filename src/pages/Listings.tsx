
import React, { useEffect } from 'react';
import { useDocumentHead } from '../hooks/useDocumentHead';

const Listings = () => {
  // Set document head with static title as specified
  useDocumentHead({
    title: 'Property Search - Home Finder Platform',
    description: 'Search and browse available properties with advanced filtering options and detailed listings.',
  });

  useEffect(() => {
    // Execute the IDX embed code when component mounts
    if (window.ihfKestrel) {
      const container = document.getElementById('idx-container');
      if (container) {
        // Clear any existing content
        container.innerHTML = '';
        // Create and execute the embed script
        const renderedElement = window.ihfKestrel.render();
        container.appendChild(renderedElement);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div 
        id="idx-container"
        className="w-full h-full"
      >
        {/* IDX content will be rendered here */}
      </div>
    </div>
  );
};

export default Listings;
