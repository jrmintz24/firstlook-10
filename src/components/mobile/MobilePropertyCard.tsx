import React, { useState } from 'react';
import { Heart, Calendar, Share2, MapPin, Bed, Bath, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTouchGestures } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface MobilePropertyCardProps {
  property: {
    id: string;
    address: string;
    price: string;
    beds?: number;
    baths?: number;
    sqft?: number;
    images?: string[];
    isFavorited?: boolean;
  };
  onScheduleTour?: () => void;
  onToggleFavorite?: () => void;
  onShare?: () => void;
  onImageSwipe?: (direction: 'left' | 'right') => void;
  className?: string;
}

const MobilePropertyCard: React.FC<MobilePropertyCardProps> = ({
  property,
  onScheduleTour,
  onToggleFavorite,
  onShare,
  onImageSwipe,
  className
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoadError, setImageLoadError] = useState(false);
  
  const { onTouchStart, onTouchMove, onTouchEnd } = useTouchGestures();

  const images = property.images || [];
  const hasMultipleImages = images.length > 1;

  const handleImageSwipe = (e: React.TouchEvent) => {
    const swipeResult = onTouchEnd();
    
    if (swipeResult && hasMultipleImages) {
      if (swipeResult.isLeftSwipe && currentImageIndex < images.length - 1) {
        setCurrentImageIndex(prev => prev + 1);
        onImageSwipe?.('left');
      } else if (swipeResult.isRightSwipe && currentImageIndex > 0) {
        setCurrentImageIndex(prev => prev - 1);
        onImageSwipe?.('right');
      }
    }
  };

  const formatPrice = (price: string) => {
    if (price.includes('$')) return price;
    const numPrice = parseInt(price.replace(/[^\d]/g, ''));
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(numPrice);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <div className={cn("bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden", className)}>
      {/* Image Section */}
      <div className="relative aspect-[4/3] bg-gray-100">
        {images.length > 0 && !imageLoadError ? (
          <div
            className="relative w-full h-full"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={handleImageSwipe}
          >
            <img
              src={images[currentImageIndex]}
              alt={`${property.address} - Image ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
              onError={() => setImageLoadError(true)}
            />
            
            {/* Image Indicators */}
            {hasMultipleImages && (
              <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1">
                {images.map((_, index) => (
                  <div
                    key={index}
                    className={cn(
                      "w-2 h-2 rounded-full transition-colors",
                      index === currentImageIndex 
                        ? "bg-white" 
                        : "bg-white/50"
                    )}
                  />
                ))}
              </div>
            )}
            
            {/* Swipe Hint */}
            {hasMultipleImages && (
              <div className="absolute top-3 right-3 bg-black/20 text-white text-xs px-2 py-1 rounded-full">
                {currentImageIndex + 1}/{images.length}
              </div>
            )}
          </div>
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="w-12 h-12 bg-gray-300 rounded-lg mb-2 mx-auto flex items-center justify-center">
                <MapPin className="w-6 h-6" />
              </div>
              <p className="text-sm">No image available</p>
            </div>
          </div>
        )}

        {/* Action Buttons Overlay */}
        <div className="absolute top-3 left-3 right-3 flex justify-between">
          <Button
            variant="secondary"
            size="sm"
            onClick={onToggleFavorite}
            className="bg-white/90 hover:bg-white shadow-sm h-9 w-9 p-0"
          >
            <Heart 
              className={cn(
                "h-4 w-4",
                property.isFavorited 
                  ? "fill-red-500 text-red-500" 
                  : "text-gray-600"
              )} 
            />
          </Button>
          
          <Button
            variant="secondary"
            size="sm"
            onClick={onShare}
            className="bg-white/90 hover:bg-white shadow-sm h-9 w-9 p-0"
          >
            <Share2 className="h-4 w-4 text-gray-600" />
          </Button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-3">
        {/* Price */}
        <div className="flex items-start justify-between">
          <div className="text-2xl font-bold text-gray-900">
            {formatPrice(property.price)}
          </div>
        </div>

        {/* Address */}
        <div className="flex items-start gap-2">
          <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
            {property.address}
          </p>
        </div>

        {/* Property Details */}
        {(property.beds || property.baths || property.sqft) && (
          <div className="flex items-center gap-4 text-sm text-gray-600">
            {property.beds && (
              <div className="flex items-center gap-1">
                <Bed className="h-4 w-4" />
                <span>{property.beds} bed{property.beds !== 1 ? 's' : ''}</span>
              </div>
            )}
            {property.baths && (
              <div className="flex items-center gap-1">
                <Bath className="h-4 w-4" />
                <span>{property.baths} bath{property.baths !== 1 ? 's' : ''}</span>
              </div>
            )}
            {property.sqft && (
              <div className="flex items-center gap-1">
                <Square className="h-4 w-4" />
                <span>{formatNumber(property.sqft)} sq ft</span>
              </div>
            )}
          </div>
        )}

        {/* Schedule Tour Button */}
        <Button
          onClick={onScheduleTour}
          className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl"
        >
          <Calendar className="h-4 w-4 mr-2" />
          Schedule Tour
        </Button>
      </div>
    </div>
  );
};

export default MobilePropertyCard;