
import React, { useState } from 'react';
import { PropertyActionButtons } from './PropertyActionButtons';
import { PropertyData } from '@/utils/propertyDataUtils';

interface PropertyActionHeaderProps {
  property?: PropertyData;
  className?: string;
  onScheduleTour?: () => void;
  onMakeOffer?: () => void;
  onFavorite?: () => void;
}

const PropertyActionHeader: React.FC<PropertyActionHeaderProps> = ({ 
  property,
  className = "",
  onScheduleTour,
  onMakeOffer,
  onFavorite
}) => {
  const [isFavorited, setIsFavorited] = useState(false);

  const handleScheduleTour = () => {
    if (onScheduleTour) {
      onScheduleTour();
    } else {
      console.log('Schedule tour for:', property);
    }
  };

  const handleMakeOffer = () => {
    if (onMakeOffer) {
      onMakeOffer();
    } else {
      console.log('Make offer for:', property);
    }
  };

  const handleFavorite = () => {
    if (onFavorite) {
      onFavorite();
    } else {
      setIsFavorited(!isFavorited);
      console.log('Favorite toggled for:', property);
    }
  };

  // Default property data if none provided (for demo purposes)
  const defaultProperty = {
    address: 'Property Details',
    price: '',
    beds: '',
    baths: '',
    mlsId: ''
  };

  const currentProperty = property || defaultProperty;

  return (
    <div className={`sticky top-16 z-40 bg-white border-b border-gray-200 shadow-sm ${className}`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Property info */}
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-gray-900 truncate">
              {currentProperty.address}
            </h2>
            {currentProperty.price && (
              <p className="text-sm text-gray-600">
                {currentProperty.price}
                {currentProperty.beds && currentProperty.baths && (
                  <span className="ml-2">
                    • {currentProperty.beds} bed • {currentProperty.baths} bath
                  </span>
                )}
              </p>
            )}
          </div>

          {/* Action buttons */}
          <div className="ml-4 flex-shrink-0">
            <PropertyActionButtons
              property={currentProperty}
              onScheduleTour={handleScheduleTour}
              onMakeOffer={handleMakeOffer}
              onFavorite={handleFavorite}
              isFavorited={isFavorited}
              size="sm"
              layout="horizontal"
              className="gap-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyActionHeader;
