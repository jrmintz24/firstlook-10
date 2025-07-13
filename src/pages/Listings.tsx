
import React, { useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import ListingHead from '@/components/listings/ListingHead';
import ModernTourSchedulingModal from '@/components/ModernTourSchedulingModal';
import MakeOfferModal from '@/components/dashboard/MakeOfferModal';
import FavoritePropertyModal from '@/components/post-showing/FavoritePropertyModal';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  IDX_SCHEDULE_TOUR_EVENT, 
  IDX_MAKE_OFFER_EVENT, 
  IDX_FAVORITE_EVENT, 
  PropertyData, 
  IDX_CUSTOM_CSS 
} from '@/utils/idxCommunication';

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
  
  // Extract listing data from URL parameters or route params
  const listingAddress = address || searchParams.get('address') || undefined;
  const listingCity = searchParams.get('city') || undefined;
  const listingPhotoUrl = searchParams.get('photo') || undefined;
  const listingPhotoWidth = searchParams.get('photoWidth') || '1200';
  const listingPhotoHeight = searchParams.get('photoHeight') || '800';

  // Handle all custom events from IDX
  useEffect(() => {
    const handleTourScheduling = (event: CustomEvent<PropertyData>) => {
      console.log('Tour scheduling triggered:', event.detail);
      setSelectedProperty(event.detail);
      setIsTourModalOpen(true);
    };

    const handleMakeOffer = (event: CustomEvent<PropertyData>) => {
      console.log('Make offer triggered:', event.detail);
      setSelectedProperty(event.detail);
      setIsOfferModalOpen(true);
    };

    const handleFavorite = (event: CustomEvent<PropertyData>) => {
      console.log('Favorite triggered:', event.detail);
      setSelectedProperty(event.detail);
      setIsFavoriteModalOpen(true);
    };

    window.addEventListener(IDX_SCHEDULE_TOUR_EVENT, handleTourScheduling as EventListener);
    window.addEventListener(IDX_MAKE_OFFER_EVENT, handleMakeOffer as EventListener);
    window.addEventListener(IDX_FAVORITE_EVENT, handleFavorite as EventListener);
    
    return () => {
      window.removeEventListener(IDX_SCHEDULE_TOUR_EVENT, handleTourScheduling as EventListener);
      window.removeEventListener(IDX_MAKE_OFFER_EVENT, handleMakeOffer as EventListener);
      window.removeEventListener(IDX_FAVORITE_EVENT, handleFavorite as EventListener);
    };
  }, []);

  // Inject custom CSS into IDX
  useEffect(() => {
    const injectCustomCSS = () => {
      // Inject CSS only
      if (!document.querySelector('#idx-custom-styles')) {
        const styleElement = document.createElement('style');
        styleElement.id = 'idx-custom-styles';
        styleElement.textContent = IDX_CUSTOM_CSS;
        document.head.appendChild(styleElement);
      }
    };

    // Inject CSS after a short delay to ensure IDX is loaded
    const timer = setTimeout(injectCustomCSS, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // IDX initialization logic
  useEffect(() => {
    const initializeIDX = () => {
      if (containerRef.current && window.ihfKestrel) {
        try {
          console.log('iHomeFinder available, initializing widget directly...');
          console.log('ihfKestrel config:', window.ihfKestrel.config);
          console.log('ihfKestrel render function:', typeof window.ihfKestrel.render);
          
          // Clear the container first
          containerRef.current.innerHTML = '';
          
          // Call ihfKestrel.render() directly and handle the returned element
          const widgetElement = window.ihfKestrel.render();
          
          console.log('Widget element returned:', widgetElement);
          console.log('Widget element type:', typeof widgetElement);
          console.log('Widget element tagName:', widgetElement?.tagName);
          
          if (widgetElement && containerRef.current) {
            // If it's a DOM element, append it directly
            if (widgetElement instanceof HTMLElement) {
              containerRef.current.appendChild(widgetElement);
              console.log('iHomeFinder widget appended successfully');
              
            } else {
              console.error('Widget element is not a valid DOM element:', widgetElement);
              // Try to create a div and set innerHTML if it's a string
              if (typeof widgetElement === 'string') {
                const div = document.createElement('div');
                div.innerHTML = widgetElement;
                containerRef.current.appendChild(div);
                console.log('Widget rendered as HTML string');
              }
            }
          } else {
            console.error('Failed to render iHomeFinder widget - no widget returned or container missing');
            console.log('Container exists:', !!containerRef.current);
            console.log('Widget returned:', !!widgetElement);
            
            // Show error message in container
            if (containerRef.current) {
              containerRef.current.innerHTML = '<div class="flex items-center justify-center h-64 text-red-600"><p>Failed to load IDX widget. Please check configuration.</p></div>';
            }
          }
        } catch (error) {
          console.error('Error initializing iHomeFinder widget:', error);
          console.error('Error details:', {
            message: error.message,
            stack: error.stack
          });
          
          // Show error message in container
          if (containerRef.current) {
            containerRef.current.innerHTML = '<div class="flex items-center justify-center h-64 text-red-600"><p>Error loading IDX widget. Check console for details.</p></div>';
          }
        }
      } else {
        console.log('iHomeFinder not ready yet. ihfKestrel available:', !!window.ihfKestrel);
        console.log('Container available:', !!containerRef.current);
      }
    };

    // Check if iHomeFinder is already available
    if (window.ihfKestrel) {
      console.log('iHomeFinder already available, initializing immediately');
      initializeIDX();
    } else {
      // Poll for ihfKestrel availability with more detailed logging
      console.log('Polling for iHomeFinder availability...');
      const interval = setInterval(() => {
        console.log('Checking for ihfKestrel...', !!window.ihfKestrel);
        if (window.ihfKestrel && containerRef.current) {
          console.log('iHomeFinder now available, clearing interval');
          clearInterval(interval);
          initializeIDX();
        }
      }, 100);

      // Cleanup after 10 seconds
      setTimeout(() => {
        clearInterval(interval);
        if (!window.ihfKestrel) {
          console.error('iHomeFinder failed to load after 10 seconds');
          if (containerRef.current) {
            containerRef.current.innerHTML = '<div class="flex items-center justify-center h-64 text-yellow-600"><p>IDX widget is taking longer than expected to load. Please refresh the page.</p></div>';
          }
        }
      }, 10000);
    }
  }, []);

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

  const pageTitle = listingAddress ? `${listingAddress} - Property Details` : 'Property Search';

  return (
    <>
      <ListingHead 
        listingAddress={listingAddress}
        listingCity={listingCity}
        listingPhotoUrl={listingPhotoUrl}
        listingPhotoWidth={listingPhotoWidth}
        listingPhotoHeight={listingPhotoHeight}
      />
      <div 
        ref={containerRef}
        className="w-full min-h-screen"
      >
        <div className="flex items-center justify-center h-32 text-gray-500">
          Loading MLS listings...
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
    </>
  );
};

export default Listings;
