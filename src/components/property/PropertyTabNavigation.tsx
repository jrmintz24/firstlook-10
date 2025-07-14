
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PropertyActionButtons } from './PropertyActionButtons';
import { PropertyData } from '@/utils/propertyDataUtils';

interface PropertyTabNavigationProps {
  property?: PropertyData;
  onScheduleTour?: () => void;
  onMakeOffer?: () => void;
  onFavorite?: () => void;
  isFavorited?: boolean;
}

const PropertyTabNavigation: React.FC<PropertyTabNavigationProps> = ({
  property,
  onScheduleTour,
  onMakeOffer,
  onFavorite,
  isFavorited = false
}) => {
  const defaultProperty = {
    address: 'Property Details',
    price: '',
    beds: '',
    baths: '',
    mlsId: ''
  };

  const currentProperty = property || defaultProperty;

  return (
    <div className="sticky top-16 z-30 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-50 rounded-none border-0 h-12">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="actions" 
              className="data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none"
            >
              Actions
            </TabsTrigger>
            <TabsTrigger 
              value="details" 
              className="data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none"
            >
              Details
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-semibold text-gray-900 truncate">
                  {currentProperty.address}
                </h2>
                {currentProperty.price && (
                  <p className="text-sm text-gray-600">
                    {currentProperty.price}
                    {currentProperty.beds && currentProperty.baths && (
                      <span className="ml-2">
                        • {currentProperty.beds} bed • {currentProperty.baths} bath
                      </span>
                    )}
                  </p>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="actions" className="py-4">
            <div className="flex items-center justify-center">
              <PropertyActionButtons
                property={currentProperty}
                onScheduleTour={onScheduleTour || (() => {})}
                onMakeOffer={onMakeOffer || (() => {})}
                onFavorite={onFavorite || (() => {})}
                isFavorited={isFavorited}
                size="default"
                layout="horizontal"
                className="max-w-md"
              />
            </div>
          </TabsContent>

          <TabsContent value="details" className="py-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              {currentProperty.beds && (
                <div>
                  <span className="font-medium text-gray-900">Bedrooms:</span>
                  <p className="text-gray-600">{currentProperty.beds}</p>
                </div>
              )}
              {currentProperty.baths && (
                <div>
                  <span className="font-medium text-gray-900">Bathrooms:</span>
                  <p className="text-gray-600">{currentProperty.baths}</p>
                </div>
              )}
              {currentProperty.mlsId && (
                <div>
                  <span className="font-medium text-gray-900">MLS ID:</span>
                  <p className="text-gray-600">{currentProperty.mlsId}</p>
                </div>
              )}
              <div>
                <span className="font-medium text-gray-900">Status:</span>
                <p className="text-gray-600">Active</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PropertyTabNavigation;
