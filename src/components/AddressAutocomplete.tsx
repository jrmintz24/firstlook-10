
import React, { useState, useEffect } from 'react';
import { Combobox, ComboboxInput, ComboboxList, ComboboxOption, ComboboxPopover } from "@reach/combobox";
import "@reach/combobox/styles.css";
import { useDebounce } from "@/hooks/useDebounce";

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
    try {
      // Use the Supabase edge function instead of direct Google API call
      const response = await fetch('https://uugchegukccccuqpcsqhl.supabase.co/functions/v1/google-places', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: searchTerm })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === 'OK' && data.predictions) {
        const formattedAddresses = data.predictions.map((prediction: any) => prediction.description);
        setResults(formattedAddresses);
        setIsOpen(true);
      } else if (data.error) {
        console.error('Error from edge function:', data.error);
        setResults([]);
        setIsOpen(false);
      } else {
        console.error('Error fetching addresses:', data.error_message || data.status);
        setResults([]);
        setIsOpen(false);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
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
