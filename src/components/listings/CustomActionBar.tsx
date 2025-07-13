
import React, { useEffect, useState } from 'react';
import { Calendar, DollarSign, Heart } from 'lucide-react';
import { extractPropertyData, PropertyData } from '@/utils/idxCommunication';

interface CustomActionBarProps {
  onScheduleTour: (propertyData: PropertyData) => void;
  onMakeOffer: (propertyData: PropertyData) => void;
  onFavorite: (propertyData: PropertyData) => void;
}

const CustomActionBar: React.FC<CustomActionBarProps> = ({
  onScheduleTour,
  onMakeOffer,
  onFavorite
}) => {
  const [propertyData, setPropertyData] = useState<PropertyData | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 20;
    
    const extractData = () => {
      retryCount++;
      console.log(`CustomActionBar: Attempting to extract property data (attempt ${retryCount})`);
      
      const data = extractPropertyData();
      
      // Check if we have meaningful property data
      if (data.address && data.address.length > 10) {
        setPropertyData(data);
        setIsVisible(true);
        console.log('CustomActionBar: Property data extracted successfully:', data);
        return;
      }
      
      if (retryCount < maxRetries) {
        setTimeout(extractData, 1000);
      } else {
        console.log('CustomActionBar: Max retries reached, showing basic action bar');
        // Show action bar even without full data
        setPropertyData({
          address: 'Property Address',
          price: '',
          beds: '',
          baths: '',
          mlsId: ''
        });
        setIsVisible(true);
      }
    };

    // Start extraction after a short delay to let IDX load
    setTimeout(extractData, 2000);
    
    // Also watch for DOM changes
    const observer = new MutationObserver(() => {
      if (!propertyData || !propertyData.address || propertyData.address === 'Property Address') {
        extractData();
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    return () => observer.disconnect();
  }, [propertyData]);

  const handleScheduleTour = () => {
    const currentData = propertyData || {
      address: 'Current Property',
      price: '',
      beds: '',
      baths: '',
      mlsId: ''
    };
    console.log('CustomActionBar: Schedule Tour clicked with data:', currentData);
    onScheduleTour(currentData);
  };

  const handleMakeOffer = () => {
    const currentData = propertyData || {
      address: 'Current Property',
      price: '',
      beds: '',
      baths: '',
      mlsId: ''
    };
    console.log('CustomActionBar: Make Offer clicked with data:', currentData);
    onMakeOffer(currentData);
  };

  const handleFavorite = () => {
    const currentData = propertyData || {
      address: 'Current Property',
      price: '',
      beds: '',
      baths: '',
      mlsId: ''
    };
    console.log('CustomActionBar: Favorite clicked with data:', currentData);
    onFavorite(currentData);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-lg px-6 py-4">
        <div className="flex items-center gap-1 mb-3">
          <div className="text-sm font-medium text-gray-700">Quick Actions</div>
          {propertyData?.address && propertyData.address !== 'Property Address' && (
            <div className="text-xs text-gray-500 truncate max-w-48 ml-2">
              {propertyData.address}
            </div>
          )}
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={handleScheduleTour}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors text-sm"
          >
            <Calendar className="w-4 h-4" />
            Schedule Tour
          </button>
          
          <button
            onClick={handleMakeOffer}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-green-700 transition-colors text-sm"
          >
            <DollarSign className="w-4 h-4" />
            Make Offer
          </button>
          
          <button
            onClick={handleFavorite}
            className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition-colors text-sm"
          >
            <Heart className="w-4 h-4" />
            Favorite
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomActionBar;
