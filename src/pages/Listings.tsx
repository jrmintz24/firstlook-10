
import React, { useEffect, useRef, useState } from 'react';
import PropertyActionHeader from '@/components/listings/PropertyActionHeader';
import ModernTourSchedulingModal from '@/components/ModernTourSchedulingModal';
import MakeOfferModal from '@/components/dashboard/MakeOfferModal';
import FavoritePropertyModal from '@/components/post-showing/FavoritePropertyModal';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PropertyData, IDX_BUTTON_HIDING_CSS, extractPropertyData, isPropertyDetailPage } from '@/utils/idxCommunication';

const Listings = () => {
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

  // Inject CSS to hide IDX buttons
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = IDX_BUTTON_HIDING_CSS;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // Initialize IDX widget
  useEffect(() => {
    const initializeIDX = () => {
      if (containerRef.current && window.ihfKestrel) {
        try {
          console.log('Initializing IDX widget...');
          containerRef.current.innerHTML = '';
          
          // Use the simple approach as recommended by iHomeFinder
          const widgetElement = window.ihfKestrel.render();
          
          if (widgetElement && containerRef.current) {
            if (widgetElement instanceof HTMLElement) {
              containerRef.current.appendChild(widgetElement);
            } else if (typeof widgetElement === 'string') {
              containerRef.current.innerHTML = widgetElement;
            }
            console.log('IDX widget initialized successfully');
          }
        } catch (error) {
          console.error('Error initializing IDX widget:', error);
          if (containerRef.current) {
            containerRef.current.innerHTML = '<div class="flex items-center justify-center h-64 text-red-600"><p>Error loading IDX widget.</p></div>';
          }
        }
      }
    };

    // Initialize immediately if available
    if (window.ihfKestrel) {
      initializeIDX();
    } else {
      // Poll for availability
      const interval = setInterval(() => {
        if (window.ihfKestrel) {
          clearInterval(interval);
          initializeIDX();
        }
      }, 500);

      // Clean up after 10 seconds
      setTimeout(() => clearInterval(interval), 10000);
    }
  }, []);

  // Monitor for property detail pages
  useEffect(() => {
    const checkForPropertyData = () => {
      if (isPropertyDetailPage()) {
        const data = extractPropertyData();
        if (data.address && data.address.length > 5) {
          setPropertyData(data);
          setIsHeaderVisible(true);
          console.log('Property data extracted:', data);
        }
      } else {
        setIsHeaderVisible(false);
        setPropertyData(null);
      }
    };

    // Check periodically for property details
    const interval = setInterval(checkForPropertyData, 2000);
    
    // Initial check
    setTimeout(checkForPropertyData, 3000);

    return () => clearInterval(interval);
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
      
      {/* Main IDX Container - Full Width */}
      <div className="w-full">
        <div 
          ref={containerRef}
          className="w-full min-h-screen bg-white"
        >
          <div className="flex items-center justify-center h-64 text-gray-500">
            Loading MLS listings...
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
