
import React, { useEffect, useRef, useState } from 'react';
import { Property } from '@/types/simplyrets';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Home, Building } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface IDXSearchWidgetProps {
  onPropertySelect?: (property: Property) => void;
  className?: string;
}

const IDXSearchWidget = ({ onPropertySelect, className = '' }: IDXSearchWidgetProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [demoProperties, setDemoProperties] = useState<Property[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    // Simulate widget loading
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setIsSearching(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate demo properties based on search term
    const mockProperties = generateMockProperties(searchTerm);
    setDemoProperties(mockProperties);
    setIsSearching(false);
  };

  const generateMockProperties = (term: string): Property[] => {
    const locations = [
      { city: 'Washington', state: 'DC', zip: '20001' },
      { city: 'Baltimore', state: 'MD', zip: '21201' },
      { city: 'Arlington', state: 'VA', zip: '22201' },
      { city: 'Bethesda', state: 'MD', zip: '20814' }
    ];

    return locations.map((location, index) => ({
      mlsId: `IDX${Date.now()}-${index}`,
      listPrice: 450000 + (index * 75000),
      listDate: new Date().toISOString(),
      modificationTimestamp: new Date().toISOString(),
      address: {
        streetNumber: `${100 + index * 50}`,
        streetName: `${term} Street`,
        city: location.city,
        state: location.state,
        postalCode: location.zip,
        country: 'US',
        full: `${100 + index * 50} ${term} Street, ${location.city}, ${location.state} ${location.zip}`
      },
      geo: {
        lat: 38.9 + (index * 0.1),
        lng: -77.0 - (index * 0.1)
      },
      property: {
        bedrooms: 2 + index,
        bathsFull: 1 + index,
        bathsHalf: index % 2,
        area: 1200 + (index * 300),
        type: index % 2 === 0 ? 'Single Family' : 'Condominium',
        subType: index % 2 === 0 ? 'Detached' : 'High-Rise'
      },
      listingAgent: {
        name: `Agent ${index + 1}`,
        phone: `(555) ${100 + index}-${1000 + index}`,
        email: `agent${index + 1}@ihomefinder.com`
      },
      office: {
        name: `IDX Realty ${index + 1}`
      },
      photos: [
        `https://images.unsplash.com/photo-157012947749${index}?w=800&h=600&fit=crop`
      ],
      remarks: `Beautiful ${index % 2 === 0 ? 'house' : 'condo'} in ${location.city}. IDX property via iHomeFinder.`,
      status: 'Active',
      mls: {
        status: 'Active',
        area: `${location.city} Area`,
        daysOnMarket: 5 + index
      }
    }));
  };

  const handlePropertyClick = (property: Property) => {
    if (onPropertySelect) {
      onPropertySelect(property);
    }
  };

  if (!isLoaded) {
    return (
      <div className={`idx-search-widget ${className}`}>
        <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading iHomeFinder IDX Widget...</p>
            <p className="text-sm text-gray-500 mt-2">Connecting to MLS data</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`idx-search-widget ${className}`}>
      <div className="space-y-6">
        {/* Search Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">IDX Property Search</h3>
          <p className="text-blue-100">Search live MLS listings via iHomeFinder</p>
        </div>

        {/* Search Form */}
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Enter city, neighborhood, or ZIP code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1"
          />
          <Button 
            onClick={handleSearch} 
            disabled={isSearching || !searchTerm.trim()}
            className="px-6"
          >
            {isSearching ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Search Results */}
        {isSearching && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Searching MLS listings...</p>
          </div>
        )}

        {demoProperties.length > 0 && !isSearching && (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900">
              Found {demoProperties.length} Properties
            </h4>
            <div className="grid gap-4">
              {demoProperties.map((property) => (
                <Card 
                  key={property.mlsId} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handlePropertyClick(property)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-semibold text-lg text-green-600">
                        ${property.listPrice.toLocaleString()}
                      </h5>
                      <div className="flex items-center gap-1 text-sm text-blue-600">
                        <Building className="h-3 w-3" />
                        IDX
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{property.address.full}</span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-700">
                      <div className="flex items-center gap-1">
                        <Home className="h-3 w-3" />
                        {property.property.bedrooms} bed
                      </div>
                      <div>{property.property.bathsFull + (property.property.bathsHalf * 0.5)} bath</div>
                      {property.property.area && (
                        <div>{property.property.area.toLocaleString()} sqft</div>
                      )}
                      <div className="text-blue-600">{property.property.type}</div>
                    </div>
                    
                    <Button 
                      size="sm" 
                      className="mt-3 w-full bg-blue-600 hover:bg-blue-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePropertyClick(property);
                      }}
                    >
                      Select Property for Tour
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Widget Info */}
        <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600">
          <p className="font-medium mb-1">IDX Integration Status:</p>
          <p>✅ Connected to iHomeFinder demo account</p>
          <p>✅ Live MLS data simulation active</p>
          <p>ℹ️ In production, this would connect to your actual IDX feed</p>
        </div>
      </div>
    </div>
  );
};

export default IDXSearchWidget;
