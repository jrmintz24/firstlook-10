import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useIDXPropertyExtractor } from './useIDXPropertyExtractor';

interface IDXProperty {
  mlsId: string;
  address: string;
  price?: string;
  beds?: string;
  baths?: string;
  sqft?: string;
  images?: string[];
  property_type?: string;
  status?: string;
  city?: string;
  state?: string;
}

export function useSimpleIDXIntegration() {
  const { propertyData: extractedData, isLoading: extractorLoading, error: extractorError } = useIDXPropertyExtractor();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Convert extracted data to our interface
  const propertyData: IDXProperty | null = extractedData ? {
    mlsId: extractedData.mlsId || '',
    address: extractedData.address || '',
    price: extractedData.price || '',
    beds: extractedData.beds || '',
    baths: extractedData.baths || '',
    sqft: extractedData.sqft || '',
    images: [],
    property_type: extractedData.propertyType || '',
    status: 'active',
    city: '',
    state: ''
  } : null;

  const savePropertyToDatabase = async (property: IDXProperty) => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('[Simple IDX Hook] Saving property:', property);

      const response = await supabase.functions.invoke('upsert-idx-property', {
        body: { property }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      console.log('[Simple IDX Hook] Property saved successfully:', response.data);
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save property';
      console.error('[Simple IDX Hook] Save error:', errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const favoriteProperty = async (property: IDXProperty, userId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // First save the property data
      const savedProperty = await savePropertyToDatabase(property);
      
      // Then create the favorite
      const { data, error } = await supabase
        .from('property_favorites')
        .insert({
          buyer_id: userId,
          idx_property_id: savedProperty.propertyId,
          mls_id: property.mlsId,
          property_address: property.address,
          favorited_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      console.log('[Simple IDX Hook] Property favorited:', data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to favorite property';
      console.error('[Simple IDX Hook] Favorite error:', errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const scheduleShowingForProperty = async (property: IDXProperty, userId: string, showingDetails: any) => {
    try {
      setIsLoading(true);
      setError(null);

      // First save the property data
      const savedProperty = await savePropertyToDatabase(property);
      
      // Then create the showing request
      const { data, error } = await supabase
        .from('showing_requests')
        .insert({
          user_id: userId,
          idx_property_id: savedProperty.propertyId,
          mls_id: property.mlsId,
          property_address: property.address,
          ...showingDetails,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      console.log('[Simple IDX Hook] Showing scheduled:', data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to schedule showing';
      console.error('[Simple IDX Hook] Schedule error:', errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    propertyData,
    isLoading: isLoading || extractorLoading,
    error: error || extractorError,
    savePropertyToDatabase,
    favoriteProperty,
    scheduleShowingForProperty
  };
}