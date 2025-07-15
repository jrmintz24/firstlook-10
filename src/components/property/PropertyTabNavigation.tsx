
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PropertyActionButtons } from './PropertyActionButtons';
import { PropertyData } from '@/utils/propertyDataUtils';
import { Eye, Zap, Info, Bed, Bath, Hash, Home } from 'lucide-react';

interface PropertyTabNavigationProps {
  property?: PropertyData;
  onScheduleTour?: () => void;
  onMakeOffer?: () => void;
  onFavorite?: () => void;
  isFavorited?: boolean;
  isLoading?: boolean;
}

const PropertyTabNavigation: React.FC<PropertyTabNavigationProps> = ({
  property,
  onScheduleTour,
  onMakeOffer,
  onFavorite,
  isFavorited = false,
  isLoading = false
}) => {
  const defaultProperty = {
    address: 'Property Details',
    price: '',
    beds: '',
    baths: '',
    mlsId: ''
  };

  const currentProperty = property || defaultProperty;

  // Format price with commas
  const formatPrice = (price: string) => {
    if (!price) return '';
    const numericPrice = price.replace(/[^\d]/g, '');
    if (numericPrice) {
      return '$' + parseInt(numericPrice).toLocaleString();
    }
    return price;
  };

  return (
    <div className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b shadow-sm">
      <div className="container mx-auto px-4">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-muted/50 rounded-none border-0 h-14">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none transition-all duration-200 flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger 
              value="actions" 
              className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none transition-all duration-200 flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              <span className="hidden sm:inline">Actions</span>
            </TabsTrigger>
            <TabsTrigger 
              value="details" 
              className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none transition-all duration-200 flex items-center gap-2"
            >
              <Info className="w-4 h-4" />
              <span className="hidden sm:inline">Details</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="py-6">
            {isLoading ? (
              <div className="animate-pulse space-y-3">
                <div className="h-6 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-bold text-foreground mb-2">
                    {currentProperty.address}
                  </h2>
                  {currentProperty.price && (
                    <p className="text-2xl font-semibold text-primary mb-3">
                      {formatPrice(currentProperty.price)}
                    </p>
                  )}
                  {(currentProperty.beds || currentProperty.baths) && (
                    <div className="flex items-center gap-4 text-muted-foreground">
                      {currentProperty.beds && (
                        <div className="flex items-center gap-1">
                          <Bed className="w-4 h-4" />
                          <span>{currentProperty.beds} bed{currentProperty.beds !== '1' ? 's' : ''}</span>
                        </div>
                      )}
                      {currentProperty.baths && (
                        <div className="flex items-center gap-1">
                          <Bath className="w-4 h-4" />
                          <span>{currentProperty.baths} bath{currentProperty.baths !== '1' ? 's' : ''}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="actions" className="py-6">
            {isLoading ? (
              <div className="animate-pulse flex justify-center">
                <div className="h-12 bg-muted rounded w-64"></div>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <PropertyActionButtons
                  property={currentProperty}
                  onScheduleTour={onScheduleTour || (() => {})}
                  onMakeOffer={onMakeOffer || (() => {})}
                  onFavorite={onFavorite || (() => {})}
                  isFavorited={isFavorited}
                  size="default"
                  layout="horizontal"
                  className="max-w-md w-full"
                />
              </div>
            )}
          </TabsContent>

          <TabsContent value="details" className="py-6">
            {isLoading ? (
              <div className="animate-pulse grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 bg-muted rounded w-20"></div>
                    <div className="h-4 bg-muted rounded w-16"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {currentProperty.beds && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Bed className="w-5 h-5 text-primary" />
                    <div>
                      <span className="font-medium text-foreground block">Bedrooms</span>
                      <p className="text-muted-foreground text-sm">{currentProperty.beds}</p>
                    </div>
                  </div>
                )}
                {currentProperty.baths && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Bath className="w-5 h-5 text-primary" />
                    <div>
                      <span className="font-medium text-foreground block">Bathrooms</span>
                      <p className="text-muted-foreground text-sm">{currentProperty.baths}</p>
                    </div>
                  </div>
                )}
                {currentProperty.mlsId && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Hash className="w-5 h-5 text-primary" />
                    <div>
                      <span className="font-medium text-foreground block">MLS ID</span>
                      <p className="text-muted-foreground text-sm">{currentProperty.mlsId}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Home className="w-5 h-5 text-primary" />
                  <div>
                    <span className="font-medium text-foreground block">Status</span>
                    <p className="text-muted-foreground text-sm">Active</p>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PropertyTabNavigation;
