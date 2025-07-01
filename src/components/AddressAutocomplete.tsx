
import React, { useState, useEffect } from 'react';
import { Combobox, ComboboxInput, ComboboxList, ComboboxOption, ComboboxPopover } from "@reach/combobox";
import "@reach/combobox/styles.css";
import { useDebounce } from "@/hooks/useDebounce";
import { supabase } from "@/integrations/supabase/client";

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

      if (error) {
        console.error('❌ Error from edge function:', error);
        setResults([]);
        setIsOpen(false);
        return;
      }

      if (data && data.status === 'OK' && data.predictions) {
        const formattedAddresses = data.predictions.map((prediction: any) => prediction.description);
        console.log('✅ Formatted addresses:', formattedAddresses);
        setResults(formattedAddresses);
        setIsOpen(true);
      } else if (data && data.error) {
        console.error('❌ Error from edge function:', data.error);
        setResults([]);
        setIsOpen(false);
      } else {
        console.error('❌ Error fetching addresses:', data?.error_message || data?.status);
        setResults([]);
        setIsOpen(false);
      }
    } catch (error) {
      console.error('❌ Error fetching addresses:', error);
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
