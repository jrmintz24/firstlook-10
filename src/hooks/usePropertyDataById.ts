import { useState, useEffect } from 'react';
import { fetchPropertyDataById, PropertyData } from '../services/propertyDataService';

/**
 * Hook to fetch property data by property ID
 */
export const usePropertyDataById = (propertyId?: string) => {
  const [propertyData, setPropertyData] = useState<PropertyData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!propertyId) {
      setPropertyData(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    fetchPropertyDataById(propertyId)
      .then(data => {
        setPropertyData(data);
        if (!data) {
          setError('Property not found');
        }
      })
      .catch(err => {
        console.error('Error fetching property data:', err);
        setError(err.message || 'Failed to fetch property data');
        setPropertyData(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [propertyId]);

  return {
    propertyData,
    isLoading,
    error,
    refetch: () => {
      if (propertyId) {
        setIsLoading(true);
        setError(null);
        fetchPropertyDataById(propertyId)
          .then(setPropertyData)
          .catch(err => {
            setError(err.message || 'Failed to fetch property data');
            setPropertyData(null);
          })
          .finally(() => setIsLoading(false));
      }
    }
  };
};