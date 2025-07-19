import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ExtractedPropertyData {
  mlsId: string;
  address: string;
  fullAddress: string;
  city: string;
  state: string;
  zip: string;
  price: string;
  beds: string;
  baths: string;
  sqft: string;
  images: string[];
  pageUrl: string;
  extractedAt: string;
}

export const useAutomaticPropertySaver = () => {
  useEffect(() => {
    console.log('[AutoPropertySaver] Initializing automatic property saver...');

    const savePropertyToDatabase = async (propertyData: ExtractedPropertyData) => {
      try {
        console.log('[AutoPropertySaver] Saving property to database:', propertyData);

        // Clean and format the data
        const cleanPrice = propertyData.price?.replace(/[^\d.]/g, '') || '0';
        const cleanBeds = propertyData.beds?.replace(/[^\d]/g, '') || '0';
        const cleanBaths = propertyData.baths?.replace(/[^\d.]/g, '') || '0';
        const cleanSqft = propertyData.sqft?.replace(/[^\d]/g, '') || '0';

        const propertyRecord = {
          mls_id: propertyData.mlsId,
          address: propertyData.fullAddress || propertyData.address,
          city: propertyData.city || '',
          state: propertyData.state || 'CA',
          zip: propertyData.zip || '',
          price: parseFloat(cleanPrice) || 0,
          beds: parseInt(cleanBeds) || 0,
          baths: parseFloat(cleanBaths) || 0,
          sqft: parseInt(cleanSqft) || 0,
          property_type: 'Single Family Residential',
          status: 'Active',
          description: `Property located at ${propertyData.address}`,
          images: propertyData.images || [],
          ihf_page_url: propertyData.pageUrl,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        // Insert or update property
        const { data: insertData, error: insertError } = await supabase
          .from('idx_properties')
          .upsert(propertyRecord, {
            onConflict: 'mls_id',
            ignoreDuplicates: false
          })
          .select()
          .single();

        if (insertError) {
          console.error('[AutoPropertySaver] Error saving property:', insertError);
          return null;
        }

        console.log('[AutoPropertySaver] ✅ Property saved successfully:', insertData);

        // Now link any existing showing requests to this property
        await linkShowingRequestsToProperty(propertyData.address, insertData.id);

        return insertData;
      } catch (error) {
        console.error('[AutoPropertySaver] Error in savePropertyToDatabase:', error);
        return null;
      }
    };

    const linkShowingRequestsToProperty = async (propertyAddress: string, propertyId: string) => {
      try {
        console.log('[AutoPropertySaver] Linking showing requests for address:', propertyAddress);

        // Find showing requests that match this address but don't have property links
        const { data: showingRequests, error: fetchError } = await supabase
          .from('showing_requests')
          .select('id, property_address')
          .eq('property_address', propertyAddress)
          .is('idx_property_id', null);

        if (fetchError) {
          console.error('[AutoPropertySaver] Error fetching showing requests:', fetchError);
          return;
        }

        if (showingRequests && showingRequests.length > 0) {
          console.log('[AutoPropertySaver] Found', showingRequests.length, 'showing requests to link');

          // Update all matching showing requests
          const { data: updateData, error: updateError } = await supabase
            .from('showing_requests')
            .update({ idx_property_id: propertyId })
            .eq('property_address', propertyAddress)
            .is('idx_property_id', null);

          if (updateError) {
            console.error('[AutoPropertySaver] Error linking showing requests:', updateError);
          } else {
            console.log('[AutoPropertySaver] ✅ Successfully linked', showingRequests.length, 'showing requests to property');
          }
        }
      } catch (error) {
        console.error('[AutoPropertySaver] Error in linkShowingRequestsToProperty:', error);
      }
    };

    // Listen for property data from iHomeFinder extractor
    const handlePropertyDataReady = (event: CustomEvent<ExtractedPropertyData>) => {
      console.log('[AutoPropertySaver] Property data ready event received:', event.detail);
      
      if (event.detail && (event.detail.mlsId || event.detail.address)) {
        savePropertyToDatabase(event.detail);
      }
    };

    // Listen for property data from iframe messages
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'ihfPropertyData' && event.data?.data) {
        console.log('[AutoPropertySaver] Property data received via message:', event.data.data);
        savePropertyToDatabase(event.data.data);
      }
    };

    // Check for existing global property data
    const checkExistingData = () => {
      if (window.ihfPropertyData) {
        console.log('[AutoPropertySaver] Found existing property data on page load:', window.ihfPropertyData);
        savePropertyToDatabase(window.ihfPropertyData as ExtractedPropertyData);
      }
    };

    // Set up event listeners
    window.addEventListener('ihfPropertyDataReady', handlePropertyDataReady as EventListener);
    window.addEventListener('message', handleMessage);

    // Check for existing data
    checkExistingData();

    // Cleanup
    return () => {
      window.removeEventListener('ihfPropertyDataReady', handlePropertyDataReady as EventListener);
      window.removeEventListener('message', handleMessage);
    };
  }, []);
};

// Extend window interface
declare global {
  interface Window {
    ihfPropertyData?: {
      address: string;
      fullAddress: string;
      city: string;
      state: string;
      zip: string;
      price: string;
      beds: string;
      baths: string;
      sqft: string;
      mlsId: string;
      extractedAt: string;
    };
  }
}