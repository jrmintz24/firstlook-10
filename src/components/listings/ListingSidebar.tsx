
import React, { useEffect, useState } from 'react';
import { Calendar, DollarSign, Heart, X } from 'lucide-react';
import { extractPropertyData, PropertyData } from '@/utils/idxCommunication';
import { Button } from "@/components/ui/button";

interface ListingSidebarProps {
  onScheduleTour: (propertyData: PropertyData) => void;
  onMakeOffer: (propertyData: PropertyData) => void;
  onFavorite: (propertyData: PropertyData) => void;
}

const ListingSidebar: React.FC<ListingSidebarProps> = ({
  onScheduleTour,
  onMakeOffer,
  onFavorite
}) => {
  const [propertyData, setPropertyData] = useState<PropertyData | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 20;
    
    const extractData = () => {
      retryCount++;
      console.log(`ListingSidebar: Attempting to extract property data (attempt ${retryCount})`);
      
      const data = extractPropertyData();
      
      // Check if we have meaningful property data
      if (data.address && data.address.length > 10) {
        setPropertyData(data);
        setIsVisible(true);
        console.log('ListingSidebar: Property data extracted successfully:', data);
        return;
      }
      
      if (retryCount < maxRetries) {
        setTimeout(extractData, 1000);
      } else {
        console.log('ListingSidebar: Max retries reached, showing basic sidebar');
        // Show sidebar even without full data
        setPropertyData({
          address: 'Property Address',
          price: '',
          beds: '',
          baths: '',
          mlsId: ''
        });
        setIsVisible(true);
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

  const handleScheduleTour = () => {
    const currentData = propertyData || {
      address: 'Current Property',
      price: '',
      beds: '',
      baths: '',
      mlsId: ''
    };
    console.log('ListingSidebar: Schedule Tour clicked with data:', currentData);
    onScheduleTour(currentData);
  };

  const handleMakeOffer = () => {
    const currentData = propertyData || {
      address: 'Current Property',
      price: '',
      beds: '',
      baths: '',
      mlsId: ''
    };
    console.log('ListingSidebar: Make Offer clicked with data:', currentData);
    onMakeOffer(currentData);
  };

  const handleFavorite = () => {
    const currentData = propertyData || {
      address: 'Current Property',
      price: '',
      beds: '',
      baths: '',
      mlsId: ''
    };
    console.log('ListingSidebar: Favorite clicked with data:', currentData);
    onFavorite(currentData);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`fixed right-0 top-0 h-full bg-white border-l border-border shadow-xl z-40 transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-16' : 'w-80'
      } hidden lg:flex flex-col`}>
        
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <h3 className="text-lg font-semibold text-foreground">Property Actions</h3>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2"
            >
              {isCollapsed ? <Calendar className="h-4 w-4" /> : <X className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Property Info */}
        {!isCollapsed && propertyData?.address && propertyData.address !== 'Property Address' && (
          <div className="p-6 border-b border-border">
            <div className="space-y-2">
              <h4 className="font-medium text-foreground text-sm leading-5">
                {propertyData.address}
              </h4>
              {propertyData.price && (
                <p className="text-2xl font-bold text-foreground">
                  {propertyData.price}
                </p>
              )}
              {propertyData.beds && propertyData.baths && (
                <p className="text-sm text-muted-foreground">
                  {propertyData.beds} bed • {propertyData.baths} bath
                </p>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex-1 p-6">
          <div className="space-y-4">
            <Button
              onClick={handleScheduleTour}
              className={`w-full bg-gray-900 text-white hover:bg-black transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                isCollapsed ? 'p-3' : 'py-3 px-4'
              }`}
              size={isCollapsed ? "sm" : "default"}
            >
              <Calendar className={`${isCollapsed ? 'h-4 w-4' : 'h-5 w-5 mr-2'}`} />
              {!isCollapsed && 'Schedule Tour'}
            </Button>
            
            <Button
              onClick={handleMakeOffer}
              className={`w-full bg-gray-900 text-white hover:bg-black transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                isCollapsed ? 'p-3' : 'py-3 px-4'
              }`}
              size={isCollapsed ? "sm" : "default"}
            >
              <DollarSign className={`${isCollapsed ? 'h-4 w-4' : 'h-5 w-5 mr-2'}`} />
              {!isCollapsed && 'Make Offer'}
            </Button>
            
            <Button
              onClick={handleFavorite}
              variant="outline"
              className={`w-full border-2 border-gray-300 text-gray-900 hover:bg-gray-100 hover:border-gray-400 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 ${
                isCollapsed ? 'p-3' : 'py-3 px-4'
              }`}
              size={isCollapsed ? "sm" : "default"}
            >
              <Heart className={`${isCollapsed ? 'h-4 w-4' : 'h-5 w-5 mr-2'}`} />
              {!isCollapsed && 'Favorite'}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Floating Action Button */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50">
        <div className="bg-gray-900 rounded-2xl shadow-lg p-4">
          <div className="flex flex-col gap-3">
            <Button
              onClick={handleScheduleTour}
              size="sm"
              className="bg-white text-gray-900 hover:bg-gray-100 shadow-md"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Tour
            </Button>
            
            <Button
              onClick={handleMakeOffer}
              size="sm"
              className="bg-white text-gray-900 hover:bg-gray-100 shadow-md"
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Offer
            </Button>
            
            <Button
              onClick={handleFavorite}
              size="sm"
              variant="outline"
              className="bg-white border-gray-300 text-gray-900 hover:bg-gray-100"
            >
              <Heart className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ListingSidebar;
