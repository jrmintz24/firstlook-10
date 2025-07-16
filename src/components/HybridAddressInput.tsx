import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Edit3, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import AddressAutocomplete from "./AddressAutocomplete";

interface HybridAddressInputProps {
  value: string;
  onChange: (value: string) => void;
  propertyId?: string;
  isAutoDetected?: boolean;
  placeholder?: string;
  className?: string;
  label?: string;
  id?: string;
}

const HybridAddressInput = ({ 
  value, 
  onChange, 
  propertyId,
  isAutoDetected = false,
  placeholder = "Enter property address...", 
  className,
  label,
  id 
}: HybridAddressInputProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  // If we have a propertyId and this is auto-detected, show the display mode
  const showDisplayMode = propertyId && isAutoDetected && !isEditing;

  const handleEdit = () => {
    setTempValue(value);
    setIsEditing(true);
  };

  const handleSave = () => {
    onChange(tempValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempValue(value);
    setIsEditing(false);
  };

  const handleSwitchToAutocomplete = () => {
    setIsEditing(true);
  };

  if (showDisplayMode) {
    return (
      <div className={`space-y-2 ${className || ''}`}>
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-gray-900">
            {label}
          </label>
        )}
        
        <div className="relative">
          <div className="flex items-center gap-2 p-3 bg-green-50 border-2 border-green-200 rounded-lg">
            <MapPin className="h-5 w-5 text-green-600 flex-shrink-0" />
            <div className="flex-1">
              <span className="text-sm text-gray-900 font-medium">{value}</span>
              <p className="text-xs text-green-700 mt-1">
                Auto-detected from current property
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleEdit}
              className="h-8 w-8 p-0 hover:bg-green-100"
            >
              <Edit3 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleSwitchToAutocomplete}
          className="text-xs text-gray-600 hover:text-gray-900"
        >
          Use Different Address
        </Button>
      </div>
    );
  }

  if (isEditing && isAutoDetected) {
    return (
      <div className={`space-y-2 ${className || ''}`}>
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-gray-900">
            {label}
          </label>
        )}
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <MapPin className="h-5 w-5 text-gray-400" />
          </div>
          
          <Input
            id={id}
            type="text"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            placeholder={placeholder}
            className={cn(
              "pl-12 pr-20 h-12 rounded-lg border-2 border-gray-300 focus:border-black focus:ring-1 focus:ring-black transition-colors bg-white text-gray-900 placeholder:text-gray-500"
            )}
          />
          
          <div className="absolute inset-y-0 right-0 flex items-center gap-1 pr-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSave}
              className="h-8 w-8 p-0 hover:bg-green-100"
            >
              <Check className="h-4 w-4 text-green-600" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className="h-8 w-8 p-0 hover:bg-red-100"
            >
              <X className="h-4 w-4 text-red-600" />
            </Button>
          </div>
        </div>
        
        <p className="text-xs text-gray-500">
          Editing auto-detected address. Save changes or cancel to revert.
        </p>
      </div>
    );
  }

  // Default mode: use AddressAutocomplete for manual entry
  return (
    <AddressAutocomplete
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
      label={label}
      id={id}
    />
  );
};

export default HybridAddressInput;