import { useState, useEffect } from "react"
import { EnhancedSearchFilters } from "@/components/property/EnhancedSearchFilters"
import { PropertyCard } from "@/components/property/PropertyCard"
import { MapView } from "@/components/property/MapView"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { supabase } from "@/integrations/supabase/client"
import { Property, SearchFilters as SearchFiltersType, SearchResponse } from "@/types/simplyrets"
import { useToast } from "@/hooks/use-toast"
import PropertyRequestWizard from "@/components/PropertyRequestWizard"
import { Loader2, Grid, Map, AlertCircle, RefreshCw, Info } from "lucide-react"
import { useLocation } from "react-router-dom"

// Fake property data for demo
const FAKE_PROPERTIES: Property[] = [
  {
    mlsId: "DC001",
    listPrice: 850000,
    listDate: "2024-01-15",
    modificationTimestamp: "2024-01-15T10:00:00Z",
    address: {
      streetNumber: "1234",
      streetName: "16th Street NW",
      city: "Washington",
      state: "DC",
      postalCode: "20009",
      country: "US",
      full: "1234 16th Street NW, Washington, DC 20009"
    },
    geo: { lat: 38.9172, lng: -77.0369 },
    property: {
      bedrooms: 3,
      bathsFull: 2,
      bathsHalf: 1,
      area: 1800,
      type: "Residential",
      subType: "Townhouse",
      yearBuilt: 2015
    },
    listingAgent: {
      name: "Sarah Johnson",
      phone: "(202) 555-0123",
      email: "sarah@dcrealty.com"
    },
    office: {
      name: "DC Premium Realty",
      phone: "(202) 555-0100"
    },
    photos: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop"
    ],
    remarks: "Beautiful modern townhouse in the heart of DC with updated kitchen and hardwood floors.",
    status: "Active",
    mls: {
      status: "Active",
      area: "Dupont Circle",
      daysOnMarket: 12
    }
  },
  {
    mlsId: "MD002",
    listPrice: 675000,
    listDate: "2024-01-10",
    modificationTimestamp: "2024-01-10T14:30:00Z",
    address: {
      streetNumber: "5678",
      streetName: "Wisconsin Avenue",
      city: "Bethesda",
      state: "MD",
      postalCode: "20814",
      country: "US",
      full: "5678 Wisconsin Avenue, Bethesda, MD 20814"
    },
    geo: { lat: 38.9847, lng: -77.0947 },
    property: {
      bedrooms: 4,
      bathsFull: 3,
      bathsHalf: 0,
      area: 2200,
      type: "Residential",
      subType: "Single Family",
      yearBuilt: 1995
    },
    listingAgent: {
      name: "Michael Chen",
      phone: "(301) 555-0234",
      email: "mchen@bethesdahomes.com"
    },
    office: {
      name: "Bethesda Home Group",
      phone: "(301) 555-0200"
    },
    photos: [
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&h=600&fit=crop"
    ],
    remarks: "Spacious family home with large backyard, perfect for entertaining.",
    status: "Active",
    mls: {
      status: "Active",
      area: "Bethesda",
      daysOnMarket: 8
    }
  },
  {
    mlsId: "VA003",
    listPrice: 950000,
    listDate: "2024-01-05",
    modificationTimestamp: "2024-01-05T09:15:00Z",
    address: {
      streetNumber: "9876",
      streetName: "King Street",
      city: "Alexandria",
      state: "VA",
      postalCode: "22314",
      country: "US",
      full: "9876 King Street, Alexandria, VA 22314"
    },
    geo: { lat: 38.8048, lng: -77.0469 },
    property: {
      bedrooms: 2,
      bathsFull: 2,
      bathsHalf: 1,
      area: 1400,
      type: "Condo",
      subType: "High-Rise",
      yearBuilt: 2020
    },
    listingAgent: {
      name: "Jennifer Rodriguez",
      phone: "(703) 555-0345",
      email: "jrodriguez@alexrealty.com"
    },
    office: {
      name: "Alexandria Luxury Realty",
      phone: "(703) 555-0300"
    },
    photos: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop"
    ],
    remarks: "Luxury waterfront condo with stunning Potomac River views and premium amenities.",
    status: "Active",
    mls: {
      status: "Active",
      area: "Old Town",
      daysOnMarket: 20
    }
  },
  {
    mlsId: "MD004",
    listPrice: 525000,
    listDate: "2024-01-12",
    modificationTimestamp: "2024-01-12T16:45:00Z",
    address: {
      streetNumber: "2468",
      streetName: "Georgia Avenue",
      city: "Silver Spring",
      state: "MD",
      postalCode: "20910",
      country: "US",
      full: "2468 Georgia Avenue, Silver Spring, MD 20910"
    },
    geo: { lat: 38.9906, lng: -77.0261 },
    property: {
      bedrooms: 3,
      bathsFull: 2,
      bathsHalf: 0,
      area: 1600,
      type: "Residential",
      subType: "Single Family",
      yearBuilt: 1985
    },
    listingAgent: {
      name: "David Kim",
      phone: "(301) 555-0456",
      email: "dkim@silverspringrealty.com"
    },
    office: {
      name: "Silver Spring Realty Co.",
      phone: "(301) 555-0400"
    },
    photos: [
      "https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop"
    ],
    remarks: "Charming colonial home with recent renovations and convenient metro access.",
    status: "Active",
    mls: {
      status: "Active",
      area: "Downtown Silver Spring",
      daysOnMarket: 15
    }
  },
  {
    mlsId: "MD005",
    listPrice: 750000,
    listDate: "2024-01-08",
    modificationTimestamp: "2024-01-08T11:20:00Z",
    address: {
      streetNumber: "1357",
      streetName: "Charles Street",
      city: "Baltimore",
      state: "MD",
      postalCode: "21201",
      country: "US",
      full: "1357 Charles Street, Baltimore, MD 21201"
    },
    geo: { lat: 39.2904, lng: -76.6122 },
    property: {
      bedrooms: 4,
      bathsFull: 3,
      bathsHalf: 1,
      area: 2000,
      type: "Residential",
      subType: "Townhouse",
      yearBuilt: 1900,
    },
    listingAgent: {
      name: "Amanda Wilson",
      phone: "(410) 555-0567",
      email: "awilson@baltimorerealty.com"
    },
    office: {
      name: "Baltimore Historic Homes",
      phone: "(410) 555-0500"
    },
    photos: [
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&h=600&fit=crop"
    ],
    remarks: "Historic row house with original details and modern updates in Federal Hill.",
    status: "Active",
    mls: {
      status: "Active",
      area: "Federal Hill",
      daysOnMarket: 25
    }
  },
  {
    mlsId: "DC006",
    listPrice: 1200000,
    listDate: "2024-01-03",
    modificationTimestamp: "2024-01-03T13:10:00Z",
    address: {
      streetNumber: "8642",
      streetName: "Connecticut Avenue NW",
      city: "Washington",
      state: "DC",
      postalCode: "20008",
      country: "US",
      full: "8642 Connecticut Avenue NW, Washington, DC 20008"
    },
    geo: { lat: 38.9583, lng: -77.0567 },
    property: {
      bedrooms: 5,
      bathsFull: 4,
      bathsHalf: 2,
      area: 3200,
      type: "Residential",
      subType: "Single Family",
      yearBuilt: 2010
    },
    listingAgent: {
      name: "Robert Thompson",
      phone: "(202) 555-0678",
      email: "rthompson@dcpremium.com"
    },
    office: {
      name: "DC Premium Properties",
      phone: "(202) 555-0600"
    },
    photos: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop"
    ],
    remarks: "Luxury estate home with chef's kitchen, wine cellar, and three-car garage.",
    status: "Active",
    mls: {
      status: "Active",
      area: "Chevy Chase",
      daysOnMarket: 30
    }
  },
  {
    mlsId: "VA007",
    listPrice: 425000,
    listDate: "2024-01-14",
    modificationTimestamp: "2024-01-14T08:30:00Z",
    address: {
      streetNumber: "7531",
      streetName: "Lee Highway",
      city: "Arlington",
      state: "VA",
      postalCode: "22207",
      country: "US",
      full: "7531 Lee Highway, Arlington, VA 22207"
    },
    geo: { lat: 38.8816, lng: -77.1271 },
    property: {
      bedrooms: 1,
      bathsFull: 1,
      bathsHalf: 0,
      area: 800,
      type: "Condo",
      subType: "Mid-Rise",
      yearBuilt: 2005
    },
    listingAgent: {
      name: "Lisa Chang",
      phone: "(703) 555-0789",
      email: "lchang@arlingtonhomes.com"
    },
    office: {
      name: "Arlington Home Finders",
      phone: "(703) 555-0700"
    },
    photos: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop"
    ],
    remarks: "Modern one-bedroom condo with in-unit laundry and metro accessibility.",
    status: "Active",
    mls: {
      status: "Active",
      area: "Ballston",
      daysOnMarket: 5
    }
  },
  {
    mlsId: "MD008",
    listPrice: 825000,
    listDate: "2024-01-06",
    modificationTimestamp: "2024-01-06T15:45:00Z",
    address: {
      streetNumber: "4682",
      streetName: "Democracy Boulevard",
      city: "Rockville",
      state: "MD",
      postalCode: "20853",
      country: "US",
      full: "4682 Democracy Boulevard, Rockville, MD 20853"
    },
    geo: { lat: 39.0836, lng: -77.1528 },
    property: {
      bedrooms: 4,
      bathsFull: 3,
      bathsHalf: 1,
      area: 2400,
      type: "Residential",
      subType: "Single Family",
      yearBuilt: 2000
    },
    listingAgent: {
      name: "Mark Davis",
      phone: "(301) 555-0890",
      email: "mdavis@rockvillerealty.com"
    },
    office: {
      name: "Rockville Family Homes",
      phone: "(301) 555-0800"
    },
    photos: [
      "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=800&h=600&fit=crop"
    ],
    remarks: "Beautiful suburban home with finished basement and large deck.",
    status: "Active",
    mls: {
      status: "Active",
      area: "Rockville Centre",
      daysOnMarket: 18
    }
  }
]

