import React, { useEffect, useState } from 'react';
import { Input } from "@/components/ui/input";
import AddressAutocomplete from "./AddressAutocomplete";
import { ExtractedPropertyData } from '@/utils/idxPropertyExtractor';

interface HybridAddressInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  label?: string;
  id?: string;
  onPropertyExtracted?: (propertyData: ExtractedPropertyData) => void;
}

const HybridAddressInput = ({ 
  value, 
  onChange, 
  placeholder = "Enter property address...", 
  className,
  label,
  id,
  onPropertyExtracted
}: HybridAddressInputProps) => {
  const [extractedData, setExtractedData] = useState<ExtractedPropertyData | null>(null);

  useEffect(() => {
    // Listen for IDX property extraction events
    const handlePropertyExtracted = (event: CustomEvent<ExtractedPropertyData>) => {
      console.log('🏠 [HybridAddressInput] Received extracted property data:', event.detail);
      setExtractedData(event.detail);
      
      // Auto-fill the address field with extracted data
      if (event.detail.address && !value) {
        onChange(event.detail.address);
      }
      
      // Notify parent component
      if (onPropertyExtracted) {
        onPropertyExtracted(event.detail);
      }
    };

    // Check for any existing extracted data
    const existingData = (window as any).extractedPropertyData;
    if (existingData && !extractedData) {
      console.log('🏠 [HybridAddressInput] Found existing extracted data:', existingData);
      setExtractedData(existingData);
      if (existingData.address && !value) {
        onChange(existingData.address);
      }
      if (onPropertyExtracted) {
        onPropertyExtracted(existingData);
      }
    }

    window.addEventListener('idxPropertyExtracted', handlePropertyExtracted as EventListener);
    
    return () => {
      window.removeEventListener('idxPropertyExtracted', handlePropertyExtracted as EventListener);
    };
  }, [value, onChange, onPropertyExtracted, extractedData]);

  // Default mode: use AddressAutocomplete with fallback to simple input
  return (
    <div className={`space-y-2 ${className || ''}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-900">
          {label}
        </label>
      )}
      
      {extractedData && (
        <div className="mb-2 p-2 bg-green-50 border border-green-200 rounded-md">
          <div className="flex items-center text-sm text-green-800">
            <span className="font-medium">✓ Property Auto-Detected:</span>
            <span className="ml-2">{extractedData.address}</span>
          </div>
          {extractedData.mlsId && (
            <div className="text-xs text-green-600 mt-1">
              MLS ID: {extractedData.mlsId}
            </div>
          )}
        </div>
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