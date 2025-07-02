
import React, { useState, useEffect, useRef } from 'react';
import { useDebounce } from "@/hooks/useDebounce";
import { supabase } from "@/integrations/supabase/client";
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
}

const AddressAutocomplete = ({ 
  value, 
  onChange, 
  placeholder = "Enter an address...", 
  className,
  label,
  id 
}: AddressAutocompleteProps) => {
  const [searchTerm, setSearchTerm] = useState(value);
  const [results, setResults] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  useEffect(() => {
    if (debouncedSearchTerm && debouncedSearchTerm.length > 2) {
      fetchAddresses(debouncedSearchTerm);
    } else {
      setResults([]);
      setShowResults(false);
    }
  }, [debouncedSearchTerm]);

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

  const fetchAddresses = async (searchTerm: string) => {
    console.log('🔍 Starting address search for:', searchTerm);
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('📡 Making request to google-places edge function...');
      
      const { data, error } = await supabase.functions.invoke('google-places', {
        body: { input: searchTerm }
      });

      console.log('📡 Response received:', { data, error });

      if (error) {
        console.error('❌ Error from edge function:', error);
        setError('Unable to search addresses');
        setResults([]);
        return;
      }

      if (data && data.status === 'OK' && data.predictions) {
        const formattedAddresses = data.predictions.map((prediction: any) => prediction.description);
        console.log('✅ Formatted addresses:', formattedAddresses);
        setResults(formattedAddresses);
        setShowResults(true);
      } else if (data && data.error) {
        console.error('❌ Error from edge function:', data.error);
        setError('Address search unavailable');
        setResults([]);
      } else {
        console.error('❌ Error fetching addresses:', data?.error_message || data?.status);
        setError('No addresses found');
        setResults([]);
      }
    } catch (error) {
      console.error('❌ Error fetching addresses:', error);
      setError('Search temporarily unavailable');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    onChange(newValue);
    setError(null);
  };

  const handleSelect = (address: string) => {
    setSearchTerm(address);
    onChange(address);
    setShowResults(false);
    setResults([]);
  };

  const handleInputFocus = () => {
    if (results.length > 0) {
      setShowResults(true);
    }
  };

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
                  {result}
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
