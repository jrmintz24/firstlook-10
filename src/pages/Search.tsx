
import { useState, useEffect } from "react"
import { ModernSearchFilters } from "@/components/property/ModernSearchFilters"
import { PropertyCard } from "@/components/property/PropertyCard"
import { MapView } from "@/components/property/MapView"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { supabase } from "@/integrations/supabase/client"
import { Property, SearchFilters as SearchFiltersType, SearchResponse } from "@/types/simplyrets"
import { useToast } from "@/hooks/use-toast"
import PropertyRequestWizard from "@/components/PropertyRequestWizard"
import { Loader2, Grid, Map, AlertCircle, RefreshCw } from "lucide-react"

const Search = () => {
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [showTourWizard, setShowTourWizard] = useState(false)
  const [filters, setFilters] = useState<SearchFiltersType>({
    cities: 'Washington,Baltimore,Bethesda,Arlington,Alexandria,Silver Spring,Rockville,Gaithersburg,Annapolis',
    limit: 20
  })
  const { toast } = useToast()

  const searchProperties = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      console.log('Starting property search with filters:', filters)
      
      const { data, error } = await supabase.functions.invoke('simplyrets-search', {
        body: { 
          endpoint: 'search',
          params: filters 
        }
      })

      if (error) {
        console.error('Supabase function error:', error)
        setError(`Search failed: ${error.message}`)
        toast({
          title: "Search Error",
          description: error.message || "Failed to search properties",
          variant: "destructive"
        })
        return
      }

      console.log('Search results received:', data)
      
      if (!data) {
        setError('No data received from search')
        return
      }

      const response = data as SearchResponse
      const propertiesArray = response.properties || []
      
      setProperties(propertiesArray)
      setHasSearched(true)
      
      toast({
        title: "Search Complete",
        description: `Found ${propertiesArray.length} properties`,
      })
      
    } catch (error) {
      console.error('Property search error:', error)
      const errorMessage = error instanceof Error ? error.message : "Failed to search properties"
      setError(errorMessage)
      toast({
        title: "Search Error",
        description: errorMessage,
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

  const retrySearch = () => {
    setError(null)
    searchProperties()
  }

  // Initial search on component mount
  useEffect(() => {
    searchProperties()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Modern Search */}
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-[60vh] flex items-center justify-center">
        {/* Background Image Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')"
          }}
        />
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-light text-white mb-4">
              Find the best place
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Discover your perfect home in the DC/Baltimore area with our comprehensive property search
            </p>
          </div>

          {/* Modern Search Card */}
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <ModernSearchFilters
                filters={filters}
                onFiltersChange={setFilters}
                onSearch={searchProperties}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="container mx-auto px-4 py-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>{error}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={retrySearch}
                className="ml-4"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Results Section */}
      {hasSearched && (
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            {/* Results Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">
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
            ) : !error && (
              <div className="text-center py-12">
                <div className="text-gray-500 mb-4">
                  <Grid className="h-12 w-12 mx-auto mb-2" />
                  <p className="text-lg">No properties found</p>
                  <p className="text-sm">Try adjusting your search criteria</p>
                </div>
                <Button onClick={searchProperties} variant="outline">
                  Search Again
                </Button>
              </div>
            )}
          </div>
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
  )
}

export default Search
