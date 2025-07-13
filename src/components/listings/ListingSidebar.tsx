
import React, { useEffect, useState } from 'react';
import { Calendar, DollarSign, Heart, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { extractPropertyData, PropertyData } from '@/utils/idxCommunication';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

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
      <div className={`fixed right-0 top-0 h-full bg-white shadow-2xl z-40 transition-all duration-300 ease-in-out border-l border-gray-200 ${
        isCollapsed ? 'w-16' : 'w-80'
      } hidden lg:flex flex-col`}>
        
        {/* Collapse/Expand Toggle */}
        <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 z-50">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-8 h-8 rounded-full bg-white shadow-lg border-2 border-gray-200 hover:bg-gray-50 transition-all duration-200"
          >
            {isCollapsed ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 overflow-hidden">
          {!isCollapsed ? (
            // Expanded Sidebar Content
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Property Actions</h3>
                <p className="text-sm text-gray-500">Take action on this listing</p>
              </div>

              {/* Property Info Card */}
              {propertyData?.address && propertyData.address !== 'Property Address' && (
                <div className="p-6 border-b border-gray-100">
                  <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-indigo-50">
                    <CardHeader className="pb-3">
                      <h4 className="font-medium text-gray-900 text-sm leading-5 line-clamp-2">
                        {propertyData.address}
                      </h4>
                    </CardHeader>
                    <CardContent className="pt-0">
                      {propertyData.price && (
                        <p className="text-2xl font-bold text-gray-900 mb-2">
                          {propertyData.price}
                        </p>
                      )}
                      {propertyData.beds && propertyData.baths && (
                        <p className="text-sm text-gray-600">
                          {propertyData.beds} bed • {propertyData.baths} bath
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex-1 p-6">
                <div className="space-y-4">
                  <Button
                    onClick={handleScheduleTour}
                    className="w-full h-12 bg-gray-900 text-white hover:bg-black transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] rounded-xl font-medium"
                  >
                    <Calendar className="h-5 w-5 mr-3" />
                    Schedule Tour
                  </Button>
                  
                  <Button
                    onClick={handleMakeOffer}
                    className="w-full h-12 bg-gray-900 text-white hover:bg-black transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] rounded-xl font-medium"
                  >
                    <DollarSign className="h-5 w-5 mr-3" />
                    Make Offer
                  </Button>
                  
                  <Button
                    onClick={handleFavorite}
                    variant="outline"
                    className="w-full h-12 border-2 border-gray-300 text-gray-900 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-[1.02] rounded-xl font-medium"
                  >
                    <Heart className="h-5 w-5 mr-3" />
                    Save Favorite
                  </Button>
                </div>

                {/* Additional Info */}
                <div className="mt-8 p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 text-center leading-relaxed">
                    Need help with your search?<br />
                    Our agents are here to assist you.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            // Collapsed Sidebar Content
            <div className="h-full flex flex-col items-center py-6">
              <div className="space-y-4">
                <Button
                  onClick={handleScheduleTour}
                  size="sm"
                  className="w-12 h-12 bg-gray-900 text-white hover:bg-black transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 rounded-xl"
                  title="Schedule Tour"
                >
                  <Calendar className="h-5 w-5" />
                </Button>
                
                <Button
                  onClick={handleMakeOffer}
                  size="sm"
                  className="w-12 h-12 bg-gray-900 text-white hover:bg-black transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 rounded-xl"
                  title="Make Offer"
                >
                  <DollarSign className="h-5 w-5" />
                </Button>
                
                <Button
                  onClick={handleFavorite}
                  variant="outline"
                  size="sm"
                  className="w-12 h-12 border-2 border-gray-300 text-gray-900 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 rounded-xl"
                  title="Save Favorite"
                >
                  <Heart className="h-5 w-5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Floating Action Button */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50">
        <Card className="bg-gray-900 shadow-2xl border-0">
          <CardContent className="p-4">
            <div className="flex flex-col gap-3">
              <Button
                onClick={handleScheduleTour}
                size="sm"
                className="bg-white text-gray-900 hover:bg-gray-100 shadow-md rounded-xl font-medium h-10"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Tour
              </Button>
              
              <Button
                onClick={handleMakeOffer}
                size="sm"
                className="bg-white text-gray-900 hover:bg-gray-100 shadow-md rounded-xl font-medium h-10"
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Offer
              </Button>
              
              <Button
                onClick={handleFavorite}
                size="sm"
                variant="outline"
                className="bg-white border-gray-300 text-gray-900 hover:bg-gray-100 rounded-xl font-medium h-10"
              >
                <Heart className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ListingSidebar;
