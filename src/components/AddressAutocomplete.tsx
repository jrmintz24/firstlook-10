
import React, { useState, useEffect } from 'react';
import { useDebounce } from "@/hooks/useDebounce";
import { supabase } from "@/integrations/supabase/client";
import { Command, CommandInput, CommandList, CommandItem, CommandEmpty } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
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
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [results, setResults] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  useEffect(() => {
    if (debouncedSearchTerm && debouncedSearchTerm.length > 2) {
      fetchAddresses(debouncedSearchTerm);
    } else {
      setResults([]);
    }
  }, [debouncedSearchTerm]);

  const fetchAddresses = async (searchTerm: string) => {
    console.log('🔍 Starting address search for:', searchTerm);
    
    try {
      console.log('📡 Making request to google-places edge function...');
      
      const { data, error } = await supabase.functions.invoke('google-places', {
        body: { input: searchTerm }
      });

      console.log('📡 Response received:', { data, error });

      if (error) {
        console.error('❌ Error from edge function:', error);
        setResults([]);
        return;
      }

      if (data && data.status === 'OK' && data.predictions) {
        const formattedAddresses = data.predictions.map((prediction: any) => prediction.description);
        console.log('✅ Formatted addresses:', formattedAddresses);
        setResults(formattedAddresses);
      } else if (data && data.error) {
        console.error('❌ Error from edge function:', data.error);
        setResults([]);
      } else {
        console.error('❌ Error fetching addresses:', data?.error_message || data?.status);
        setResults([]);
      }
    } catch (error) {
      console.error('❌ Error fetching addresses:', error);
      setResults([]);
    }
  };

  const handleSelect = (address: string) => {
    setSearchTerm(address);
    onChange(address);
    setOpen(false);
  };

  return (
    <div className={`relative ${className || ''}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {value || placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput
              placeholder={placeholder}
              value={searchTerm}
              onValueChange={(search) => {
                setSearchTerm(search);
                onChange(search);
              }}
            />
            <CommandList>
              <CommandEmpty>No addresses found.</CommandEmpty>
              {results.map((result, index) => (
                <CommandItem
                  key={index}
                  value={result}
                  onSelect={() => handleSelect(result)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === result ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {result}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default AddressAutocomplete;
