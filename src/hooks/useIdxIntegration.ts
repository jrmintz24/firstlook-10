
import { useEffect, useState } from 'react';

export interface IdxProperty {
  id: string;
  address: string;
  price: string;
  beds: string;
  baths: string;
  mlsId: string;
}

export const useIdxIntegration = (listingId?: string) => {
  const [property, setProperty] = useState<IdxProperty | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!listingId) {
      setLoading(false);
      return;
    }

    const fetchPropertyData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Try to extract property data from IDX widget if available
        if (window.ihfKestrel && (window as any).ihfKestrel.getProperty) {
          const propertyData = await (window as any).ihfKestrel.getProperty(listingId);
          if (propertyData) {
            setProperty({
              id: listingId,
              address: propertyData.address || `Property ${listingId}`,
              price: propertyData.price || 'Price Available Upon Request',
              beds: propertyData.beds || '',
              baths: propertyData.baths || '',
              mlsId: propertyData.mlsId || listingId
            });
            return;
          }
        }

        // Fallback: Create mock property data
        setProperty({
          id: listingId,
          address: `Property ${listingId}`,
          price: 'Loading...',
          beds: '',
          baths: '',
          mlsId: listingId
        });

      } catch (err) {
        console.error('Error fetching property data:', err);
        setError('Failed to load property information');
        
        // Still provide basic property data for UI
        setProperty({
          id: listingId,
          address: `Property ${listingId}`,
          price: 'Price Available Upon Request',
          beds: '',
          baths: '',
          mlsId: listingId
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyData();
  }, [listingId]);

  return { property, loading, error };
};
