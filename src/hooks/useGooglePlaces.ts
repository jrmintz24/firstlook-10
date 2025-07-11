
import { useState } from 'react';
import { useDebounce } from "@/hooks/useDebounce";
import { supabase } from "@/integrations/supabase/client";

interface UseGooglePlacesOptions {
  debounceMs?: number;
  minSearchLength?: number;
}

export const useGooglePlaces = (options: UseGooglePlacesOptions = {}) => {
  const { debounceMs = 500, minSearchLength = 2 } = options;
  
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const debouncedSearchTerm = useDebounce(searchTerm, debounceMs);

  const fetchLocations = async (query: string) => {
    if (!query || query.length <= minSearchLength) {
      setResults([]);
      return;
    }

    console.log('🔍 Starting location search for:', query);
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('📡 Making request to google-places edge function...');
      
      const { data, error } = await supabase.functions.invoke('google-places', {
        body: { input: query }
      });

      console.log('📡 Response received:', { data, error });

      if (error) {
        console.error('❌ Error from edge function:', error);
        setError('Unable to search locations');
        setResults([]);
        return;
      }

      if (data && data.status === 'OK' && data.predictions) {
        const formattedLocations = data.predictions.map((prediction: any) => prediction.description);
        console.log('✅ Formatted locations:', formattedLocations);
        setResults(formattedLocations);
      } else if (data && data.status === 'ZERO_RESULTS') {
        console.log('🔍 No results found for:', query);
        setError('No locations found. Try a different search term.');
        setResults([]);
      } else if (data && data.error) {
        console.error('❌ Error from edge function:', data.error);
        setError('Location search unavailable');
        setResults([]);
      } else {
        console.error('❌ Error fetching locations:', data?.error_message || data?.status);
        setError('Search temporarily unavailable');
        setResults([]);
      }
    } catch (error) {
      console.error('❌ Error fetching locations:', error);
      setError('Search temporarily unavailable');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    searchTerm,
    setSearchTerm,
    debouncedSearchTerm,
    results,
    isLoading,
    error,
    fetchLocations,
    clearResults: () => setResults([]),
    clearError: () => setError(null)
  };
};
