
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import AddressAutocomplete from './AddressAutocomplete';

interface PlaceholderSearchWidgetProps {
  className?: string;
}

const PlaceholderSearchWidget = ({ className = "" }: PlaceholderSearchWidgetProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedPlaceData, setSelectedPlaceData] = useState<any>(null);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      // If no search term, just go to listings
      navigate('/listings');
      return;
    }

    setIsSearching(true);
    
    // Create search parameters with enhanced location data
    const searchParams = new URLSearchParams();
    searchParams.set('search', searchTerm.trim());
    
    // Add structured location data if available from Google Places
    if (selectedPlaceData) {
      searchParams.set('place_data', JSON.stringify({
        description: selectedPlaceData.description,
        place_id: selectedPlaceData.place_id,
        formatted_address: selectedPlaceData.formatted_address,
        location_type: getLocationType(searchTerm)
      }));
    } else {
      // Try to infer location type from search term
      const locationType = getLocationType(searchTerm);
      if (locationType !== 'unknown') {
        searchParams.set('location_type', locationType);
      }
    }
    
    navigate(`/listings?${searchParams.toString()}`);
    
    // Reset loading state after a brief delay
    setTimeout(() => setIsSearching(false), 1000);
  };

  // Helper function to determine location type
  const getLocationType = (term: string): string => {
    const lowerTerm = term.toLowerCase().trim();
    
    // ZIP code pattern
    if (/^\d{5}(-\d{4})?$/.test(lowerTerm)) {
      return 'zipcode';
    }
    
    // Address pattern (has numbers)
    if (/^\d+\s/.test(lowerTerm)) {
      return 'address';
    }
    
    // City patterns (common city indicators)
    if (lowerTerm.includes(' city') || lowerTerm.includes(', ') || 
        lowerTerm.match(/\b(city|town|village|borough)\b/)) {
      return 'city';
    }
    
    // Neighborhood patterns
    if (lowerTerm.includes('neighborhood') || lowerTerm.includes('district') ||
        lowerTerm.includes('area') || lowerTerm.includes('heights') ||
        lowerTerm.includes('hills') || lowerTerm.includes('park') ||
        lowerTerm.includes('grove') || lowerTerm.includes('woods')) {
      return 'neighborhood';
    }
    
    return 'unknown';
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleAddressChange = (value: string) => {
    setSearchTerm(value);
    
    // Clear selected place data if user is manually typing
    if (selectedPlaceData && selectedPlaceData.description !== value) {
      setSelectedPlaceData(null);
    }
  };

  const handlePlaceSelect = (placeData: any) => {
    console.log('🏠 Place selected in search widget:', placeData);
    setSelectedPlaceData(placeData);
  };

  return (
    <div className={`w-full max-w-2xl mx-auto ${className}`}>
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <AddressAutocomplete
              value={searchTerm}
              onChange={handleAddressChange}
              onPlaceSelect={handlePlaceSelect}
              placeholder="Enter city, neighborhood, address, or ZIP code"
              className="w-full"
              fallback={
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Enter city, address, or ZIP code"
                    className="w-full pl-10 h-12 text-base border-2 border-gray-300 focus:border-black focus:ring-1 focus:ring-black transition-colors bg-white text-gray-900 placeholder:text-gray-500 rounded-lg"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                </div>
              }
            />
          </div>
          <Button 
            size="lg" 
            className="bg-gray-900 hover:bg-black text-white px-8 h-12 text-base font-medium shadow-lg rounded-lg disabled:opacity-50"
            onClick={handleSearch}
            disabled={isSearching}
          >
            {isSearching ? 'Searching...' : 'Search Properties'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PlaceholderSearchWidget;
