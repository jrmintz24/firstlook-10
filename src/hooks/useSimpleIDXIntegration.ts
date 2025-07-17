import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

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
  const [propertyData, setPropertyData] = useState<IDXProperty | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
          user_id: userId,
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

  useEffect(() => {
    // Listen for property data from the simple extractor
    const handlePropertyData = (event: CustomEvent<IDXProperty>) => {
      console.log('[Simple IDX Hook] Received property data:', event.detail);
      setPropertyData(event.detail);
    };

    window.addEventListener('ihfPropertyDataReady', handlePropertyData as EventListener);
    
    // Check session storage for existing data
    const storedData = sessionStorage.getItem('ihfPropertyData');
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        setPropertyData(parsed);
      } catch (err) {
        console.error('[Simple IDX Hook] Failed to parse stored data:', err);
      }
    }

    return () => {
      window.removeEventListener('ihfPropertyDataReady', handlePropertyData as EventListener);
    };
  }, []);

  return {
    propertyData,
    isLoading,
    error,
    savePropertyToDatabase,
    favoriteProperty,
    scheduleShowingForProperty
  };
}