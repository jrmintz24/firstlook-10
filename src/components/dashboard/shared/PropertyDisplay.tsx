import React from 'react';
import { 
  MapPin, 
  Home, 
  Bed, 
  Bath, 
  Square, 
  ExternalLink 
} from "lucide-react";

interface PropertyDisplayProps {
  address: string;
  price?: string | null;
  beds?: string | null;
  baths?: string | null;
  sqft?: string | null;
  image?: string | null;
  pageUrl?: string | null;
  size?: 'sm' | 'md' | 'lg';
  showImage?: boolean;
}

const PropertyDisplay = ({ 
  address,
  price,
  beds,
  baths,
  sqft,
  image,
  pageUrl,
  size = 'md',
  showImage = true
}: PropertyDisplayProps) => {
  const hasPropertyData = price || beds || baths || sqft;
  const showEnhancedLayout = hasPropertyData || (image && showImage);
  
  // Size configurations
  const sizeConfig = {
    sm: {
      imageSize: 'w-12 h-12',
      textSize: 'text-xs',
      titleSize: 'text-sm',
      iconSize: 'h-3 w-3',
      spacing: 'gap-2'
    },
    md: {
      imageSize: 'w-16 h-16 sm:w-20 sm:h-20',
      textSize: 'text-xs',
      titleSize: 'text-sm sm:text-base',
      iconSize: 'h-3 w-3',
      spacing: 'gap-3'
    },
    lg: {
      imageSize: 'w-20 h-20 sm:w-24 sm:h-24',
      textSize: 'text-sm',
      titleSize: 'text-base sm:text-lg',
      iconSize: 'h-4 w-4',
      spacing: 'gap-4'
    }
  };

  const config = sizeConfig[size];

  if (!showEnhancedLayout) {
    // Simple fallback layout
    return (
      <div className={`flex items-start ${config.spacing}`}>
        <MapPin className={`${config.iconSize} text-gray-500 flex-shrink-0 mt-0.5`} />
        <div>
          <h3 className={`font-medium text-gray-900 ${config.titleSize} leading-tight`}>
            {address}
          </h3>
          {pageUrl && (
            <a 
              href={pageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1 ${config.textSize} text-blue-600 hover:text-blue-800 mt-1`}
            >
              View Property <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${config.spacing}`}>
      {/* Property Image */}
      {image && showImage && (
        <div className="flex-shrink-0">
          <div className={`${config.imageSize} rounded-lg overflow-hidden bg-gray-100 border`}>
            <img 
              src={image} 
              alt={address}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className="hidden w-full h-full flex items-center justify-center bg-gray-100">
              <Home className={`${config.iconSize} text-gray-400`} />
            </div>
          </div>
        </div>
      )}
      
      {/* Property Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className={`font-medium text-gray-900 ${config.titleSize} leading-tight`}>
              {address}
            </h3>
            
            {/* Property Details */}
            {hasPropertyData && (
              <div className={`flex items-center gap-3 mt-1 ${config.textSize} text-gray-600`}>
                {price && (
                  <span className="font-semibold text-green-600">{price}</span>
                )}
                {beds && (
                  <div className="flex items-center gap-1">
                    <Bed className={config.iconSize} />
                    <span>{beds}</span>
                  </div>
                )}
                {baths && (
                  <div className="flex items-center gap-1">
                    <Bath className={config.iconSize} />
                    <span>{baths}</span>
                  </div>
                )}
                {sqft && (
                  <div className="flex items-center gap-1">
                    <Square className={config.iconSize} />
                    <span>{sqft}</span>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* View Property Link */}
          {pageUrl && (
            <a 
              href={pageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-1 ${config.textSize} text-blue-600 hover:text-blue-800 px-2 py-1 rounded hover:bg-blue-50 transition-colors`}
            >
              <ExternalLink className="h-3 w-3" />
              <span className="hidden sm:inline">View</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyDisplay;