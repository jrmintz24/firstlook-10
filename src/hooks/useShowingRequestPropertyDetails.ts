import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PropertyDetails {
  id: string;
  address: string;
  price: number | null;
  beds: number | null;
  baths: number | null;
  sqft: number | null;
  images: string[] | null;
  ihf_page_url: string | null;
}

interface ShowingWithProperty {
  id: string;
  property_address: string;
  idx_property_id: string | null;
  propertyDetails?: PropertyDetails | null;
}

export function useShowingRequestPropertyDetails(showings: ShowingWithProperty[]) {
  const [showingsWithDetails, setShowingsWithDetails] = useState<ShowingWithProperty[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const fetchPropertyDetails = async () => {
      if (!showings.length) {
        setShowingsWithDetails([]);
        return;
      }

      setLoading(true);
      setError(null);
      
      // Set a timeout to prevent infinite loading
      timeoutId = setTimeout(() => {
        console.warn('[useShowingRequestPropertyDetails] Timeout reached, using showings without details');
        setShowingsWithDetails(showings);
        setLoading(false);
      }, 5000); // 5 second timeout

      try {
        // Get unique property IDs that need details
        const propertyIds = showings
          .map(s => s.idx_property_id)
          .filter((id): id is string => !!id);

        let propertyDetailsMap = new Map<string, PropertyDetails>();

        if (propertyIds.length > 0) {
          console.log('[useShowingRequestPropertyDetails] Fetching property details for IDs:', propertyIds);

          // Fetch property details from idx_properties table
          const { data: properties, error: propertiesError } = await supabase
            .from('idx_properties')
            .select('id, address, price, beds, baths, sqft, images, ihf_page_url')
            .in('id', propertyIds);

          if (propertiesError) {
            console.error('[useShowingRequestPropertyDetails] Error fetching properties:', propertiesError);
            throw propertiesError;
          }

          // Create a map for quick lookup
          properties?.forEach(property => {
            propertyDetailsMap.set(property.id, {
              id: property.id,
              address: property.address,
              price: property.price,
              beds: property.beds,
              baths: property.baths,
              sqft: property.sqft,
              images: Array.isArray(property.images) ? property.images : null,
              ihf_page_url: property.ihf_page_url
            });
          });

          console.log('[useShowingRequestPropertyDetails] Fetched property details:', properties?.length || 0);
        }

        // Combine showings with their property details
        const enhanced = showings.map(showing => ({
          ...showing,
          propertyDetails: showing.idx_property_id 
            ? propertyDetailsMap.get(showing.idx_property_id) || null
            : null
        }));

        clearTimeout(timeoutId); // Clear timeout on success
        setShowingsWithDetails(enhanced);
      } catch (err) {
        console.error('[useShowingRequestPropertyDetails] Error:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch property details');
        clearTimeout(timeoutId); // Clear timeout on error
        setShowingsWithDetails(showings); // Return original data on error
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyDetails();
    
    // Cleanup timeout on unmount or when showings change
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [showings]);

  return {
    showingsWithDetails,
    loading,
    error
  };
}