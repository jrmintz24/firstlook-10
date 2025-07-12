import { useEffect, useState } from 'react';
import { useIDXIntegration } from '@/hooks/useIDXIntegration';
import ModernTourSchedulingModal from './ModernTourSchedulingModal';

interface PropertyData {
  address: string;
  price?: string;
  beds?: string;
  baths?: string;
  mlsId?: string;
}

export const IDXButtonOverride = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<PropertyData | null>(null);
  const { initializeObserver, cleanup } = useIDXIntegration();

  const handleScheduleTour = (propertyData: PropertyData) => {
    setSelectedProperty(propertyData);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedProperty(null);
  };

  useEffect(() => {
    // Wait for IDX widget to load before initializing
    const checkForIDX = () => {
      const container = document.getElementById('ihf-container');
      if (container && window.ihfKestrel) {
        initializeObserver(handleScheduleTour);
      } else {
        setTimeout(checkForIDX, 1000);
      }
    };

    checkForIDX();

    return () => {
      cleanup();
    };
  }, [initializeObserver, cleanup]);

  return (
    <>
      <style>
        {`
          /* Hide original IDX buttons */
          #ihf-container button[title*="tour" i],
          #ihf-container button[title*="schedule" i],
          #ihf-container a[title*="tour" i],
          #ihf-container a[title*="schedule" i],
          #ihf-container .schedule-tour,
          #ihf-container .contact-agent,
          #ihf-container .tour-button {
            display: none !important;
          }
          
          /* Ensure custom buttons are visible */
          #ihf-container .custom-tour-button {
            display: block !important;
            position: relative !important;
          }
        `}
      </style>
      
      <ModernTourSchedulingModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={async () => {
          // Handle success if needed
          console.log('Tour scheduled successfully for:', selectedProperty?.address);
        }}
      />
    </>
  );
};