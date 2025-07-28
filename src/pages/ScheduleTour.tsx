import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ModernTourSchedulingModal from '@/components/ModernTourSchedulingModal';
import { useSimpleIDXIntegration } from '@/hooks/useSimpleIDXIntegration';
import { useAutomaticPropertySaver } from '@/hooks/useAutomaticPropertySaver';

const ScheduleTour = () => {
  const [searchParams] = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(true);
  const { propertyData } = useSimpleIDXIntegration();
  
  // Enable automatic property saving when property data is available
  useAutomaticPropertySaver();
  
  // Get listing ID from URL params
  const listingId = searchParams.get('listing');
  
  // Initial address from URL or property data
  const initialAddress = propertyData?.address || '';
  
  const handleClose = () => {
    setIsModalOpen(false);
    // Navigate back to previous page or IDX
    window.history.back();
  };

  const handleSuccess = () => {
    setIsModalOpen(false);
    // Navigate to dashboard or confirmation page
    window.location.href = '/buyer-dashboard';
  };

  useEffect(() => {
    // If we have a listing ID but no property data, log for debugging
    if (listingId && !propertyData) {
      console.log('[Schedule Tour] Listing ID provided but no property data available:', listingId);
    }
  }, [listingId, propertyData]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={handleClose}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Schedule a Tour
            </h1>
            <p className="text-gray-600">
              {initialAddress || 'Schedule a tour for your selected property'}
            </p>
          </div>

          {isModalOpen && (
            <ModernTourSchedulingModal
              isOpen={isModalOpen}
              onClose={handleClose}
              onSuccess={async () => handleSuccess()}
              initialAddress={initialAddress}
              propertyId={listingId}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ScheduleTour;