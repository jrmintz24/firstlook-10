
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
        // Clear any existing content
        container.innerHTML = '';
        
        // Create render options - include search term if available
        const renderOptions: any = {};
        if (searchTerm) {
          renderOptions.searchCriteria = {
            searchText: searchTerm
          };
        }
        
        // Create and execute the embed script
        const renderedElement = window.ihfKestrel.render(renderOptions);
        container.appendChild(renderedElement);

        // Add click event listener to intercept IDX links
        const handleLinkClick = (event: Event) => {
          const target = event.target as HTMLElement;
          const link = target.closest('a');
          
          if (link && link.href) {
            // Check if this is an IDX property detail link
            const url = new URL(link.href);
            const pathname = url.pathname;
            
            // Common IDX URL patterns for property details
            const isPropertyLink = 
              pathname.includes('/listing/') ||
              pathname.includes('/property/') ||
              pathname.includes('/details/') ||
              url.searchParams.has('listingId') ||
              url.searchParams.has('propertyId') ||
              url.searchParams.has('mlsId');

            if (isPropertyLink) {
              event.preventDefault();
              event.stopPropagation();
              
              // Extract property ID from various possible URL formats
              let propertyId = '';
              
              // Try to extract from pathname
              const pathParts = pathname.split('/');
              const listingIndex = pathParts.findIndex(part => 
                part === 'listing' || part === 'property' || part === 'details'
              );
              
              if (listingIndex !== -1 && pathParts[listingIndex + 1]) {
                propertyId = pathParts[listingIndex + 1];
              }
              
              // Try to extract from search params if not found in path
              if (!propertyId) {
                propertyId = url.searchParams.get('listingId') ||
                           url.searchParams.get('propertyId') ||
                           url.searchParams.get('mlsId') ||
                           '';
              }
              
              // Navigate to our listing detail page
              if (propertyId) {
                navigate(`/listing/${propertyId}`);
              } else {
                // Fallback: extract any numeric ID from the URL
                const numericMatch = link.href.match(/\d+/);
                if (numericMatch) {
                  navigate(`/listing/${numericMatch[0]}`);
                }
              }
            }
          }
        };

        // Add event listener to the container using event delegation
        container.addEventListener('click', handleLinkClick, true);

        // Cleanup function
        return () => {
          container.removeEventListener('click', handleLinkClick, true);
        };
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
