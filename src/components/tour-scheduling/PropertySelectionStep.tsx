import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Clock, MapPin, Plus, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import HybridAddressInput from '@/components/HybridAddressInput';
import { useSuggestedProperties } from '@/hooks/useSuggestedProperties';

interface PropertySelectionStepProps {
  userId?: string;
  onPropertySelect: (address: string) => void;
  initialAddress?: string;
}

const PropertySelectionStep: React.FC<PropertySelectionStepProps> = ({
  userId,
  onPropertySelect,
  initialAddress = ""
}) => {
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualAddress, setManualAddress] = useState(initialAddress);
  const { properties, loading } = useSuggestedProperties(userId);

  const handlePropertyClick = (address: string) => {
    onPropertySelect(address);
  };

  const handleManualSubmit = () => {
    if (manualAddress.trim()) {
      onPropertySelect(manualAddress.trim());
    }
  };

  const formatAddress = (address: string) => {
    // Truncate long addresses for display
    return address.length > 35 ? `${address.substring(0, 35)}...` : address;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Which property would you like to tour?
        </h3>
        <p className="text-sm text-gray-600">
          Choose from your saved properties or enter a new address
        </p>
      </div>

      {/* Suggested Properties */}
      {properties.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Heart className="h-4 w-4" />
            Suggested Properties
          </div>
          <div className="space-y-2">
            {properties.map((property) => (
              <Card 
                key={property.id} 
                className="cursor-pointer hover:shadow-md transition-shadow border-gray-200 hover:border-blue-300"
                onClick={() => handlePropertyClick(property.address)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5",
                        property.source === 'favorite' 
                          ? "bg-red-100 text-red-600" 
                          : "bg-blue-100 text-blue-600"
                      )}>
                        {property.source === 'favorite' ? (
                          <Heart className="h-4 w-4" />
                        ) : (
                          <Clock className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-1 mb-1">
                          <MapPin className="h-3 w-3 text-gray-400 mt-0.5 flex-shrink-0" />
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {formatAddress(property.address)}
                          </p>
                        </div>
                        <p className="text-xs text-gray-500">
                          {property.source === 'favorite' ? 'Favorite Property' : 'Recently Requested'}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Manual Address Input */}
      <div className="space-y-3">
        {!showManualInput ? (
          <Button
            type="button"
            variant="outline"
            className="w-full flex items-center justify-center gap-2 py-3 border-dashed border-2 hover:border-blue-300 hover:bg-blue-50"
            onClick={() => setShowManualInput(true)}
          >
            <Plus className="h-4 w-4" />
            Enter Different Property Address
          </Button>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Plus className="h-4 w-4" />
              Enter Property Address
            </div>
            <div className="space-y-3">
              <HybridAddressInput
                value={manualAddress}
                onChange={setManualAddress}
                placeholder="Enter property address..."
                className="w-full"
                autoFocus
              />
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowManualInput(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleManualSubmit}
                  disabled={!manualAddress.trim()}
                  className="flex-1"
                >
                  Continue
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Empty State */}
      {properties.length === 0 && !showManualInput && (
        <div className="text-center py-8">
          <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">No recent properties found</p>
          <Button
            type="button"
            onClick={() => setShowManualInput(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Enter Property Address
          </Button>
        </div>
      )}
    </div>
  );
};

export default PropertySelectionStep;