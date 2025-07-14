
import React, { useEffect } from 'react';
import { useDocumentHead } from '../hooks/useDocumentHead';

const Listings = () => {
  // Set document head with static title as specified
  useDocumentHead({
    title: 'Property Search',
    description: 'Search and browse available properties with advanced filtering options and detailed listings.',
  });

  useEffect(() => {
    // Execute the IDX embed code when component mounts
    if (window.ihfKestrel) {
      // Create and execute the embed script exactly as instructed
      const script = document.createElement('script');
      script.textContent = 'document.currentScript.replaceWith(ihfKestrel.render());';
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className="w-full h-screen">
      {/* IDX content will be rendered here by the embed script */}
    </div>
  );
};

export default Listings;