const Search = () => {
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [showTourWizard, setShowTourWizard] = useState(false)
  const [isDemoMode, setIsDemoMode] = useState(true)
  const [filters, setFilters] = useState<SearchFiltersType>({
    cities: 'Washington,Baltimore,Bethesda,Arlington,Alexandria,Silver Spring,Rockville,Gaithersburg,Annapolis',
    limit: 20
  })
  const { toast } = useToast()
  const location = useLocation()

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const query = urlParams.get('q')
    
    if (query) {
      setFilters(prev => ({
        ...prev,
        cities: query
      }))
      searchPropertiesWithQuery(query)
    }
  }, [location.search])

  const filterProperties = (searchFilters: SearchFiltersType) => {
    let filtered = [...FAKE_PROPERTIES]

    if (searchFilters.cities && searchFilters.cities.trim()) {
      const searchTerm = searchFilters.cities.toLowerCase().trim()
      filtered = filtered.filter(property => 
        property.address.city.toLowerCase().includes(searchTerm) ||
        property.address.state.toLowerCase().includes(searchTerm) ||
        property.address.postalCode.toLowerCase().includes(searchTerm) ||
        property.address.full.toLowerCase().includes(searchTerm) ||
        property.address.streetName.toLowerCase().includes(searchTerm) ||
        property.mls.area?.toLowerCase().includes(searchTerm)
      )
    }

    if (searchFilters.minPrice) {
      filtered = filtered.filter(property => property.listPrice >= searchFilters.minPrice!)
    }
    if (searchFilters.maxPrice) {
      filtered = filtered.filter(property => property.listPrice <= searchFilters.maxPrice!)
    }

    if (searchFilters.minBeds) {
      filtered = filtered.filter(property => property.property.bedrooms >= searchFilters.minBeds!)
    }

    if (searchFilters.minBaths) {
      filtered = filtered.filter(property => 
        (property.property.bathsFull + property.property.bathsHalf * 0.5) >= searchFilters.minBaths!
      )
    }

    if (searchFilters.propertyType && searchFilters.propertyType !== 'all') {
      const types = searchFilters.propertyType.split(',')
      filtered = filtered.filter(property => 
        types.some(type => 
          property.property.type.toLowerCase().includes(type.toLowerCase()) ||
          property.property.subType?.toLowerCase().includes(type.toLowerCase())
        )
      )
    }

    return filtered
  }

  const searchPropertiesWithQuery = async (query?: string) => {
    setIsLoading(true)
    setError(null)
    
    try {
      console.log('Starting property search with filters:', query ? { ...filters, cities: query } : filters)
      
      const searchFilters = query ? { ...filters, cities: query } : filters
      
      await new Promise(resolve => setTimeout(resolve, 800))
      
      const filteredProperties = filterProperties(searchFilters)
      
      setProperties(filteredProperties)
      setHasSearched(true)
      
      toast({
        title: "Search Complete",
        description: `Found ${filteredProperties.length} properties (Demo Mode)`,
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

  const searchProperties = async () => {
    await searchPropertiesWithQuery()
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

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const query = urlParams.get('q')
    
    if (!query) {
      searchProperties()
    }
  }, [])

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
            <h1 className="text-5xl md:text-6xl font-light text-white mb-4">
              Find the best place
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Discover your perfect home in the DC/Baltimore area with our comprehensive property search
            </p>
          </div>

          <EnhancedSearchFilters
            filters={filters}
            onFiltersChange={setFilters}
            onSearch={searchProperties}
            isLoading={isLoading}
          />
        </div>
      </div>

      {isDemoMode && hasSearched && (
        <div className="container mx-auto px-4 py-4">
          <Alert className="bg-blue-50 border-blue-200 max-w-6xl mx-auto">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>Demo Mode:</strong> You're viewing sample property data. In production, this would connect to live MLS feeds.
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
                    Showing active listings in your search area {isDemoMode && '(Demo Data)'}
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
                    <div className="lg:col-span-1">
                      <MapView
                        properties={properties}
                        selectedProperty={selectedProperty}
                        onPropertySelect={handlePropertySelect}
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
