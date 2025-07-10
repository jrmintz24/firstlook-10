import { useState, useEffect } from "react"
import { SearchFilters } from "@/components/property/SearchFilters"
import { PropertyCard } from "@/components/property/PropertyCard"
import { MapView } from "@/components/property/MapView"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { supabase } from "@/integrations/supabase/client"
import { Property, SearchFilters as SearchFiltersType, SearchResponse } from "@/types/simplyrets"
import { useToast } from "@/hooks/use-toast"
import PropertyRequestWizard from "@/components/PropertyRequestWizard"
import { Loader2, Grid, Map, Home } from "lucide-react"

const Search = () => {
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [showTourWizard, setShowTourWizard] = useState(false)
  const [filters, setFilters] = useState<SearchFiltersType>({
    cities: 'Washington,Baltimore,Bethesda,Arlington,Alexandria,Silver Spring,Rockville,Gaithersburg,Annapolis',
    limit: 20
  })
  const { toast } = useToast()

  const searchProperties = async () => {
    setIsLoading(true)
    try {
      console.log('Searching with filters:', filters)
      
      const { data, error } = await supabase.functions.invoke('simplyrets-search', {
        body: { 
          endpoint: 'search',
          params: filters 
        }
      })

      if (error) {
        console.error('Search error:', error)
        throw new Error(error.message || 'Failed to search properties')
      }

      console.log('Search results:', data)
      
      const response = data as SearchResponse
      setProperties(response.properties || [])
      setHasSearched(true)
      
      toast({
        title: "Search Complete",
        description: `Found ${response.properties?.length || 0} properties`,
      })
      
    } catch (error) {
      console.error('Property search error:', error)
      toast({
        title: "Search Error",
        description: error instanceof Error ? error.message : "Failed to search properties",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleScheduleTour = (property: Property) => {
    setSelectedProperty(property)
    setShowTourWizard(true)
  }

  const handlePropertySelect = (property: Property) => {
    setSelectedProperty(property)
  }

  // Initial search on component mount
  useEffect(() => {
    searchProperties()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Home className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Property Search</h1>
              <p className="text-gray-600">Find your perfect home in the DC/Baltimore area</p>
            </div>
          </div>
        </div>

        {/* Search Filters */}
        <SearchFilters
          filters={filters}
          onFiltersChange={setFilters}
          onSearch={searchProperties}
          isLoading={isLoading}
        />

        {/* Results Section */}
        {hasSearched && (
          <div className="space-y-6">
            {/* Results Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {properties.length > 0 ? `${properties.length} Properties Found` : 'No Properties Found'}
                </h2>
                {properties.length > 0 && (
                  <p className="text-gray-600 text-sm mt-1">
                    Showing active listings in your search area
                  </p>
                )}
              </div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">Searching properties...</span>
              </div>
            ) : properties.length > 0 ? (
              <Tabs defaultValue="grid" className="w-full">
                <TabsList className="mb-6">
                  <TabsTrigger value="grid" className="flex items-center gap-2">
                    <Grid className="h-4 w-4" />
                    Grid View
                  </TabsTrigger>
                  <TabsTrigger value="map" className="flex items-center gap-2">
                    <Map className="h-4 w-4" />
                    Map View
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="grid">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {properties.map((property) => (
                      <PropertyCard
                        key={property.mlsId}
                        property={property}
                        onScheduleTour={handleScheduleTour}
                      />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="map">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Map */}
                    <div className="lg:col-span-1">
                      <MapView
                        properties={properties}
                        selectedProperty={selectedProperty}
                        onPropertySelect={handlePropertySelect}
                        height="600px"
                      />
                    </div>
                    
                    {/* Property List */}
                    <div className="lg:col-span-1 max-h-96 lg:max-h-[600px] overflow-y-auto space-y-4">
                      {properties.map((property) => (
                        <div
                          key={property.mlsId}
                          className={`border rounded-lg p-4 cursor-pointer transition-all ${
                            selectedProperty?.mlsId === property.mlsId
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => handlePropertySelect(property)}
                        >
                          <div className="flex gap-4">
                            {property.photos && property.photos[0] && (
                              <img
                                src={property.photos[0]}
                                alt={property.address.full}
                                className="w-24 h-24 object-cover rounded"
                              />
                            )}
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg">
                                ${property.listPrice.toLocaleString()}
                              </h3>
                              <p className="text-sm text-gray-600 mb-2">
                                {property.address.full}
                              </p>
                              <p className="text-sm text-gray-700">
                                {property.property.bedrooms} bed • {property.property.bathsFull + (property.property.bathsHalf * 0.5)} bath
                                {property.property.area && ` • ${property.property.area.toLocaleString()} sqft`}
                              </p>
                              <Button
                                size="sm"
                                className="mt-2"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleScheduleTour(property)
                                }}
                              >
                                Schedule Tour
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-500 mb-4">
                  <Home className="h-12 w-12 mx-auto mb-2" />
                  <p className="text-lg">No properties found</p>
                  <p className="text-sm">Try adjusting your search criteria</p>
                </div>
                <Button onClick={searchProperties} variant="outline">
                  Search Again
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Tour Request Wizard */}
        <PropertyRequestWizard
          isOpen={showTourWizard}
          onClose={() => {
            setShowTourWizard(false)
            setSelectedProperty(null)
          }}
        />
      </div>
    </div>
  )
}

export default Search