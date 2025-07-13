import React, { useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import ListingHead from '@/components/listings/ListingHead';
import ModernTourSchedulingModal from '@/components/ModernTourSchedulingModal';
import MakeOfferModal from '@/components/dashboard/MakeOfferModal';
import FavoritePropertyModal from '@/components/post-showing/FavoritePropertyModal';
import IDXButtonInjector from '@/components/IDXButtonInjector';
import CustomActionBar from '@/components/listings/CustomActionBar';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PropertyData, IDX_BUTTON_HIDING_CSS } from '@/utils/idxCommunication';

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

  // IDX initialization logic
  useEffect(() => {
    const initializeIDX = () => {
      if (containerRef.current && window.ihfKestrel) {
        try {
          console.log('iHomeFinder available, initializing widget...');
          
          // Clear the container first
          containerRef.current.innerHTML = '';
          
          // Call ihfKestrel.render() directly
          const widgetElement = window.ihfKestrel.render();
          
          if (widgetElement && containerRef.current) {
            if (widgetElement instanceof HTMLElement) {
              containerRef.current.appendChild(widgetElement);
              console.log('iHomeFinder widget loaded successfully');
            } else if (typeof widgetElement === 'string') {
              const div = document.createElement('div');
              div.innerHTML = widgetElement;
              containerRef.current.appendChild(div);
              console.log('Widget rendered as HTML string');
            }
          } else {
            console.error('Failed to render iHomeFinder widget');
            if (containerRef.current) {
              containerRef.current.innerHTML = '<div class="flex items-center justify-center h-64 text-red-600"><p>Failed to load IDX widget. Please check configuration.</p></div>';
            }
          }
        } catch (error) {
          console.error('Error initializing iHomeFinder widget:', error);
          if (containerRef.current) {
            containerRef.current.innerHTML = '<div class="flex items-center justify-center h-64 text-red-600"><p>Error loading IDX widget. Check console for details.</p></div>';
          }
        }
      }
    };

    // Check if iHomeFinder is already available
    if (window.ihfKestrel) {
      initializeIDX();
    } else {
      // Poll for ihfKestrel availability
      const interval = setInterval(() => {
        if (window.ihfKestrel && containerRef.current) {
          clearInterval(interval);
          initializeIDX();
        }
      }, 100);

      // Cleanup after 10 seconds
      setTimeout(() => {
        clearInterval(interval);
        if (!window.ihfKestrel && containerRef.current) {
          containerRef.current.innerHTML = '<div class="flex items-center justify-center h-64 text-yellow-600"><p>IDX widget is taking longer than expected to load. Please refresh the page.</p></div>';
        }
      }, 10000);
    }
  }, []);

  // Handle button clicks from both IDXButtonInjector and CustomActionBar
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
      
      {/* IDX Button Injector */}
      <IDXButtonInjector
        onScheduleTour={handleScheduleTour}
        onMakeOffer={handleMakeOffer}
        onFavorite={handleFavorite}
      />
      
      {/* Custom Action Bar */}
      <CustomActionBar
        onScheduleTour={handleScheduleTour}
        onMakeOffer={handleMakeOffer}
        onFavorite={handleFavorite}
      />
      
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
