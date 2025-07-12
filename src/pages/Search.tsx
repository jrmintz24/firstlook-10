import { useState, useEffect } from "react"
import { EnhancedSearchFilters } from "@/components/property/EnhancedSearchFilters"
import { PropertyCard } from "@/components/property/PropertyCard"
import { IDXPropertyCard } from "@/components/idx/IDXPropertyCard"
import IDXSearchWidget from "@/components/idx/IDXSearchWidget"
import { MapView } from "@/components/property/MapView"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Property, SearchFilters as SearchFiltersType } from "@/types/simplyrets"
import { useToast } from "@/hooks/use-toast"
import PropertyRequestWizard from "@/components/PropertyRequestWizard"
import MLSComplianceFooter from "@/components/MLSComplianceFooter"
import { useIDXIntegration } from "@/hooks/useIDXIntegration"
import { Loader2, Grid, Map, AlertCircle, RefreshCw, Info, ArrowLeft, Search as SearchIcon } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
import { searchProperties, SearchResult } from "@/services/propertySearchService"
import { idxPropertyService } from "@/services/idxPropertyService"

const SearchPage = () => {
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [showTourWizard, setShowTourWizard] = useState(false)
  const [isDemoMode, setIsDemoMode] = useState(true)
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null)
  const [fromHomePage, setFromHomePage] = useState(false)
  const [searchSource, setSearchSource] = useState<'demo' | 'idx'>('idx')
  const [filters, setFilters] = useState<SearchFiltersType>({
    cities: undefined,
    limit: 20
  })
  
  const { toast } = useToast()
  const location = useLocation()
  const navigate = useNavigate()
  const { handlePropertySelect, handleScheduleTour } = useIDXIntegration()

  useEffect(() => {
    const state = location.state as { searchResult?: SearchResult; fromHomePage?: boolean } | null;
    
    if (state?.searchResult && state?.fromHomePage) {
      setSearchResult(state.searchResult);
      setProperties(state.searchResult.properties);
      setHasSearched(true);
      setFromHomePage(true);
      setFilters(prev => ({
        ...prev,
        cities: state.searchResult.searchTerm
      }));
      
      navigate(location.pathname + `?q=${encodeURIComponent(state.searchResult.searchTerm)}`, { 
        replace: true, 
        state: null 
      });
      return;
    }

    const urlParams = new URLSearchParams(location.search);
    const query = urlParams.get('q');
    
    if (query && !hasSearched) {
      setFilters(prev => ({
        ...prev,
        cities: query
      }));
      searchPropertiesWithQuery(query);
    }
  }, [location.search, location.state, hasSearched, navigate]);

  const searchPropertiesWithQuery = async (query?: string, source: 'demo' | 'idx' = searchSource) => {
    setIsLoading(true)
    setError(null)
    
    try {
      console.log(`Starting ${source} property search with filters:`, query ? { ...filters, cities: query } : filters)
      
      const searchFilters = query ? { ...filters, cities: query } : filters
      let result: any;

      if (source === 'idx') {
        // For IDX, we rely on the widget for search results
        // The widget will handle property selection directly
        result = {
          properties: [],
          totalCount: 0,
          searchTerm: searchFilters.cities || 'IDX Widget Search'
        };
      } else {
        result = await searchProperties(searchFilters);
      }
      
      setSearchResult(result);
      setProperties(result.properties);
      setHasSearched(true);
      setSearchSource(source);
      
      if (source === 'idx') {
        toast({
          title: "IDX Widget Ready",
          description: "Use the iHomeFinder widget below to search live MLS listings",
        });
      } else {
        toast({
          title: "Search Complete",
          description: `Found ${result.totalCount} properties (Demo Mode)`,
        });
      }
      
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

  const searchPropertiesHandler = async () => {
    await searchPropertiesWithQuery()
  }

  const handleScheduleTourFromCard = (property: Property) => {
    setSelectedProperty(property)
    setShowTourWizard(true)
  }

  const handlePropertySelectFromCard = (property: Property) => {
    setSelectedProperty(property)
  }

  const retrySearch = () => {
    setError(null)
    searchPropertiesHandler()
  }

  const handleBackToHome = () => {
    navigate('/')
  }

  const switchSearchSource = (source: 'demo' | 'idx') => {
    setSearchSource(source)
    if (hasSearched) {
      searchPropertiesWithQuery(filters.cities, source)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-[60vh] flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')"
          }}
        />
        
        <div className="relative z-10 container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            {fromHomePage && (
              <div className="flex items-center justify-center mb-4">
                <Button
                  variant="ghost"
                  onClick={handleBackToHome}
                  className="text-gray-300 hover:text-white flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Home
                </Button>
              </div>
            )}
            <h1 className="text-5xl md:text-6xl font-light text-white mb-4">
              {searchResult ? `Results for "${searchResult.searchTerm}"` : 'Find the best place'}
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              {searchResult 
                ? `${searchResult.totalCount} properties found in your search area`
                : 'Discover your perfect home in the DC/Baltimore area with our comprehensive property search'
              }
            </p>
          </div>

          <div className="flex justify-center mb-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-1 flex items-center gap-1">
              <Button
                variant={searchSource === 'idx' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => switchSearchSource('idx')}
                className={searchSource === 'idx' ? 'bg-white text-gray-900' : 'text-white hover:bg-white/20'}
              >
                iHomeFinder IDX
              </Button>
              <Button
                variant={searchSource === 'demo' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => switchSearchSource('demo')}
                className={searchSource === 'demo' ? 'bg-white text-gray-900' : 'text-white hover:bg-white/20'}
              >
                Demo Search
              </Button>
            </div>
          </div>

          {searchSource === 'demo' && (
            <EnhancedSearchFilters
              filters={filters}
              onFiltersChange={setFilters}
              onSearch={searchPropertiesHandler}
              isLoading={isLoading}
            />
          )}
        </div>
      </div>

      {searchSource === 'idx' && (
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Live MLS Property Search</h2>
            <IDXSearchWidget 
              onPropertySelect={(property) => {
                handlePropertySelect(property);
                // Also add to the current results for display consistency
                setProperties(prev => [property, ...prev.filter(p => p.mlsId !== property.mlsId)]);
                if (!hasSearched) {
                  setHasSearched(true);
                  setSearchResult({
                    properties: [property],
                    totalCount: 1,
                    searchTerm: 'Widget Selection'
                  });
                }
              }}
              className="w-full"
            />
          </div>
        </div>
      )}

      {(isDemoMode && hasSearched) && (
        <div className="container mx-auto px-4 py-4">
          <Alert className={`${searchSource === 'idx' ? 'bg-blue-50 border-blue-200' : 'bg-blue-50 border-blue-200'} max-w-6xl mx-auto`}>
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>{searchSource === 'idx' ? 'IDX Integration:' : 'Demo Mode:'}</strong> {searchSource === 'idx' 
                ? 'You\'re viewing properties through iHomeFinder IDX integration. Your existing showing request system will work seamlessly.' 
                : 'You\'re viewing sample property data. In production, this would connect to live MLS feeds.'}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {error && (
        <div className="container mx-auto px-4 py-6">
          <Alert variant="destructive" className="max-w-6xl mx-auto">
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

      {hasSearched && (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  {properties.length > 0 ? `${properties.length} Properties Found` : 'No Properties Found'}
                </h2>
                {properties.length > 0 && (
                  <p className="text-gray-600 text-sm mt-1">
                    Showing {searchSource === 'idx' ? 'IDX' : 'demo'} listings in your search area
                  </p>
                )}
              </div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
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
                      searchSource === 'idx' ? (
                        <IDXPropertyCard
                          key={property.mlsId}
                          property={property}
                          onScheduleTour={handleScheduleTourFromCard}
                          isIDXSource={true}
                        />
                      ) : (
                        <PropertyCard
                          key={property.mlsId}
                          property={property}
                          onScheduleTour={handleScheduleTourFromCard}
                        />
                      )
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="map">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="lg:col-span-1">
                      <MapView
                        properties={properties}
                        selectedProperty={selectedProperty}
                        onPropertySelect={handlePropertySelectFromCard}
                        height="600px"
                      />
                    </div>
                    
                    <div className="lg:col-span-1 max-h-96 lg:max-h-[600px] overflow-y-auto space-y-4">
                      {properties.map((property) => (
                        <div
                          key={property.mlsId}
                          className={`border rounded-lg p-4 cursor-pointer transition-all ${
                            selectedProperty?.mlsId === property.mlsId
                              ? 'border-indigo-500 bg-indigo-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => handlePropertySelectFromCard(property)}
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
                                  handleScheduleTourFromCard(property)
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
                <Button onClick={searchPropertiesHandler} variant="outline">
                  Search Again
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      <PropertyRequestWizard
        isOpen={showTourWizard}
        onClose={() => {
          setShowTourWizard(false)
          setSelectedProperty(null)
        }}
      />

      {hasSearched && properties.length > 0 && <MLSComplianceFooter />}
    </div>
  )
}

export default SearchPage
