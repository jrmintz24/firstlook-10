import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useIDXPropertyExtractor } from './useIDXPropertyExtractor';

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
  const { propertyData: extractedData, isLoading: extractorLoading, error: extractorError } = useIDXPropertyExtractor();
  const [property, setProperty] = useState<IDXProperty | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  // Convert extracted data to our interface and update state
  useEffect(() => {
    if (extractedData) {
      console.log('🔍 [useIDXPropertyEnhanced] Converting extracted data:', extractedData);
      const convertedProperty: IDXProperty = {
        mlsId: extractedData.mlsId || '',
        address: extractedData.address || '',
        price: extractedData.price || '',
        beds: extractedData.beds || '',
        baths: extractedData.baths || '',
        sqft: extractedData.sqft || '',
        propertyType: extractedData.propertyType || '',
        extractedAt: new Date().toISOString(),
        pageUrl: window.location.href
      };
      setProperty(convertedProperty);
      setLoading(false);
      setError(null);
    } else if (extractorError) {
      setError(extractorError);
      setLoading(false);
    } else {
      setLoading(extractorLoading);
    }
  }, [extractedData, extractorLoading, extractorError]);

  // Check if property is already favorited
  const checkIfFavorited = useCallback(async (mlsId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      console.log('🔍 [checkIfFavorited] Checking MLS ID:', mlsId);
      
      const { data, error } = await supabase
        .from('property_favorites')
        .select('id')
        .eq('buyer_id', user.id)
        .eq('mls_id', mlsId)
        .maybeSingle();

      if (error) {
        console.error('🚨 [checkIfFavorited] Error:', error);
        return false;
      }

      console.log('✅ [checkIfFavorited] Result:', !!data);
      return !!data;
    } catch (err) {
      console.error('🚨 [checkIfFavorited] Exception:', err);
      return false;
    }
  }, []);

  // Save property data to Supabase
  const savePropertyToDatabase = useCallback(async (propertyData: IDXProperty) => {
    try {
      console.log('🔍 [savePropertyToDatabase] Saving property to database:', propertyData.mlsId);
      console.log('🔍 [savePropertyToDatabase] Property data:', propertyData);
      
      const { data, error } = await supabase.functions.invoke('upsert-idx-property', {
        body: { property: propertyData }
      });

      if (error) {
        console.error('🚨 [savePropertyToDatabase] Function error:', error);
        throw error;
      }
      
      console.log('✅ [savePropertyToDatabase] Property saved successfully:', data);
      return data.propertyId;
    } catch (err) {
      console.error('🚨 [savePropertyToDatabase] Failed to save property:', err);
      return null;
    }
  }, []);

  // Check if property is favorited when property data changes
  useEffect(() => {
    if (property?.mlsId) {
      checkIfFavorited(property.mlsId).then(setIsSaved);
    }
  }, [property?.mlsId, checkIfFavorited]);

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
        // First save the property using our upsert function
        console.log('🔍 [toggleFavorite] Saving property to database first...');
        const propertyId = await savePropertyToDatabase(property);
        
        if (!propertyId) {
          throw new Error('Failed to save property to database');
        }

        // Add favorite
        const { error } = await supabase
          .from('property_favorites')
          .insert({
            buyer_id: user.id,
            property_address: property.address,
            mls_id: property.mlsId,
            idx_property_id: propertyId,
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