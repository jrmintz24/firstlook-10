
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
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-light text-gray-900 mb-2">
              Find Your Perfect Home
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Search through thousands of properties with advanced filtering options 
              and detailed listings to find the home that's right for you.
            </p>
          </div>
        </div>
      </div>

      {/* IDX Search Widget Container */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div 
            id="idx-container"
            className="w-full min-h-96"
          >
            {/* IDX content will be rendered here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Listings;
