import React, { useState } from 'react';
import { Calendar, Heart } from 'lucide-react';
import { Button } from '../ui/button';
import PropertyRequestForm from '../PropertyRequestForm';
import FavoritePropertyModal from '../post-showing/FavoritePropertyModal';
import { useIDXPropertyExtractor } from '../../hooks/useIDXPropertyExtractor';
import { useEnhancedPostShowingActions } from '../../hooks/useEnhancedPostShowingActions';
import { useAuth } from '../../contexts/AuthContext';
import { PropertyEntry } from '../../types/propertyRequest';

interface PropertyToolbarProps {
  className?: string;
}

export const PropertyToolbar: React.FC<PropertyToolbarProps> = ({ className = '' }) => {
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isFavoriteOpen, setIsFavoriteOpen] = useState(false);
  const { propertyData, isLoading } = useIDXPropertyExtractor();
  const { favoriteProperty, isSubmitting } = useEnhancedPostShowingActions();
  const { user } = useAuth();

  const handleScheduleTour = () => {
    setIsScheduleOpen(true);
  };

  const handleScheduleSuccess = async () => {
    setIsScheduleOpen(false);
  };

  const handleSaveProperty = () => {
    if (!user) {
      // Could trigger auth modal here
      return;
    }
    setIsFavoriteOpen(true);
  };

  const handleFavoriteProperty = async (notes?: string) => {
    if (!user || !propertyData?.address) return;
    
    await favoriteProperty({
      showingId: null,
      buyerId: user.id,
      propertyAddress: propertyData.address,
    }, notes);
  };

  if (isLoading) {
    return null; // Don't show toolbar while loading
  }

  return (
    <>
      <div className={`fixed top-16 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm ${className}`}>
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Property Info */}
            {propertyData && (
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-semibold text-foreground truncate">
                  {propertyData.address}
                </h2>
                {propertyData.price && (
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-xl font-bold text-primary">
                      {propertyData.price}
                    </span>
                    {propertyData.beds && propertyData.baths && (
                      <span className="text-sm text-muted-foreground">
                        {propertyData.beds} bed • {propertyData.baths} bath
                        {propertyData.sqft && ` • ${propertyData.sqft} sqft`}
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <Button
                onClick={handleSaveProperty}
                variant="outline"
                size="sm"
                className="hidden sm:flex hover:bg-accent"
                disabled={!propertyData?.address}
              >
                <Heart className="h-4 w-4 mr-2" />
                Save
              </Button>
              
              <Button
                onClick={handleScheduleTour}
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                disabled={!propertyData?.address}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Tour
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Property Request Form */}
      <PropertyRequestForm
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        onSuccess={handleScheduleSuccess}
        initialPropertyAddress={propertyData?.address}
      />

      {/* Favorite Property Modal */}
      <FavoritePropertyModal
        isOpen={isFavoriteOpen}
        onClose={() => setIsFavoriteOpen(false)}
        onSave={handleFavoriteProperty}
        propertyAddress={propertyData?.address || ''}
        isSubmitting={isSubmitting}
      />
    </>
  );
};