import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useAutomaticIDXPropertySaver() {
  const hasProcessedProperty = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Listen for iHomeFinder property data events
    const handlePropertyDataReady = async (event: CustomEvent) => {
      const propertyData = event.detail;
      
      if (!propertyData?.mlsId || !propertyData?.address) {
        console.log('[AutoSaver] Insufficient property data, skipping save');
        return;
      }

      // Avoid duplicate processing
      const propertyKey = `${propertyData.mlsId}-${propertyData.address}`;
      if (hasProcessedProperty.current.has(propertyKey)) {
        console.log('[AutoSaver] Property already processed:', propertyKey);
        return;
      }

      try {
        console.log('[AutoSaver] Automatically saving property:', propertyData.mlsId);
        
        // Save to database via upsert function
        const { data, error } = await supabase.functions.invoke('upsert-idx-property', {
          body: { property: propertyData }
        });

        if (error) {
          console.error('[AutoSaver] Failed to save property:', error);
          return;
        }

        hasProcessedProperty.current.add(propertyKey);
        console.log('[AutoSaver] Property saved successfully:', data.propertyId);

        // Optionally backfill any existing favorites/showings for this property
        await backfillExistingRecords(propertyData, data.propertyId);

      } catch (err) {
        console.error('[AutoSaver] Error saving property:', err);
      }
    };

    // Listen for iframe messages (if iHomeFinder is in iframe)
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'ihfPropertyData') {
        handlePropertyDataReady(new CustomEvent('ihfPropertyDataReady', { 
          detail: event.data.data 
        }));
      }
    };

    // Check for existing property data on page load
    const checkExistingData = () => {
      if (window.ihfPropertyData) {
        handlePropertyDataReady(new CustomEvent('ihfPropertyDataReady', { 
          detail: window.ihfPropertyData 
        }));
      }

      // Check sessionStorage for cached data
      const cachedData = sessionStorage.getItem('ihfPropertyData');
      if (cachedData) {
        try {
          const parsed = JSON.parse(cachedData);
          handlePropertyDataReady(new CustomEvent('ihfPropertyDataReady', { 
            detail: parsed 
          }));
        } catch (e) {
          console.warn('[AutoSaver] Failed to parse cached property data');
        }
      }
    };

    // Set up event listeners
    window.addEventListener('ihfPropertyDataReady', handlePropertyDataReady as EventListener);
    window.addEventListener('message', handleMessage);

    // Initial check
    checkExistingData();

    // Periodic check for new data
    const checkInterval = setInterval(checkExistingData, 3000);

    return () => {
      window.removeEventListener('ihfPropertyDataReady', handlePropertyDataReady as EventListener);
      window.removeEventListener('message', handleMessage);
      clearInterval(checkInterval);
    };
  }, []);

  const backfillExistingRecords = async (propertyData: any, propertyId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Backfill favorites
      const { error: favError } = await supabase
        .from('property_favorites')
        .update({ idx_property_id: propertyId })
        .eq('buyer_id', user.id)
        .or(`property_address.eq.${propertyData.address},mls_id.eq.${propertyData.mlsId}`)
        .is('idx_property_id', null);

      if (favError) {
        console.warn('[AutoSaver] Failed to backfill favorites:', favError);
      } else {
        console.log('[AutoSaver] Backfilled favorites for property:', propertyId);
      }

      // Backfill showing requests
      const { error: showError } = await supabase
        .from('showing_requests')
        .update({ idx_property_id: propertyId })
        .eq('user_id', user.id)
        .or(`property_address.eq.${propertyData.address},mls_id.eq.${propertyData.mlsId}`)
        .is('idx_property_id', null);

      if (showError) {
        console.warn('[AutoSaver] Failed to backfill showing requests:', showError);
      } else {
        console.log('[AutoSaver] Backfilled showing requests for property:', propertyId);
      }

    } catch (error) {
      console.error('[AutoSaver] Error during backfill:', error);
    }
  };
}