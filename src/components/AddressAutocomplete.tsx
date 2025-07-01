
import React, { useState, useEffect } from 'react';
import { Combobox, ComboboxInput, ComboboxList, ComboboxOption, ComboboxPopover } from "@reach/combobox";
import "@reach/combobox/styles.css";
import { useDebounce } from "@/hooks/useDebounce";
import { supabase } from "@/integrations/supabase/client";

// Google API key for fallback requests when the Supabase
// edge function is unavailable.
const GOOGLE_PLACES_API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;

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
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [results, setResults] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  useEffect(() => {
    if (debouncedSearchTerm) {
      fetchAddresses(debouncedSearchTerm);
    } else {
      setResults([]);
    }
  }, [debouncedSearchTerm]);

  const fetchAddresses = async (searchTerm: string) => {
    console.log('🔍 Starting address search for:', searchTerm);

    try {
      console.log('📡 Making request to google-places edge function...');

      // Use Supabase client to invoke the edge function
      const { data, error } = await supabase.functions.invoke('google-places', {
        body: { input: searchTerm }
      });

      console.log('📡 Response received:', { data, error });

      if (error || !data || data.status !== 'OK') {
        throw error || new Error('Edge function error');
      }

      if (data.predictions) {
        const formattedAddresses = data.predictions.map((p: any) => p.description);
        console.log('✅ Formatted addresses:', formattedAddresses);
        setResults(formattedAddresses);
        setIsOpen(true);
        return;
      }
    } catch (edgeError) {
      console.error('❌ Edge function failed:', edgeError);

      // Fallback to direct Google Places API if key is provided
      if (GOOGLE_PLACES_API_KEY) {
        try {
          console.log('🌐 Fallback to Google Places API...');
          const url =
            `https://maps.googleapis.com/maps/api/place/autocomplete/json` +
            `?input=${encodeURIComponent(searchTerm)}` +
            `&types=address&components=country:us&key=${GOOGLE_PLACES_API_KEY}`;
          const response = await fetch(url);
          const googleData = await response.json();
          if (googleData.status === 'OK' && googleData.predictions) {
            const formatted = googleData.predictions.map((p: any) => p.description);
            setResults(formatted);
            setIsOpen(true);
            return;
          }
          console.error('❌ Google API error:', googleData);
        } catch (googleError) {
          console.error('❌ Error fetching from Google API:', googleError);
        }
      }

      setResults([]);
      setIsOpen(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    onChange(newValue);
    setIsOpen(true);
  };

  const handleSelect = (address: string) => {
    setSearchTerm(address);
    onChange(address);
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className || ''}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <Combobox onSelect={handleSelect}>
        <ComboboxInput
          id={id}
          value={searchTerm}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="w-full py-2 px-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        {isOpen && results.length > 0 && (
          <ComboboxPopover className="absolute z-10 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
            <ComboboxList>
              {results.map((result, index) => (
                <ComboboxOption key={index} value={result} className="px-3 py-2 hover:bg-gray-100 cursor-pointer" />
              ))}
            </ComboboxList> 
          </ComboboxPopover>
        )}
      </Combobox>
    </div>
  );
};

export default AddressAutocomplete;
