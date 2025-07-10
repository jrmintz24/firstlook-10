import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { PropertyGallery } from "@/components/property/PropertyGallery"
import { MapView } from "@/components/property/MapView"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { supabase } from "@/integrations/supabase/client"
import { Property as PropertyType } from "@/types/simplyrets"
import { useToast } from "@/hooks/use-toast"
import PropertyRequestWizard from "@/components/PropertyRequestWizard"
import { 
  ArrowLeft, 
  Bed, 
  Bath, 
  Square, 
  Calendar, 
  Heart,
  Phone,
  Mail,
  MapPin,
  Home,
  Loader2,
  Car,
  Thermometer,
  Zap
} from "lucide-react"

const Property = () => {
  const { mlsId } = useParams<{ mlsId: string }>()
  const navigate = useNavigate()
  const [property, setProperty] = useState<PropertyType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showTourWizard, setShowTourWizard] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (!mlsId) {
      navigate('/search')
      return
    }
    
    fetchProperty()
  }, [mlsId, navigate])

  const fetchProperty = async () => {
    if (!mlsId) return
    
    setIsLoading(true)
    try {
      console.log('Fetching property details for MLS ID:', mlsId)
      
      const { data, error } = await supabase.functions.invoke('simplyrets-search', {
        body: { 
          endpoint: 'property',
          mlsId: mlsId
        }
      })

      if (error) {
        console.error('Property fetch error:', error)
        throw new Error(error.message || 'Failed to fetch property details')
      }

      console.log('Property details:', data)
      setProperty(data as PropertyType)
      
    } catch (error) {
      console.error('Property fetch error:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load property details",
        variant: "destructive"
      })
      navigate('/search')
    } finally {
      setIsLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price)
  }

  const handleScheduleTour = () => {
    setShowTourWizard(true)
  }

  const totalBaths = property ? property.property.bathsFull + (property.property.bathsHalf * 0.5) : 0

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading property details...</p>
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Property Not Found</h2>
          <p className="text-gray-600 mb-4">The property you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/search')}>
            Back to Search
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="outline"
          onClick={() => navigate('/search')}
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Search
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property Gallery */}
            <PropertyGallery
              photos={property.photos || []}
              propertyAddress={property.address.full}
            />

            {/* Property Overview */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                      {formatPrice(property.listPrice)}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-gray-600 mb-3">
                      <MapPin className="h-4 w-4" />
                      <span>{property.address.full}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <Badge className="bg-green-600 hover:bg-green-700">
                        {property.mls.status}
                      </Badge>
                      {property.mls.daysOnMarket && (
                        <span className="text-gray-600">
                          {property.mls.daysOnMarket} days on market
                        </span>
                      )}
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent>
                {/* Property Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Bed className="h-5 w-5 text-gray-600 mx-auto mb-1" />
                    <div className="font-semibold">{property.property.bedrooms}</div>
                    <div className="text-xs text-gray-600">Bedrooms</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Bath className="h-5 w-5 text-gray-600 mx-auto mb-1" />
                    <div className="font-semibold">{totalBaths}</div>
                    <div className="text-xs text-gray-600">Bathrooms</div>
                  </div>
                  {property.property.area && (
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <Square className="h-5 w-5 text-gray-600 mx-auto mb-1" />
                      <div className="font-semibold">{property.property.area.toLocaleString()}</div>
                      <div className="text-xs text-gray-600">Sq Ft</div>
                    </div>
                  )}
                  {property.property.yearBuilt && (
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <Home className="h-5 w-5 text-gray-600 mx-auto mb-1" />
                      <div className="font-semibold">{property.property.yearBuilt}</div>
                      <div className="text-xs text-gray-600">Year Built</div>
                    </div>
                  )}
                </div>

                {/* Property Type */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Property Type</h3>
                  <div className="flex gap-2">
                    <Badge variant="outline">{property.property.type}</Badge>
                    {property.property.subType && (
                      <Badge variant="outline">{property.property.subType}</Badge>
                    )}
                  </div>
                </div>

                {/* Description */}
                {property.remarks && (
                  <div className="mb-6">
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-gray-700 whitespace-pre-line">
                      {property.remarks}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Property Features */}
            <Card>
              <CardHeader>
                <CardTitle>Property Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basics */}
                  <div>
                    <h4 className="font-semibold mb-3">Property Details</h4>
                    <div className="space-y-2 text-sm">
                      {property.property.stories && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Stories:</span>
                          <span>{property.property.stories}</span>
                        </div>
                      )}
                      {property.property.lotSize && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Lot Size:</span>
                          <span>{property.property.lotSize.toLocaleString()} sq ft</span>
                        </div>
                      )}
                      {property.property.parking?.spaces && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Parking:</span>
                          <span>{property.property.parking.spaces} spaces</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Systems */}
                  <div>
                    <h4 className="font-semibold mb-3">Systems & Features</h4>
                    <div className="space-y-2 text-sm">
                      {property.property.heating && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Heating:</span>
                          <span>{property.property.heating}</span>
                        </div>
                      )}
                      {property.property.cooling && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Cooling:</span>
                          <span>{property.property.cooling}</span>
                        </div>
                      )}
                      {property.property.flooring && property.property.flooring.length > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Flooring:</span>
                          <span>{property.property.flooring.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Map */}
            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent>
                <MapView
                  properties={[property]}
                  selectedProperty={property}
                  center={[property.geo.lng, property.geo.lat]}
                  zoom={15}
                  height="300px"
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Action Buttons */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <Button 
                    onClick={handleScheduleTour}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    size="lg"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Tour
                  </Button>
                  <Button variant="outline" className="w-full" size="lg">
                    <Heart className="h-4 w-4 mr-2" />
                    Save Property
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Listing Agent */}
            {property.listingAgent?.name && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Listing Agent</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold">{property.listingAgent.name}</h4>
                      {property.office?.name && (
                        <p className="text-sm text-gray-600">{property.office.name}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      {property.listingAgent.phone && (
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          <Phone className="h-4 w-4 mr-2" />
                          {property.listingAgent.phone}
                        </Button>
                      )}
                      {property.listingAgent.email && (
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          <Mail className="h-4 w-4 mr-2" />
                          Contact Agent
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* MLS Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">MLS Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">MLS ID:</span>
                    <span className="font-mono">{property.mlsId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span>{property.mls.status}</span>
                  </div>
                  {property.mls.area && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Area:</span>
                      <span>{property.mls.area}</span>
                    </div>
                  )}
                  {property.mls.originalListPrice && property.mls.originalListPrice !== property.listPrice && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Original Price:</span>
                      <span>{formatPrice(property.mls.originalListPrice)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Listed:</span>
                    <span>{new Date(property.listDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Disclaimer */}
            {property.disclaimer && (
              <Card>
                <CardContent className="p-4">
                  <p className="text-xs text-gray-500">{property.disclaimer}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Tour Request Wizard */}
        <PropertyRequestWizard
          isOpen={showTourWizard}
          onClose={() => setShowTourWizard(false)}
        />
      </div>
    </div>
  )
}

export default Property