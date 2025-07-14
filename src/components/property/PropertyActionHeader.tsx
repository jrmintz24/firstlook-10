
import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Share2, Calendar } from 'lucide-react';
import type { IdxProperty } from '../../hooks/useIdxIntegration';

interface PropertyActionHeaderProps {
  property?: IdxProperty | null;
}

const PropertyActionHeader = ({ property }: PropertyActionHeaderProps) => {
  if (!property) return null;

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
            <Button variant="outline" size="sm">
              <Heart className="h-4 w-4 mr-1" />
              Save
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
            <Button size="sm">
              <Calendar className="h-4 w-4 mr-1" />
              Schedule Tour
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyActionHeader;
