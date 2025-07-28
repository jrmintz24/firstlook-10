import React, { useState, useEffect } from 'react';
import { Calendar, Heart } from 'lucide-react';
import { useLocation, useParams, useSearchParams } from 'react-router-dom';
import { Button } from '../ui/button';
import ModernTourSchedulingModal from '../ModernTourSchedulingModal';
import FavoritePropertyModal from '../post-showing/FavoritePropertyModal';
import { useIDXPropertyEnhanced } from '../../hooks/useIDXPropertyEnhanced';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface PropertyToolbarProps {
  className?: string;
}

export const PropertyToolbar: React.FC<PropertyToolbarProps> = ({ className = '' }) => {
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isFavoriteOpen, setIsFavoriteOpen] = useState(false);
  const [extractedPropertyData, setExtractedPropertyData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { property: hookPropertyData, isSaved, toggleFavorite } = useIDXPropertyEnhanced();
  const { user } = useAuth();
  const location = useLocation();
  const { listingId } = useParams<{ listingId: string }>();
  const [searchParams] = useSearchParams();
  const queryId = searchParams.get('id');

  // Check if we're on an individual property detail page using either route params or query params
  const isPropertyDetailPage = !!listingId || !!queryId;

  // Function to save property details to backend
  const savePropertyToBackend = async (propertyDetails: any) => {
    try {
      console.log('[PropertyToolbar] Saving property details to backend:', propertyDetails);
      
      if (!propertyDetails.listingId && !propertyDetails.address) {
        console.warn('[PropertyToolbar] No listing ID or address, cannot save property');
        return null;
      }

      const propertyData = {
        idx_id: propertyDetails.listingId || queryId || listingId,
        mls_id: propertyDetails.listingId || queryId || listingId,
        address: propertyDetails.address,
        price: propertyDetails.price ? parseFloat(propertyDetails.price.replace(/[^0-9.]/g, '')) || null : null,
        beds: propertyDetails.beds ? parseInt(propertyDetails.beds.replace(/[^0-9]/g, '')) || null : null,
        baths: propertyDetails.baths ? parseFloat(propertyDetails.baths.replace(/[^0-9.]/g, '')) || null : null,
        sqft: propertyDetails.sqft ? parseInt(propertyDetails.sqft.replace(/[^0-9]/g, '')) || null : null,
        images: propertyDetails.image ? [propertyDetails.image] : [],
        ihf_page_url: propertyDetails.link,
        raw_data: propertyDetails
      };

      // Use the existing edge function
      const { data, error } = await supabase.functions.invoke('upsert-idx-property', {
        body: { property: propertyData }
      });

      if (error) {
        throw new Error(`Failed to save property: ${error.message}`);
      }

      console.log('[PropertyToolbar] Property saved successfully:', data);
      return data;
    } catch (error) {
      console.error('[PropertyToolbar] Error saving property to backend:', error);
      return null;
    }
  };

  // Listen for extracted property details
  useEffect(() => {
    const handleListingDetailsExtracted = (event: CustomEvent) => {
      console.log('[PropertyToolbar] Received extracted property details:', event.detail);
      setExtractedPropertyData(event.detail);
      setIsLoading(false);
      
      // Save property details to backend automatically
      savePropertyToBackend(event.detail);
    };

    // Check if details are already available
    if ((window as any).currentListingDetails) {
      console.log('[PropertyToolbar] Using existing property details');
      setExtractedPropertyData((window as any).currentListingDetails);
      setIsLoading(false);
      savePropertyToBackend((window as any).currentListingDetails);
    }

    window.addEventListener('listingDetailsExtracted', handleListingDetailsExtracted);
    
    // Stop loading after a timeout if no data is extracted
    const timeout = setTimeout(() => {
      if (!extractedPropertyData) {
        console.log('[PropertyToolbar] No property details extracted, using fallback');
        setIsLoading(false);
      }
    }, 10000);

    return () => {
      window.removeEventListener('listingDetailsExtracted', handleListingDetailsExtracted);
      clearTimeout(timeout);
    };
  }, []);

  // Use extracted data if available, fallback to hook data
  const propertyData = extractedPropertyData || hookPropertyData;
  
  console.log('[PropertyToolbar] Current path:', location.pathname);
  console.log('[PropertyToolbar] Listing ID from params:', listingId);
  console.log('[PropertyToolbar] Query ID from search params:', queryId);
  console.log('[PropertyToolbar] Is property detail page:', isPropertyDetailPage);
  console.log('[PropertyToolbar] Property data:', propertyData);
  console.log('[PropertyToolbar] Is loading:', isLoading);

  const handleScheduleTour = () => {
    console.log('[PropertyToolbar] Schedule tour with property ID:', propertyData?.mlsId, 'and address:', propertyData?.address);
    setIsScheduleOpen(true);
  };

  const handleScheduleSuccess = async () => {
    setIsScheduleOpen(false);
  };

  const handleSaveProperty = async () => {
    if (!user) {
      toast.error('Please sign in to save properties');
      return;
    }
    
    try {
      await toggleFavorite();
      toast.success(isSaved ? 'Removed from favorites' : 'Added to favorites');
    } catch (error) {
      toast.error('Failed to update favorites');
    }
  };

  const handleFavoriteProperty = async (notes?: string) => {
    // This is handled by the new toggleFavorite function
    await handleSaveProperty();
  };

  // Don't show toolbar if not on a property detail page
  if (!isPropertyDetailPage) {
    return null;
  }

  return (
    <>
      <div className={`fixed top-16 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between gap-6">
            {/* Property Info */}
            <div className="flex-1 min-w-0">
              {isLoading ? (
                <div className="animate-pulse">
                  <div className="h-7 bg-muted rounded w-80 mb-3"></div>
                  <div className="h-5 bg-muted rounded w-60"></div>
                </div>
              ) : propertyData ? (
                <>
                  <h2 className="text-xl md:text-2xl font-light text-foreground truncate mb-2">
                    {propertyData.address}
                  </h2>
                  {propertyData.price && (
                    <div className="flex items-center gap-6 mt-2">
                      <span className="text-2xl md:text-3xl font-bold text-primary">
                        {propertyData.price}
                      </span>
                      {propertyData.beds && propertyData.baths && (
                        <span className="text-sm md:text-base text-muted-foreground">
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
                className="hidden sm:flex hover:bg-accent px-4 py-2 h-auto"
                disabled={isLoading}
              >
                <Heart className={`h-4 w-4 mr-2 ${isSaved ? 'fill-primary text-primary' : ''}`} />
                {isSaved ? 'Saved' : 'Save'}
              </Button>
              
              <Button
                onClick={handleScheduleTour}
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg px-6 py-2 h-auto font-medium"
                disabled={isLoading}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Tour
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Tour Scheduling Modal - Only render when needed */}
      {isScheduleOpen && (
        <ModernTourSchedulingModal
          isOpen={isScheduleOpen}
          onClose={() => setIsScheduleOpen(false)}
          onSuccess={handleScheduleSuccess}
          initialAddress={propertyData?.address}
          propertyId={propertyData?.listingId || queryId || listingId}
          propertyDetails={extractedPropertyData}
        />
      )}

      {/* Favorite Property Modal */}
      <FavoritePropertyModal
        isOpen={isFavoriteOpen}
        onClose={() => setIsFavoriteOpen(false)}
        onSave={handleFavoriteProperty}
        propertyAddress={propertyData?.address || ''}
        isSubmitting={false}
      />
    </>
  );
};