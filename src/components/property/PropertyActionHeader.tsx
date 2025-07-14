
import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Share2, Calendar, DollarSign } from 'lucide-react';
import type { IdxProperty } from '../../hooks/useIdxIntegration';

interface PropertyActionHeaderProps {
  property?: IdxProperty | null;
  onScheduleTour?: () => void;
  onMakeOffer?: () => void;
  onFavorite?: () => void;
  onShare?: () => void;
  isFavorited?: boolean;
}

const PropertyActionHeader = ({ 
  property, 
  onScheduleTour,
  onMakeOffer,
  onFavorite,
  onShare,
  isFavorited = false
}: PropertyActionHeaderProps) => {
  if (!property) return null;

  const handleShare = () => {
    if (onShare) {
      onShare();
    } else {
      // Default share functionality
      if (navigator.share) {
        navigator.share({
          title: `Property at ${property.address}`,
          text: `Check out this property: ${property.address} - ${property.price}`,
          url: window.location.href
        });
      } else {
        // Fallback to copying URL
        navigator.clipboard.writeText(window.location.href);
        // You could add a toast notification here
      }
    }
  };

  return (
    <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold text-gray-900 truncate">
              {property.address}
            </h1>
            <div className="flex items-center space-x-4 mt-1">
              <span className="text-xl font-bold text-green-600">
                {property.price}
              </span>
              {property.beds && (
                <span className="text-sm text-gray-600">
                  {property.beds} beds
                </span>
              )}
              {property.baths && (
                <span className="text-sm text-gray-600">
                  {property.baths} baths
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={onFavorite}
              data-action="favorite"
              className={isFavorited ? 'bg-red-50 border-red-200' : ''}
            >
              <Heart className={`h-4 w-4 mr-1 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
              {isFavorited ? 'Saved' : 'Save'}
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
            
            <Button 
              size="sm"
              onClick={onScheduleTour}
              data-action="tour"
              className="bg-black text-white hover:bg-gray-800"
            >
              <Calendar className="h-4 w-4 mr-1" />
              Schedule Tour
            </Button>
            
            <Button 
              size="sm"
              variant="outline"
              onClick={onMakeOffer}
              data-action="offer"
              className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
            >
              <DollarSign className="h-4 w-4 mr-1" />
              Make Offer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyActionHeader;
