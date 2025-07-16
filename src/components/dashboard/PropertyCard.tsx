import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Calendar, MapPin, Home, Bath, Square, Clock } from 'lucide-react';
import { fetchPropertyDataById, PropertyData } from '../../services/propertyDataService';

interface PropertyCardProps {
  propertyId?: string;
  propertyAddress?: string;
  showingDate?: string;
  showingTime?: string;
  status?: string;
  onScheduleAnother?: () => void;
  className?: string;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  propertyId,
  propertyAddress,
  showingDate,
  showingTime,
  status,
  onScheduleAnother,
  className = ''
}) => {
  const [propertyData, setPropertyData] = useState<PropertyData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (propertyId) {
      setIsLoading(true);
      fetchPropertyDataById(propertyId)
        .then(data => {
          setPropertyData(data);
        })
        .catch(error => {
          console.error('Error fetching property data:', error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [propertyId]);

  const displayAddress = propertyData?.address || propertyAddress || 'Address not available';
  const displayPrice = propertyData?.price;
  const displayBeds = propertyData?.beds;
  const displayBaths = propertyData?.baths;
  const displaySqft = propertyData?.sqft;

  return (
    <Card className={`overflow-hidden hover:shadow-md transition-shadow ${className}`}>
      <CardContent className="p-6">
        {/* Property Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Home className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <h3 className="font-semibold text-foreground truncate">
                {displayAddress}
              </h3>
            </div>
            
            {displayPrice && (
              <p className="text-xl font-bold text-primary mb-2">
                {displayPrice}
              </p>
            )}

            {/* Property Details */}
            {(displayBeds || displayBaths || displaySqft) && (
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                {displayBeds && (
                  <div className="flex items-center gap-1">
                    <span>{displayBeds}</span>
                    <span>bed{displayBeds !== '1' ? 's' : ''}</span>
                  </div>
                )}
                {displayBaths && (
                  <div className="flex items-center gap-1">
                    <Bath className="h-3 w-3" />
                    <span>{displayBaths}</span>
                  </div>
                )}
                {displaySqft && (
                  <div className="flex items-center gap-1">
                    <Square className="h-3 w-3" />
                    <span>{displaySqft} sqft</span>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {status && (
            <Badge 
              variant={status === 'confirmed' ? 'default' : 'secondary'}
              className="ml-2"
            >
              {status}
            </Badge>
          )}
        </div>

        {/* Showing Details */}
        {(showingDate || showingTime) && (
          <div className="border-t pt-4 mb-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Calendar className="h-4 w-4" />
              <span>Scheduled Tour</span>
            </div>
            
            {showingDate && (
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-3 w-3 text-muted-foreground" />
                <span>
                  {new Date(showingDate).toLocaleDateString()} 
                  {showingTime && ` at ${showingTime}`}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        {onScheduleAnother && (
          <div className="border-t pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onScheduleAnother}
              className="w-full"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Another Tour
            </Button>
          </div>
        )}

        {/* Loading State */}
        {isLoading && propertyId && (
          <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};