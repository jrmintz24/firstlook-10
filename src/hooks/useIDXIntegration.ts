
import { useState, useCallback } from 'react';
import { Property } from '@/types/simplyrets';
import { idxPropertyService } from '@/services/idxPropertyService';
import { useToast } from '@/hooks/use-toast';

export const useIDXIntegration = () => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handlePropertySelect = useCallback(async (property: Property) => {
    setIsLoading(true);
    try {
      // Get full property details if needed
      const fullProperty = await idxPropertyService.getPropertyDetails(property.mlsId);
      const propertyToUse = fullProperty || property;
      
      setSelectedProperty(propertyToUse);
      
      toast({
        title: "Property Selected",
        description: `Selected property at ${propertyToUse.address.full}`,
      });
      
      return propertyToUse;
    } catch (error) {
      console.error('Error selecting IDX property:', error);
      toast({
        title: "Selection Error",
        description: "Failed to select property. Please try again.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const handleScheduleTour = useCallback((property: Property) => {
    // This will integrate with your existing PropertyRequestWizard
    setSelectedProperty(property);
    return property;
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedProperty(null);
  }, []);

  return {
    selectedProperty,
    isLoading,
    handlePropertySelect,
    handleScheduleTour,
    clearSelection
  };
};
