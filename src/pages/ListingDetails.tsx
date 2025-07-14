
import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useDocumentHead } from '../hooks/useDocumentHead';
import PropertyActionHeader from '../components/property/PropertyActionHeader';

const ListingDetails = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { listingId } = useParams<{ listingId: string }>();

  // Set document head with dynamic title
  useDocumentHead({
    title: listingId ? `Listing ${listingId} - Home Finder Platform` : 'Property Listing - Home Finder Platform',
    description: 'View detailed information about this property listing including photos, amenities, and neighborhood details.',
  });

  useEffect(() => {
    // Ensure the IDX script is loaded before rendering
    if (window.ihfKestrel && containerRef.current) {
      // Clear any existing content
      containerRef.current.innerHTML = '';
      
      try {
        // Create a script element with the embed code
        const script = document.createElement('script');
        
        // If we have a listing ID, try to render the specific listing
        if (listingId) {
          // Try to configure IDX to show specific listing if possible
          script.textContent = `
            try {
              const element = ihfKestrel.render({
                listingId: '${listingId}',
                view: 'detail'
              });
              if (element) {
                document.currentScript.replaceWith(element);
              } else {
                // Fallback to standard render
                document.currentScript.replaceWith(ihfKestrel.render());
              }
            } catch (e) {
              // Fallback to standard render if specific listing render fails
              document.currentScript.replaceWith(ihfKestrel.render());
            }
          `;
        } else {
          // Standard render without specific listing
          script.textContent = 'document.currentScript.replaceWith(ihfKestrel.render());';
        }
        
        // Append the script to the container
        containerRef.current.appendChild(script);
      } catch (error) {
        console.error('Error rendering IDX content:', error);
        // Fallback: show a message if IDX fails to load
        if (containerRef.current) {
          containerRef.current.innerHTML = `
            <div class="flex items-center justify-center h-96 text-gray-500">
              <div class="text-center">
                <p class="text-lg mb-2">Loading property details...</p>
                <p class="text-sm">If this takes too long, please try refreshing the page.</p>
              </div>
            </div>
          `;
        }
      }
    }
  }, [listingId]);

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Property Action Header */}
      <PropertyActionHeader />
      
      {/* IDX Content */}
      <div ref={containerRef} className="w-full h-full">
        {/* IDX listing content will be rendered here */}
      </div>
    </div>
  );
};

export default ListingDetails;
