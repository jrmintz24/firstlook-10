import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface IDXProperty {
  id?: string;
  mlsId: string;
  listingId?: string;
  address: string;
  city?: string;
  state?: string;
  zip?: string;
  price?: string;
  beds?: string;
  baths?: string;
  sqft?: string;
  lotSize?: string;
  yearBuilt?: string;
  propertyType?: string;
  status?: string;
  description?: string;
  features?: string[];
  images?: string[];
  virtualTourUrl?: string;
  latitude?: string;
  longitude?: string;
  agentName?: string;
  agentPhone?: string;
  agentEmail?: string;
  pageUrl?: string;
  extractedAt: string;
}

export function useIDXPropertyEnhanced() {
  const [property, setProperty] = useState<IDXProperty | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  // Check if property is already favorited
  const checkIfFavorited = useCallback(async (mlsId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data } = await supabase
        .from('property_favorites')
        .select('id')
        .eq('buyer_id', user.id)
        .eq('mls_id', mlsId)
        .single();

      return !!data;
    } catch {
      return false;
    }
  }, []);

  // Save property data to Supabase
  const savePropertyToDatabase = useCallback(async (propertyData: IDXProperty) => {
    try {
      console.log('Saving property to database:', propertyData.mlsId);
      
      const { data, error } = await supabase.functions.invoke('upsert-idx-property', {
        body: { property: propertyData }
      });

      if (error) throw error;
      
      console.log('Property saved successfully:', data);
      return data.propertyId;
    } catch (err) {
      console.error('Failed to save property to database:', err);
      return null;
    }
  }, []);

  // Handle property data from iHomeFinder
  const handlePropertyData = useCallback(async (data: IDXProperty) => {
    console.log('Handling property data:', data);
    setProperty(data);
    setLoading(false);

    // Save to database if we have MLS ID
    if (data.mlsId) {
      await savePropertyToDatabase(data);
      const favorited = await checkIfFavorited(data.mlsId);
      setIsSaved(favorited);
    }
  }, [savePropertyToDatabase, checkIfFavorited]);

  // Listen for property data
  useEffect(() => {
    console.log('Setting up property data listeners');
    
    // Check for existing data
    if (window.ihfPropertyData) {
      console.log('Found existing window.ihfPropertyData');
      handlePropertyData(window.ihfPropertyData as IDXProperty);
    }

    // Check sessionStorage
    const storedData = sessionStorage.getItem('ihfPropertyData');
    if (storedData && !property) {
      try {
        const parsed = JSON.parse(storedData);
        console.log('Found stored property data');
        handlePropertyData(parsed);
      } catch (e) {
        console.error('Failed to parse stored property data:', e);
      }
    }

    // Listen for custom event
    const handleEvent = (event: CustomEvent) => {
      console.log('Received ihfPropertyDataReady event');
      if (event.detail) {
        handlePropertyData(event.detail);
      }
    };

    // Listen for postMessage (iframe communication)
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'ihfPropertyData' && event.data?.data) {
        console.log('Received property data via postMessage');
        handlePropertyData(event.data.data);
      }
    };

    window.addEventListener('ihfPropertyDataReady', handleEvent as EventListener);
    window.addEventListener('message', handleMessage);

    // Set timeout to stop loading if no data found
    const timeout = setTimeout(() => {
      if (!property) {
        console.log('No property data found after timeout');
        setLoading(false);
        setError('Property data not found');
      }
    }, 5000);

    return () => {
      window.removeEventListener('ihfPropertyDataReady', handleEvent as EventListener);
      window.removeEventListener('message', handleMessage);
      clearTimeout(timeout);
    };
  }, [handlePropertyData, property]);

  // Toggle favorite status
  const toggleFavorite = useCallback(async () => {
    if (!property?.mlsId) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Please sign in to save properties');
      }

      if (isSaved) {
        // Remove favorite
        const { error } = await supabase
          .from('property_favorites')
          .delete()
          .eq('buyer_id', user.id)
          .eq('mls_id', property.mlsId);

        if (error) throw error;
        setIsSaved(false);
      } else {
        // First get the idx_property_id from database
        const { data: savedProperty } = await supabase
          .from('idx_properties')
          .select('id')
          .eq('mls_id', property.mlsId)
          .single();

        // Add favorite
        const { error } = await supabase
          .from('property_favorites')
          .insert({
            buyer_id: user.id,
            property_address: property.address,
            mls_id: property.mlsId,
            idx_property_id: savedProperty?.id || null,
            notes: ''
          });

        if (error) throw error;
        setIsSaved(true);
      }
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
      throw err;
    }
  }, [property, isSaved]);

  // Schedule showing with enhanced property data
  const scheduleShowing = useCallback(async (showingData: any) => {
    if (!property) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Please sign in to schedule a showing');
      }

      // Include IDX property data in showing request
      const { error } = await supabase
        .from('showing_requests')
        .insert({
          ...showingData,
          user_id: user.id,
          property_address: property.address,
          mls_id: property.mlsId,
          idx_property_id: property.id
        });

      if (error) throw error;

      return true;
    } catch (err) {
      console.error('Failed to schedule showing:', err);
      throw err;
    }
  }, [property]);

  return {
    property,
    loading,
    error,
    isSaved,
    toggleFavorite,
    scheduleShowing
  };
}