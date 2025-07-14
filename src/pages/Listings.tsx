
import React, { useEffect, useState } from 'react';
import { useDocumentHead } from '../hooks/useDocumentHead';
import PropertyActionHeader from '../components/property/PropertyActionHeader';
import PropertyActionManager from '../components/property/PropertyActionManager';
import { extractPropertyDataFromPage, PropertyData } from '../utils/propertyDataUtils';

const Listings = () => {
  const [propertyData, setPropertyData] = useState<PropertyData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<'tour' | 'offer' | 'favorite' | null>(null);

  // Set document head with static title as specified
  useDocumentHead({
    title: 'Property Search',
    description: 'Search and browse available properties with advanced filtering options and detailed listings.',
  });

  useEffect(() => {
    // Execute the IDX embed code when component mounts
    if (window.ihfKestrel) {
      // Create and execute the embed script with inline configuration
      const script = document.createElement('script');
      script.textContent = `
        try {
          const element = ihfKestrel.render({
            modalMode: false,
            popupMode: false,
            inlineMode: true
          });
          
          if (element) {
            element.style.position = 'static';
            element.style.zIndex = 'auto';
          }
          
          document.currentScript.replaceWith(element);
        } catch (e) {
          document.currentScript.replaceWith(ihfKestrel.render());
        }
      `;
      document.body.appendChild(script);
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

export default Listings;
