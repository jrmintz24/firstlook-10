import React, { useState } from 'react';
import { Calendar, Heart } from 'lucide-react';
import { useLocation, useParams, useSearchParams } from 'react-router-dom';
import { Button } from '../ui/button';
import ModernTourSchedulingModal from '../ModernTourSchedulingModal';
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
  const { propertyData, isLoading, error } = useIDXPropertyExtractor();
  const { favoriteProperty, isSubmitting } = useEnhancedPostShowingActions();
  const { user } = useAuth();
  const location = useLocation();
  const { listingId } = useParams<{ listingId: string }>();
  const [searchParams] = useSearchParams();
  const queryId = searchParams.get('id');

  // Check if we're on an individual property detail page using either route params or query params
  const isPropertyDetailPage = !!listingId || !!queryId;
  
  console.log('[PropertyToolbar] Current path:', location.pathname);
  console.log('[PropertyToolbar] Listing ID from params:', listingId);
  console.log('[PropertyToolbar] Query ID from search params:', queryId);
  console.log('[PropertyToolbar] Is property detail page:', isPropertyDetailPage);
  console.log('[PropertyToolbar] Property data:', propertyData);
  console.log('[PropertyToolbar] Is loading:', isLoading);
  console.log('[PropertyToolbar] Error:', error);

  const handleScheduleTour = () => {
    console.log('[PropertyToolbar] Schedule tour with property ID:', propertyData?.mlsId, 'and address:', propertyData?.address);
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

  // Don't show toolbar if not on a property detail page
  if (!isPropertyDetailPage) {
    return null;
  }

  return (
    <>
      <div className={`fixed top-16 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm ${className}`}>
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Property Info */}
            <div className="flex-1 min-w-0">
              {isLoading ? (
                <div className="animate-pulse">
                  <div className="h-6 bg-muted rounded w-64 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-48"></div>
                </div>
              ) : propertyData ? (
                <>
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
                </>
              ) : (
                <div className="text-sm text-muted-foreground">
                  Property details loading...
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <Button
                onClick={handleSaveProperty}
                variant="outline"
                size="sm"
                className="hidden sm:flex hover:bg-accent"
                disabled={isLoading}
              >
                <Heart className="h-4 w-4 mr-2" />
                Save
              </Button>
              
              <Button
                onClick={handleScheduleTour}
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                disabled={isLoading}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Tour
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Tour Scheduling Modal */}
      <ModernTourSchedulingModal
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        onSuccess={handleScheduleSuccess}
        initialAddress={propertyData?.address}
        propertyId={propertyData?.mlsId}
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