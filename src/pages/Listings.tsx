
import React, { useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import ListingHead from '@/components/listings/ListingHead';
import PropertyActionHeader from '@/components/listings/PropertyActionHeader';
import ModernTourSchedulingModal from '@/components/ModernTourSchedulingModal';
import MakeOfferModal from '@/components/dashboard/MakeOfferModal';
import FavoritePropertyModal from '@/components/post-showing/FavoritePropertyModal';
import IDXButtonInjector from '@/components/IDXButtonInjector';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PropertyData, IDX_BUTTON_HIDING_CSS, extractPropertyData } from '@/utils/idxCommunication';

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

  // Extract property data for header
  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 20;
    
    const extractData = () => {
      retryCount++;
      console.log(`PropertyActionHeader: Attempting to extract property data (attempt ${retryCount})`);
      
      const data = extractPropertyData();
      
      // Check if we have meaningful property data
      if (data.address && data.address.length > 10) {
        setPropertyData(data);
        setIsHeaderVisible(true);
        console.log('PropertyActionHeader: Property data extracted successfully:', data);
        return;
      }
      
      if (retryCount < maxRetries) {
        setTimeout(extractData, 1000);
      } else {
        console.log('PropertyActionHeader: Max retries reached, showing basic header');
        // Show header even without full data
        setPropertyData({
          address: 'Property Address',
          price: '',
          beds: '',
          baths: '',
          mlsId: ''
        });
        setIsHeaderVisible(true);
      }
    };

    // Start extraction after a short delay to let IDX load
    setTimeout(extractData, 2000);
    
    // Also watch for DOM changes
    const observer = new MutationObserver(() => {
      if (!propertyData || !propertyData.address || propertyData.address === 'Property Address') {
        extractData();
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    return () => observer.disconnect();
  }, [propertyData]);

  // IDX initialization logic - enhanced to handle search results from homepage
  useEffect(() => {
    const initializeIDX = () => {
      if (containerRef.current && window.ihfKestrel) {
        try {
          console.log('iHomeFinder available, initializing widget with search results...');
          
          // Clear the container first
          containerRef.current.innerHTML = '';
          
          // Check if we have search parameters from the IDX search widget
          const hasSearchParams = searchParams.toString();
          console.log('Search parameters from IDX widget:', hasSearchParams);
          
          // Call ihfKestrel.render() directly - it will automatically handle search params
          const widgetElement = window.ihfKestrel.render();
          
          if (widgetElement && containerRef.current) {
            if (widgetElement instanceof HTMLElement) {
              containerRef.current.appendChild(widgetElement);
              console.log('iHomeFinder widget loaded successfully with search integration');
            } else if (typeof widgetElement === 'string') {
              const div = document.createElement('div');
              div.innerHTML = widgetElement;
              containerRef.current.appendChild(div);
              console.log('Widget rendered as HTML string with search integration');
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
  }, [searchParams]);

  // Handle button clicks from both IDXButtonInjector and Header
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

      {/* Property Action Header */}
      <PropertyActionHeader
        propertyData={propertyData}
        onScheduleTour={handleScheduleTour}
        onMakeOffer={handleMakeOffer}
        onFavorite={handleFavorite}
        isVisible={isHeaderVisible}
      />
      
      {/* Main Content Area - Full Width */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow-lg">
          <div className="p-4 lg:p-8">
            <div 
              ref={containerRef}
              className="w-full min-h-[800px] bg-white rounded-xl border border-gray-200 shadow-sm"
            >
              <div className="flex items-center justify-center h-32 text-gray-500">
                Loading MLS listings with search results...
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* IDX Button Injector */}
      <IDXButtonInjector
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
