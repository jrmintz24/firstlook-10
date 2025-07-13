
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
    <div className="w-full bg-background border-b border-border py-6">
      <div className="max-w-4xl mx-auto px-6">
        {propertyData?.address && propertyData.address !== 'Property Address' && (
          <div className="mb-4">
            <h2 className="text-lg font-medium text-foreground truncate">
              {propertyData.address}
            </h2>
            {propertyData.price && (
              <p className="text-sm text-muted-foreground">
                {propertyData.price}
                {propertyData.beds && propertyData.baths && (
                  <span className="ml-2">
                    • {propertyData.beds} bed, {propertyData.baths} bath
                  </span>
                )}
              </p>
            )}
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleScheduleTour}
            className="flex items-center justify-center gap-3 bg-gray-900 text-white px-6 py-3 rounded-2xl font-medium hover:bg-black transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Calendar className="w-5 h-5" />
            Schedule Tour
          </button>
          
          <button
            onClick={handleMakeOffer}
            className="flex items-center justify-center gap-3 bg-gray-900 text-white px-6 py-3 rounded-2xl font-medium hover:bg-black transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <DollarSign className="w-5 h-5" />
            Make Offer
          </button>
          
          <button
            onClick={handleFavorite}
            className="flex items-center justify-center gap-3 bg-white border-2 border-gray-300 text-gray-900 px-6 py-3 rounded-2xl font-medium hover:bg-gray-100 hover:border-gray-400 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            <Heart className="w-5 h-5" />
            Favorite
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomActionBar;
