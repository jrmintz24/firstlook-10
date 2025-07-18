
import React, { useEffect, useRef } from 'react';
import { useGooglePlaces } from "@/hooks/useGooglePlaces";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { MapPin, Search, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  label?: string;
  id?: string;
  fallback?: React.ReactNode;
}

const AddressAutocomplete = ({ 
  value, 
  onChange, 
  placeholder = "Enter address, neighborhood, city, or ZIP code...", 
  className,
  label,
  id,
  fallback
}: AddressAutocompleteProps) => {
  const {
    searchTerm,
    setSearchTerm,
    debouncedSearchTerm,
    results,
    isLoading,
    error,
    fetchLocations,
    getPlaceDetails,
    clearResults,
    clearError
  } = useGooglePlaces();

  const [showResults, setShowResults] = React.useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Sync with external value only when it changes
  useEffect(() => {
    if (value !== searchTerm) {
      setSearchTerm(value);
    }
  }, [value]); // Removed setSearchTerm from dependencies to prevent infinite loop

  // Handle debounced search - removed clearResults from dependencies
  useEffect(() => {
    if (debouncedSearchTerm && debouncedSearchTerm.length > 2) {
      fetchLocations(debouncedSearchTerm);
    } else {
      clearResults();
      setShowResults(false);
    }
  }, [debouncedSearchTerm, fetchLocations]);

  useEffect(() => {
    if (results.length > 0) {
      setShowResults(true);
    }
  }, [results]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current && 
        resultsRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        !resultsRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    onChange(newValue);
    clearError();
  };

  const handleSelect = async (result: { description: string; place_id: string }) => {
    console.log('🏠 Selected place:', result);
    
    // First set the description immediately for better UX
    setSearchTerm(result.description);
    onChange(result.description);
    setShowResults(false);
    clearResults();
    
    // Then try to get full address details in the background
    try {
      const placeDetails = await getPlaceDetails(result.place_id);
      if (placeDetails && placeDetails.formatted_address) {
        console.log('🏠 Got full address:', placeDetails.formatted_address);
        // Update with the full formatted address
        setSearchTerm(placeDetails.formatted_address);
        onChange(placeDetails.formatted_address);
      }
    } catch (error) {
      console.error('Failed to get place details:', error);
      // Keep the original description if details fetch fails
    }
  };

  const handleInputFocus = () => {
    if (results.length > 0) {
      setShowResults(true);
    }
  };

  // If there's a persistent error and we have a fallback, show the fallback
  if (error && error.includes('API key configuration error') && fallback) {
    return <>{fallback}</>;
  }

  return (
    <div className={`relative ${className || ''}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-900 mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          {isLoading ? (
            <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
          ) : (
            <Search className="h-5 w-5 text-gray-400" />
          )}
        </div>
        
        <Input
          ref={inputRef}
          id={id}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          className={cn(
            "pl-12 pr-4 h-12 rounded-lg border-2 border-gray-300 focus:border-black focus:ring-1 focus:ring-black transition-colors bg-white text-gray-900 placeholder:text-gray-500",
            error && "border-red-400 focus:border-red-500 focus:ring-red-500"
          )}
        />
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          {error}
        </p>
      )}

      {showResults && results.length > 0 && (
        <Card 
          ref={resultsRef}
          className="absolute z-50 w-full mt-2 border-2 border-gray-200 rounded-lg shadow-xl bg-white max-h-60 overflow-y-auto"
        >
          <div className="py-2">
            {results.map((result, index) => (
              <button
                key={index}
                onClick={() => handleSelect(result)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors flex items-center gap-3 group"
              >
                <MapPin className="h-4 w-4 text-gray-400 group-hover:text-black transition-colors flex-shrink-0" />
                <span className="text-sm text-gray-900 group-hover:text-black transition-colors">
                  {result.description}
                </span>
              </button>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default AddressAutocomplete;
