
import React, { useEffect, useState } from 'react';
import SimplePropertyToolbar from '../components/SimplePropertyToolbar';
import { useAutomaticPropertySaver } from '../hooks/useAutomaticPropertySaver';
import EnhancedPropertyDisplay from '../components/property/EnhancedPropertyDisplay';

const Idx = () => {
  // Enable automatic property saving when users visit IDX pages
  useAutomaticPropertySaver();
  const [propertyData, setPropertyData] = useState<any>(null);

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
    
    // Listen for property data extraction
    const handlePropertyExtracted = (event: CustomEvent) => {
      console.log('[Idx] Property data extracted:', event.detail);
      setPropertyData(event.detail);
    };
    
    window.addEventListener('listingDetailsExtracted', handlePropertyExtracted);
    
    return () => {
      window.removeEventListener('listingDetailsExtracted', handlePropertyExtracted);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <SimplePropertyToolbar />
      <div 
        id="idx-container"
        className="w-full h-full"
      >
        {/* IDX content will be rendered here */}
      </div>
      
      {/* Enhanced Property Display - only show on property detail pages */}
      {propertyData?.address && (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl mt-8 pb-8">
          <EnhancedPropertyDisplay
            address={propertyData.address}
            mlsId={propertyData.listingId}
            showInsightForm={true}
          />
        </div>
      )}
    </div>
  );
};

export default Idx;
