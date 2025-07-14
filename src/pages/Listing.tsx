
import React, { useEffect, useState } from 'react';
import { useDocumentHead } from '../hooks/useDocumentHead';
import { PropertyActionHeader } from '../components/property/PropertyActionHeader';
import { PropertyActionManager } from '../components/property/PropertyActionManager';
import { extractPropertyDataFromPage, PropertyData } from '../utils/propertyDataUtils';

const Listing = () => {
  const [listingAddress, setListingAddress] = useState('Property Listing');
  const [propertyData, setPropertyData] = useState<PropertyData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<'tour' | 'offer' | 'favorite' | null>(null);

  // Set document head with dynamic title
  useDocumentHead({
    title: listingAddress,
    description: 'View detailed information about this property listing including photos, amenities, and neighborhood details.',
  });

  const extractListingAddress = () => {
    // Try to extract property address from IDX content after it loads
    const checkForAddress = () => {
      const data = extractPropertyDataFromPage();
      if (data.address && data.address !== 'Property Listing') {
        setListingAddress(data.address);
        setPropertyData(data);
        return true;
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

  const handleScheduleTour = () => {
    const data = extractPropertyDataFromPage();
    setPropertyData(data);
    setModalAction('tour');
    setIsModalOpen(true);
  };

  const handleMakeOffer = () => {
    const data = extractPropertyDataFromPage();
    setPropertyData(data);
    setModalAction('offer');
    setIsModalOpen(true);
  };

  const handleFavorite = () => {
    const data = extractPropertyDataFromPage();
    setPropertyData(data);
    setModalAction('favorite');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalAction(null);
  };

  return (
    <div className="w-full h-screen relative">
      {/* Custom Property Action Header */}
      <PropertyActionHeader
        property={propertyData}
        onScheduleTour={handleScheduleTour}
        onMakeOffer={handleMakeOffer}
        onFavorite={handleFavorite}
        className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md"
      />

      {/* IDX content will be rendered here by the embed script */}
      <div className="pt-20">
        {/* Content space for the header */}
      </div>

      {/* Property Action Manager for modals */}
      <PropertyActionManager
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        actionType={modalAction}
        property={propertyData}
      />
    </div>
  );
};

export default Listing;
