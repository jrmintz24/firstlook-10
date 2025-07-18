import React from 'react';
import { Input } from "@/components/ui/input";
import AddressAutocomplete from "./AddressAutocomplete";

interface HybridAddressInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  label?: string;
  id?: string;
}

const HybridAddressInput = ({ 
  value, 
  onChange, 
  placeholder = "Enter property address...", 
  className,
  label,
  id
}: HybridAddressInputProps) => {
  // Simple, clean address input - no complex property extraction
  return (
    <div className={`space-y-2 ${className || ''}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-900">
          {label}
        </label>
      )}
      
      <AddressAutocomplete
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full"
        // Fallback to simple input if API fails
        fallback={
          <Input
            id={id}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full"
          />
        }
      />
    </div>
  );
};

export default HybridAddressInput;