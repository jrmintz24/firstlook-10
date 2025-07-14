
import React, { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDocumentHead } from '../hooks/useDocumentHead';

const Listings = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('search');

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
        try {
          // Clear any existing content
          container.innerHTML = '';
          
          // Create and execute the embed script
          const renderedElement = window.ihfKestrel.render();
          if (renderedElement) {
            container.appendChild(renderedElement);
          }

          // Simple click event listener for link interception
          const handleClick = (event: Event) => {
            const target = event.target as HTMLElement;
            const link = target.closest('a');
            
            if (link && link.href) {
              const url = new URL(link.href);
              
              // Check if this looks like a property detail link
              if (url.pathname.includes('/listing/') || 
                  url.pathname.includes('/property/') || 
                  url.searchParams.has('listingId') ||
                  url.searchParams.has('propertyId')) {
                
                event.preventDefault();
                event.stopPropagation();
                
                // Extract property ID
                let propertyId = '';
                const pathParts = url.pathname.split('/');
                const listingIndex = pathParts.findIndex(part => 
                  part === 'listing' || part === 'property'
                );
                
                if (listingIndex !== -1 && pathParts[listingIndex + 1]) {
                  propertyId = pathParts[listingIndex + 1];
                } else {
                  propertyId = url.searchParams.get('listingId') ||
                             url.searchParams.get('propertyId') ||
                             url.searchParams.get('id') || '';
                }
                
                if (propertyId) {
                  navigate(`/listing?id=${propertyId}`);
                }
              }
            }
          };

          // Add click listener
          container.addEventListener('click', handleClick, true);
          
          // Cleanup function
          return () => {
            container.removeEventListener('click', handleClick, true);
          };
        } catch (error) {
          console.error('Error setting up IDX widget:', error);
        }
      }
    }
  }, [navigate, searchTerm]);

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
              {searchTerm 
                ? `Searching for properties: "${searchTerm}"`
                : 'Search through thousands of properties with advanced filtering options and detailed listings to find the home that\'s right for you.'
              }
            </p>
          </div>
        </div>
      </div>

      {/* IDX Search Widget Container */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div 
            id="idx-container"
            ref={containerRef}
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
