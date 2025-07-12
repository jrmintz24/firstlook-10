
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, ExternalLink } from 'lucide-react';
import IDXSearchWidget from '@/components/idx/IDXSearchWidget';
import { useIDXIntegration } from '@/hooks/useIDXIntegration';
import { Property } from '@/types/simplyrets';

const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const { selectedProperty, handlePropertySelect } = useIDXIntegration();

  // Handle pre-loaded search results from home page
  useEffect(() => {
    if (location.state?.searchResult) {
      const { searchResult } = location.state;
      setSearchTerm(searchResult.searchTerm);
    }
    
    // Handle URL search parameters
    const urlParams = new URLSearchParams(location.search);
    const queryTerm = urlParams.get('q');
    if (queryTerm) {
      setSearchTerm(queryTerm);
    }
  }, [location]);

  const handleIDXPropertySelect = (property: Property) => {
    handlePropertySelect(property);
    // Navigate to property details or listings page
    navigate(`/property/${property.mlsId}`);
  };

  const handleViewListings = () => {
    navigate('/listings');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Property Search
          </h1>
          {searchTerm && (
            <p className="text-gray-600">
              Searching for properties in: <span className="font-semibold">{searchTerm}</span>
            </p>
          )}
        </div>

        {/* IDX Integration Info */}
        <Alert className="mb-6 bg-blue-50 border-blue-200">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Live MLS Data:</strong> Search real estate listings directly from the MLS. 
            All properties are current and updated in real-time through our IDX integration.
          </AlertDescription>
        </Alert>

        {/* Navigation to Full Listings */}
        <div className="mb-6">
          <Button 
            onClick={handleViewListings}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            View Full Property Listings
          </Button>
        </div>

        {/* IDX Search Widget */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <IDXSearchWidget 
            onPropertySelect={handleIDXPropertySelect}
            className="w-full"
          />
        </div>

        {/* Selected Property Info */}
        {selectedProperty && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800">
              <strong>Selected Property:</strong> {selectedProperty.address.full}
            </p>
            <p className="text-sm text-green-600 mt-1">
              Click "View Full Property Listings" to see more details and schedule a showing.
            </p>
          </div>
        )}

        {/* MLS Compliance */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            The data relating to real estate for sale on this website comes in part from the MLS. 
            All information deemed reliable but not guaranteed and should be independently verified.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Search;
