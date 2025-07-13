
import React from 'react';
import { Calendar, DollarSign, Heart } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { PropertyData } from '@/utils/idxCommunication';

interface PropertyActionHeaderProps {
  propertyData: PropertyData | null;
  onScheduleTour: (propertyData: PropertyData) => void;
  onMakeOffer: (propertyData: PropertyData) => void;
  onFavorite: (propertyData: PropertyData) => void;
  isVisible: boolean;
}

const PropertyActionHeader: React.FC<PropertyActionHeaderProps> = ({
  propertyData,
  onScheduleTour,
  onMakeOffer,
  onFavorite,
  isVisible
}) => {
  const handleScheduleTour = () => {
    const currentData = propertyData || {
      address: 'Current Property',
      price: '',
      beds: '',
      baths: '',
      mlsId: ''
    };
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
    onFavorite(currentData);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Property Information */}
            <div className="flex-1 min-w-0">
              {propertyData?.address && propertyData.address !== 'Property Address' ? (
                <div className="space-y-1">
                  <h2 className="text-lg font-semibold text-gray-900 truncate">
                    {propertyData.address}
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    {propertyData.price && (
                      <span className="font-medium text-gray-900">{propertyData.price}</span>
                    )}
                    {propertyData.beds && propertyData.baths && (
                      <span>{propertyData.beds} bed • {propertyData.baths} bath</span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Property Details
                  </h2>
                  <p className="text-sm text-gray-600">
                    Take action on this listing
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 lg:flex-shrink-0">
              <Button
                onClick={handleScheduleTour}
                className="bg-gray-900 text-white hover:bg-black transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] h-11 px-6"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Tour
              </Button>
              
              <Button
                onClick={handleMakeOffer}
                className="bg-gray-900 text-white hover:bg-black transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] h-11 px-6"
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Make Offer
              </Button>
              
              <Button
                onClick={handleFavorite}
                variant="outline"
                className="border-2 border-gray-300 text-gray-900 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-[1.02] h-11 px-6"
              >
                <Heart className="h-4 w-4 mr-2" />
                Save Favorite
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyActionHeader;
