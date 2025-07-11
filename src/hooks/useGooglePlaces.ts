
import { useState, useCallback, useRef } from 'react';
import { useDebounce } from "@/hooks/useDebounce";
import { supabase } from "@/integrations/supabase/client";

interface UseGooglePlacesOptions {
  debounceMs?: number;
  minSearchLength?: number;
}

interface CacheEntry {
  results: string[];
  timestamp: number;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const MAX_REQUESTS_PER_MINUTE = 10;

export const useGooglePlaces = (options: UseGooglePlacesOptions = {}) => {
  const { debounceMs = 1000, minSearchLength = 2 } = options; // Increased debounce to 1000ms
  
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const debouncedSearchTerm = useDebounce(searchTerm, debounceMs);
  
  // Cache and rate limiting refs
  const cacheRef = useRef<Map<string, CacheEntry>>(new Map());
  const requestCountRef = useRef<number>(0);
  const lastResetTimeRef = useRef<number>(Date.now());
  const abortControllerRef = useRef<AbortController | null>(null);

  // Reset request count every minute
  const resetRequestCount = useCallback(() => {
    const now = Date.now();
    if (now - lastResetTimeRef.current >= 60000) {
      requestCountRef.current = 0;
      lastResetTimeRef.current = now;
    }
  }, []);

  const fetchLocations = useCallback(async (query: string) => {
    if (!query || query.length <= minSearchLength) {
      setResults([]);
      return;
    }

    // Check cache first
    const cachedEntry = cacheRef.current.get(query);
    if (cachedEntry && Date.now() - cachedEntry.timestamp < CACHE_DURATION) {
      console.log('🎯 Using cached results for:', query);
      setResults(cachedEntry.results);
      return;
    }

    // Check rate limiting
    resetRequestCount();
    if (requestCountRef.current >= MAX_REQUESTS_PER_MINUTE) {
      console.log('⚠️ Rate limit exceeded, skipping request');
      setError('Too many requests. Please wait a moment.');
      return;
    }

    // Cancel previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    console.log('🔍 Starting location search for:', query);
    setIsLoading(true);
    setError(null);
    
    try {
      requestCountRef.current++;
      console.log('📡 Making request to google-places edge function...');
      
      const { data, error } = await supabase.functions.invoke('google-places', {
        body: { input: query }
      });

      // Check if request was aborted
      if (abortControllerRef.current?.signal.aborted) {
        return;
      }

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
        
        // Cache the results
        cacheRef.current.set(query, {
          results: formattedLocations,
          timestamp: Date.now()
        });
        
        setResults(formattedLocations);
      } else if (data && data.status === 'ZERO_RESULTS') {
        console.log('🔍 No results found for:', query);
        setError('No locations found. Try a different search term.');
        setResults([]);
      } else if (data && data.error) {
        console.error('❌ Error from edge function:', data.error);
        if (data.error.includes('rate-limit')) {
          setError('Search rate limit exceeded. Please wait a moment.');
        } else {
          setError('Location search unavailable');
        }
        setResults([]);
      } else {
        console.error('❌ Error fetching locations:', data?.error_message || data?.status);
        setError('Search temporarily unavailable');
        setResults([]);
      }
    } catch (error) {
      // Check if request was aborted
      if (abortControllerRef.current?.signal.aborted) {
        return;
      }
      
      console.error('❌ Error fetching locations:', error);
      setError('Search temporarily unavailable');
      setResults([]);
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [minSearchLength, resetRequestCount]);

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
