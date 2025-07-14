
import React from 'react';
import { useDocumentHead } from '../hooks/useDocumentHead';

const Listings = () => {
  // Set document head with static title as specified
  useDocumentHead({
    title: 'Property Search - Home Finder Platform',
    description: 'Search and browse available properties with advanced filtering options and detailed listings.',
  });

  return (
    <div className="min-h-screen bg-white">
      <div 
        className="w-full h-full"
        dangerouslySetInnerHTML={{
          __html: `<script>document.currentScript.replaceWith(ihfKestrel.render());</script>`
        }}
      />
    </div>
  );
};

export default Listings;
