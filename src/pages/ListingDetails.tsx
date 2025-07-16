
import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useDocumentHead } from '../hooks/useDocumentHead';
import { PropertyToolbar } from '../components/property/PropertyToolbar';

const ListingDetails = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { listingId } = useParams<{ listingId: string }>();

  // Set document head with dynamic title
  useDocumentHead({
    title: listingId ? `Listing ${listingId} - Home Finder Platform` : 'Property Listing - Home Finder Platform',
    description: 'View detailed information about this property listing including photos, amenities, and neighborhood details.',
  });

  useEffect(() => {
    console.log('[ListingDetails] Starting IDX render for listing:', listingId);

    if (listingId && containerRef.current && window.ihfKestrel) {
      // Clear existing content
      containerRef.current.innerHTML = '';
      
      // Render IDX content
      const renderedElement = window.ihfKestrel.render();
      if (renderedElement) {
        containerRef.current.appendChild(renderedElement);
        console.log('[ListingDetails] IDX content successfully rendered');
      } else {
        console.error('[ListingDetails] IDX render returned null/undefined');
      }
    }
  }, [listingId]);

  return (
    <div className="min-h-screen bg-background">
      {/* Property Toolbar */}
      <PropertyToolbar />
      
      {/* IDX Content */}
      <div ref={containerRef} className="w-full min-h-screen pt-32">
        {/* IDX listing content will be rendered here */}
      </div>
    </div>
  );
};

export default ListingDetails;
