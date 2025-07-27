import { useState } from 'react';
import { Heart, Calendar, MessageSquare } from 'lucide-react';
import { useSimpleIDXIntegration } from '../hooks/useSimpleIDXIntegration';
import { useAuth } from '../contexts/AuthContext';
import ImprovedOfferModal from './offer-workflow/ImprovedOfferModal';

export default function SimplePropertyToolbar() {
  const { propertyData, isLoading, favoriteProperty, scheduleShowingForProperty } = useSimpleIDXIntegration();
  const { user } = useAuth();
  const [isFavorited, setIsFavorited] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);

  const handleFavorite = async () => {
    if (!propertyData || !user) return;

    try {
      await favoriteProperty(propertyData, user.id);
      setIsFavorited(true);
    } catch (error) {
      console.error('Failed to favorite property:', error);
    }
  };

  const handleScheduleTour = () => {
    if (!propertyData) return;
    
    const listingId = propertyData.mlsId;
    window.location.href = `/schedule-tour?listing=${listingId}`;
  };

  const handleMakeOffer = () => {
    if (!propertyData) return;
    setShowOfferModal(true);
  };

  // Don't render if no property data
  if (!propertyData) {
    return null;
  }

  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900">
              {propertyData.address}
            </h2>
            <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
              {propertyData.price && (
                <span className="font-medium text-green-600">
                  ${parseFloat(propertyData.price.replace(/[^0-9.]/g, '')).toLocaleString()}
                </span>
              )}
              {propertyData.beds && <span>{propertyData.beds} beds</span>}
              {propertyData.baths && <span>{propertyData.baths} baths</span>}
              {propertyData.sqft && <span>{propertyData.sqft} sqft</span>}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {user && (
              <button
                onClick={handleFavorite}
                disabled={isLoading || isFavorited}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  isFavorited
                    ? 'bg-red-50 text-red-600 border border-red-200'
                    : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                <Heart className={`h-4 w-4 ${isFavorited ? 'fill-current' : ''}`} />
                {isFavorited ? 'Favorited' : 'Favorite'}
              </button>
            )}
            
            <button
              onClick={handleScheduleTour}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Calendar className="h-4 w-4" />
              Schedule Tour
            </button>
            
            <button
              onClick={handleMakeOffer}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <MessageSquare className="h-4 w-4" />
              Make Offer
            </button>
          </div>
        </div>
      </div>
      
      {/* Improved Offer Modal */}
      <ImprovedOfferModal
        isOpen={showOfferModal}
        onClose={() => setShowOfferModal(false)}
        propertyAddress={propertyData?.address || ''}
        buyerId={user?.id || ''}
      />
    </div>
  );
}