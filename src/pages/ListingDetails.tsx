
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
      
      // Create a script element with the embed code
      const script = document.createElement('script');
      script.textContent = 'document.currentScript.replaceWith(ihfKestrel.render());';
      
      // Append the script to the container
      containerRef.current.appendChild(script);
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
