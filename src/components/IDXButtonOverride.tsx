import { useEffect, useState } from 'react';
import ModernTourSchedulingModal from './ModernTourSchedulingModal';
import { PropertyData, IDX_SCHEDULE_TOUR_EVENT, IDX_CUSTOM_CSS, IDX_CUSTOM_JS } from '@/utils/idxCommunication';

export const IDXButtonOverride = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<PropertyData | null>(null);

  const handleScheduleTour = (propertyData: PropertyData) => {
    setSelectedProperty(propertyData);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedProperty(null);
  };

  useEffect(() => {
    // Listen for events from IDX widget
    const handleIDXTourRequest = (event: CustomEvent<PropertyData>) => {
      console.log('Received tour request from IDX:', event.detail);
      handleScheduleTour(event.detail);
    };

    window.addEventListener(IDX_SCHEDULE_TOUR_EVENT, handleIDXTourRequest as EventListener);

    return () => {
      window.removeEventListener(IDX_SCHEDULE_TOUR_EVENT, handleIDXTourRequest as EventListener);
    };
  }, []);

  return (
    <>
      <div className="idx-integration-info bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <h3 className="font-semibold text-blue-900 mb-2">IDX Custom Code Setup Required</h3>
        <p className="text-blue-700 text-sm mb-3">
          To enable custom tour scheduling buttons in your IDX widget, add the following code to your IDX configuration:
        </p>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-blue-900 mb-1">1. Add to IDX Stylesheet:</h4>
            <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
              <code>{IDX_CUSTOM_CSS}</code>
            </pre>
          </div>
          
          <div>
            <h4 className="font-medium text-blue-900 mb-1">2. Add to IDX Content JavaScript:</h4>
            <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
              <code>{IDX_CUSTOM_JS}</code>
            </pre>
          </div>
        </div>
        
        <p className="text-blue-600 text-xs mt-3">
          Once added, custom "Schedule Tour" buttons will automatically appear and open the modal with property data.
        </p>
      </div>
      
      <ModernTourSchedulingModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={async () => {
          console.log('Tour scheduled successfully for:', selectedProperty?.address);
        }}
      />
    </>
  );
};