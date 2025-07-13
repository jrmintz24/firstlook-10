
import React, { useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import ListingHead from '@/components/listings/ListingHead';
import PropertyActionHeader from '@/components/listings/PropertyActionHeader';
import ModernTourSchedulingModal from '@/components/ModernTourSchedulingModal';
import MakeOfferModal from '@/components/dashboard/MakeOfferModal';
import FavoritePropertyModal from '@/components/post-showing/FavoritePropertyModal';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PropertyData, IDX_BUTTON_HIDING_CSS, extractPropertyData, isPropertyDetailPage } from '@/utils/idxCommunication';

const Listings = () => {
  const { address } = useParams<{ address?: string }>();
  const [searchParams] = useSearchParams();
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Modal states
  const [isTourModalOpen, setIsTourModalOpen] = useState(false);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [isFavoriteModalOpen, setIsFavoriteModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<PropertyData | null>(null);
  const [isSubmittingFavorite, setIsSubmittingFavorite] = useState(false);
  
  // Property data state for header
  const [propertyData, setPropertyData] = useState<PropertyData | null>(null);
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);
  
  // Extract listing data from URL parameters or route params
  const listingAddress = address || searchParams.get('address') || undefined;
  const listingCity = searchParams.get('city') || undefined;
  const listingPhotoUrl = searchParams.get('photo') || undefined;
  const listingPhotoWidth = searchParams.get('photoWidth') || '1200';
  const listingPhotoHeight = searchParams.get('photoHeight') || '800';

  // Inject CSS to hide iHomeFinder's default buttons
  useEffect(() => {
    if (!document.querySelector('#idx-button-hiding-styles')) {
      const styleElement = document.createElement('style');
      styleElement.id = 'idx-button-hiding-styles';
      styleElement.textContent = IDX_BUTTON_HIDING_CSS;
      document.head.appendChild(styleElement);
    }

    return () => {
      const styleElement = document.querySelector('#idx-button-hiding-styles');
      if (styleElement) {
        styleElement.remove();
      }
    };
  }, []);

  // Simple IDX initialization using the provided script approach
  useEffect(() => {
    if (containerRef.current && window.ihfKestrel) {
      try {
        console.log('Initializing IDX widget...');
        containerRef.current.innerHTML = '';
        
        // Use the simple approach: document.currentScript.replaceWith(ihfKestrel.render());
        const widgetElement = window.ihfKestrel.render();
        
        if (widgetElement && containerRef.current) {
          if (widgetElement instanceof HTMLElement) {
            containerRef.current.appendChild(widgetElement);
          } else if (typeof widgetElement === 'string') {
            containerRef.current.innerHTML = widgetElement;
          }
          console.log('IDX widget loaded successfully');
        }
      } catch (error) {
        console.error('Error initializing IDX widget:', error);
        if (containerRef.current) {
          containerRef.current.innerHTML = '<div class="flex items-center justify-center h-64 text-red-600"><p>Error loading IDX widget.</p></div>';
        }
      }
    } else if (!window.ihfKestrel) {
      // Simple polling for ihfKestrel availability
      const interval = setInterval(() => {
        if (window.ihfKestrel && containerRef.current) {
          clearInterval(interval);
          // Trigger re-render
          setPropertyData(prev => ({ ...prev }));
        }
      }, 500);

      setTimeout(() => clearInterval(interval), 10000);
    }
  }, []);

  // Simple property data extraction - only on detail pages
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const checkForPropertyData = () => {
      if (isPropertyDetailPage()) {
        const data = extractPropertyData();
        if (data.address && data.address.length > 10) {
          setPropertyData(data);
          setIsHeaderVisible(true);
          console.log('Property data extracted:', data);
        } else {
          // Simple retry after 2 seconds if on detail page but no data yet
          timeoutId = setTimeout(checkForPropertyData, 2000);
        }
      } else {
        // Not on detail page, hide header
        setIsHeaderVisible(false);
        setPropertyData(null);
      }
    };

    // Initial check after IDX loads
    timeoutId = setTimeout(checkForPropertyData, 3000);
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  // Handle button clicks from Header
  const handleScheduleTour = (propertyData: PropertyData) => {
    console.log('Schedule tour clicked:', propertyData);
    setSelectedProperty(propertyData);
    setIsTourModalOpen(true);
  };

  const handleMakeOffer = (propertyData: PropertyData) => {
    console.log('Make offer clicked:', propertyData);
    setSelectedProperty(propertyData);
    setIsOfferModalOpen(true);
  };

  const handleFavorite = (propertyData: PropertyData) => {
    console.log('Favorite clicked:', propertyData);
    setSelectedProperty(propertyData);
    setIsFavoriteModalOpen(true);
  };

  // Handle favorite save
  const handleSaveFavorite = async (notes?: string) => {
    if (!selectedProperty) return;

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save favorites",
        variant: "destructive"
      });
      return;
    }

    setIsSubmittingFavorite(true);
    try {
      const { error } = await supabase
        .from('property_favorites')
        .insert({
          buyer_id: user.id,
          property_address: selectedProperty.address,
          notes: notes
        });

      if (error) throw error;

      toast({
        title: "Added to favorites",
        description: "Property saved to your favorites"
      });
    } catch (error) {
      console.error('Error saving favorite:', error);
      toast({
        title: "Error",
        description: "Failed to save favorite. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmittingFavorite(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <ListingHead 
            listingAddress={listingAddress}
            listingCity={listingCity}
            listingPhotoUrl={listingPhotoUrl}
            listingPhotoWidth={listingPhotoWidth}
            listingPhotoHeight={listingPhotoHeight}
          />
        </div>
      </div>

      {/* Property Action Header - Only show on detail pages */}
      {isHeaderVisible && (
        <PropertyActionHeader
          propertyData={propertyData}
          onScheduleTour={handleScheduleTour}
          onMakeOffer={handleMakeOffer}
          onFavorite={handleFavorite}
          isVisible={isHeaderVisible}
        />
      )}
      
      {/* Main Content Area - Full Width */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow-lg">
          <div className="p-4 lg:p-8">
            <div 
              ref={containerRef}
              className="w-full min-h-[800px] bg-white rounded-xl border border-gray-200 shadow-sm"
            >
              <div className="flex items-center justify-center h-32 text-gray-500">
                Loading MLS listings...
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tour Scheduling Modal */}
      <ModernTourSchedulingModal
        isOpen={isTourModalOpen}
        onClose={() => {
          setIsTourModalOpen(false);
          setSelectedProperty(null);
        }}
        onSuccess={async () => {
          setIsTourModalOpen(false);
          setSelectedProperty(null);
        }}
        initialAddress={selectedProperty?.address || ''}
      />

      {/* Make Offer Modal */}
      <MakeOfferModal
        isOpen={isOfferModalOpen}
        onClose={() => {
          setIsOfferModalOpen(false);
          setSelectedProperty(null);
        }}
        propertyAddress={selectedProperty?.address || ''}
      />

      {/* Favorite Property Modal */}
      <FavoritePropertyModal
        isOpen={isFavoriteModalOpen}
        onClose={() => {
          setIsFavoriteModalOpen(false);
          setSelectedProperty(null);
        }}
        onSave={handleSaveFavorite}
        propertyAddress={selectedProperty?.address || ''}
        isSubmitting={isSubmittingFavorite}
      />
    </div>
  );
};

export default Listings;
