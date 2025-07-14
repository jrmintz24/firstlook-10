
import React, { useEffect, useState } from 'react';
import { useDocumentHead } from '../hooks/useDocumentHead';

const Listing = () => {
  const [listingAddress, setListingAddress] = useState('Property Listing');

  // Set document head with dynamic title
  useDocumentHead({
    title: listingAddress,
    description: 'View detailed information about this property listing including photos, amenities, and neighborhood details.',
  });

  const extractListingAddress = () => {
    // Try to extract property address from IDX content after it loads
    const checkForAddress = () => {
      const addressSelectors = [
        '[data-address]',
        '.address',
        '.property-address',
        '.listing-address',
        'h1',
        '.property-title'
      ];
      
      for (const selector of addressSelectors) {
        const element = document.querySelector(selector);
        if (element && element.textContent?.trim()) {
          const address = element.textContent.trim();
          if (address && address !== 'Property Listing') {
            setListingAddress(address);
            return true;
          }
        }
      }
      return false;
    };

    // Try immediately and then with delays
    if (!checkForAddress()) {
      setTimeout(() => {
        if (!checkForAddress()) {
          setTimeout(checkForAddress, 2000);
        }
      }, 1000);
    }
  };

  useEffect(() => {
    // Execute the IDX embed code when component mounts
    if (window.ihfKestrel) {
      // Create and execute the embed script exactly as instructed
      const script = document.createElement('script');
      script.textContent = 'document.currentScript.replaceWith(ihfKestrel.render());';
      document.body.appendChild(script);
      
      // Extract address for title after IDX loads
      setTimeout(extractListingAddress, 500);
    }
  }, []);

  return (
    <div className="w-full h-screen">
      {/* IDX content will be rendered here by the embed script */}
    </div>
  );
};

export default Listing;
