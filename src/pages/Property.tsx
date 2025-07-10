
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
  Clock,
  CheckCircle,
  Star
} from "lucide-react"

// Fake property data for demo mode
const getFakeProperty = (mlsId: string): PropertyType => ({
  mlsId: mlsId,
  listPrice: 875000,
  listDate: "2024-01-15T00:00:00Z",
  modificationTimestamp: "2024-01-15T00:00:00Z",
  address: {
    streetNumber: "1247",
    streetName: "Connecticut Ave NW",
    unit: "3B",
    city: "Washington",
    state: "DC",
    postalCode: "20036",
    country: "US",
    full: "1247 Connecticut Ave NW #3B, Washington, DC 20036"
  },
  geo: {
    lat: 38.9072,
    lng: -77.0369
  },
  property: {
    bedrooms: 2,
    bathsFull: 2,
    bathsHalf: 1,
    area: 1250,
    type: "Condominium",
    subType: "High-Rise",
    yearBuilt: 2018,
    lotSize: 0,
    stories: 1,
    parking: {
      spaces: 1,
      type: "Garage"
    },
    cooling: "Central Air",
    heating: "Forced Air",
    flooring: ["Hardwood", "Tile"]
  },
  listingAgent: {
    name: "Sarah Chen",
    phone: "(202) 555-0123",
    email: "sarah.chen@realty.com"
  },
  office: {
    name: "Premium DC Realty",
    phone: "(202) 555-0100"
  },
  photos: [
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop"
  ],
  remarks: "Stunning modern condo in the heart of Dupont Circle. This beautifully renovated 2-bedroom, 2.5-bathroom unit features floor-to-ceiling windows, premium finishes, and an open-concept layout perfect for entertaining. The gourmet kitchen boasts quartz countertops, stainless steel appliances, and custom cabinetry. Master suite includes walk-in closet and spa-like ensuite. Building amenities include 24-hour concierge, fitness center, rooftop terrace, and garage parking. Steps from metro, restaurants, and shopping.",
  disclaimer: "Information deemed reliable but not guaranteed. Square footage approximate.",
  status: "Active",
  mls: {
    status: "Active",
    area: "Dupont Circle",
    daysOnMarket: 12,
    originalListPrice: 875000
  }
})

const Property = () => {
  const { mlsId } = useParams<{ mlsId: string }>()
  const navigate = useNavigate()
  const [property, setProperty] = useState<PropertyType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showTourWizard, setShowTourWizard] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (!mlsId) {
      navigate('/search')
      return
    }
    
    // Use fake data for demo mode
    setTimeout(() => {
      setProperty(getFakeProperty(mlsId))
      setIsLoading(false)
    }, 500)
  }, [mlsId, navigate])

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

  const handleToggleFavorite = () => {
    setIsFavorited(!isFavorited)
    toast({
      title: isFavorited ? "Removed from favorites" : "Added to favorites",
      description: isFavorited ? "Property removed from your saved list" : "Property saved to your favorites"
    })
  }

  const totalBaths = property ? property.property.bathsFull + (property.property.bathsHalf * 0.5) : 0

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-900 mx-auto mb-4" />
          <p className="text-gray-600 font-light">Loading property details...</p>
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <Home className="h-16 w-16 text-gray-300 mx-auto mb-6" />
          <h2 className="text-2xl font-light text-gray-900 mb-3">Property Not Found</h2>
          <p className="text-gray-600 mb-8 font-light">The property you're looking for doesn't exist or has been removed.</p>
          <Button 
            onClick={() => navigate('/search')}
            className="bg-gray-900 hover:bg-black rounded-xl px-8 py-3 font-medium"
          >
            Back to Search
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-100 bg-white sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate('/search')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-light"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Search
            </Button>
            
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={handleToggleFavorite}
                className={`rounded-xl p-3 transition-all ${isFavorited ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500'}`}
              >
                <Heart className={`h-5 w-5 ${isFavorited ? 'fill-current' : ''}`} />
              </Button>
              
              <Button 
                onClick={handleScheduleTour}
                className="bg-gray-900 hover:bg-black text-white rounded-xl px-6 py-3 font-medium flex items-center gap-2"
              >
                <Calendar className="h-4 w-4" />
                Schedule Tour
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Property Gallery */}
            <div className="order-2 lg:order-1">
              <PropertyGallery
                photos={property.photos || []}
                propertyAddress={property.address.full}
              />
            </div>

            {/* Property Info */}
            <div className="order-1 lg:order-2 lg:sticky lg:top-32">
              <div className="space-y-6">
                {/* Price & Status */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Badge className="bg-green-50 text-green-700 border-green-200 font-medium">
                      {property.mls.status}
                    </Badge>
                    {property.mls.daysOnMarket && (
                      <span className="text-gray-500 text-sm font-light">
                        {property.mls.daysOnMarket} days on market
                      </span>
                    )}
                  </div>
                  
                  <h1 className="text-4xl font-light text-gray-900">
                    {formatPrice(property.listPrice)}
                  </h1>
                  
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span className="font-light">{property.address.full}</span>
                  </div>
                </div>

                {/* Property Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <Bed className="h-5 w-5 text-gray-600 mx-auto mb-2" />
                    <div className="text-xl font-medium text-gray-900">{property.property.bedrooms}</div>
                    <div className="text-sm text-gray-600 font-light">Bedrooms</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <Bath className="h-5 w-5 text-gray-600 mx-auto mb-2" />
                    <div className="text-xl font-medium text-gray-900">{totalBaths}</div>
                    <div className="text-sm text-gray-600 font-light">Bathrooms</div>
                  </div>
                  {property.property.area && (
                    <div className="text-center p-4 bg-gray-50 rounded-xl">
                      <Square className="h-5 w-5 text-gray-600 mx-auto mb-2" />
                      <div className="text-xl font-medium text-gray-900">{property.property.area.toLocaleString()}</div>
                      <div className="text-sm text-gray-600 font-light">Sq Ft</div>
                    </div>
                  )}
                </div>

                {/* Tour CTA Section */}
                <Card className="border-gray-200 bg-gray-50/50">
                  <CardContent className="p-6">
                    <div className="text-center space-y-4">
                      <div className="space-y-2">
                        <h3 className="text-lg font-medium text-gray-900">Ready to see this home?</h3>
                        <p className="text-gray-600 font-light">Book a tour and experience this property in person</p>
                      </div>
                      
                      <div className="space-y-3">
                        <Button 
                          onClick={handleScheduleTour}
                          className="w-full bg-gray-900 hover:bg-black text-white rounded-xl py-4 font-medium text-base"
                          size="lg"
                        >
                          <Calendar className="h-5 w-5 mr-2" />
                          Schedule Your Tour
                        </Button>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <Button 
                            variant="outline"
                            onClick={handleScheduleTour}
                            className="rounded-xl border-gray-300 font-light"
                          >
                            <Clock className="h-4 w-4 mr-2" />
                            Tour Today
                          </Button>
                          <Button 
                            variant="outline"
                            onClick={handleScheduleTour}
                            className="rounded-xl border-gray-300 font-light"
                          >
                            <Star className="h-4 w-4 mr-2" />
                            This Weekend
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="font-light">Free • No obligation • Expert guidance</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Agent */}
                {property.listingAgent?.name && (
                  <Card className="border-gray-200">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-gray-900">{property.listingAgent.name}</h4>
                          {property.office?.name && (
                            <p className="text-sm text-gray-600 font-light">{property.office.name}</p>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          {property.listingAgent.phone && (
                            <Button variant="outline" size="sm" className="rounded-xl font-light">
                              <Phone className="h-4 w-4 mr-2" />
                              Call
                            </Button>
                          )}
                          {property.listingAgent.email && (
                            <Button variant="outline" size="sm" className="rounded-xl font-light">
                              <Mail className="h-4 w-4 mr-2" />
                              Email
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Property Details */}
        <div className="space-y-12">
          {/* Description */}
          {property.remarks && (
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-xl font-light text-gray-900">About This Home</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed font-light">
                  {property.remarks}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Property Features */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-xl font-light text-gray-900">Property Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Basics */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Property Information</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-light">Property Type:</span>
                      <span className="font-medium">{property.property.type}</span>
                    </div>
                    {property.property.subType && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-light">Style:</span>
                        <span className="font-medium">{property.property.subType}</span>
                      </div>
                    )}
                    {property.property.yearBuilt && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-light">Year Built:</span>
                        <span className="font-medium">{property.property.yearBuilt}</span>
                      </div>
                    )}
                    {property.property.stories && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-light">Stories:</span>
                        <span className="font-medium">{property.property.stories}</span>
                      </div>
                    )}
                    {property.property.parking?.spaces && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-light">Parking:</span>
                        <span className="font-medium">{property.property.parking.spaces} spaces</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Systems */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Systems & Features</h4>
                  <div className="space-y-3 text-sm">
                    {property.property.heating && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-light">Heating:</span>
                        <span className="font-medium">{property.property.heating}</span>
                      </div>
                    )}
                    {property.property.cooling && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-light">Cooling:</span>
                        <span className="font-medium">{property.property.cooling}</span>
                      </div>
                    )}
                    {property.property.flooring && property.property.flooring.length > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-light">Flooring:</span>
                        <span className="font-medium">{property.property.flooring.join(', ')}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Map */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-xl font-light text-gray-900">Location</CardTitle>
            </CardHeader>
            <CardContent>
              <MapView
                properties={[property]}
                selectedProperty={property}
                center={[property.geo.lng, property.geo.lat]}
                zoom={15}
                height="400px"
              />
            </CardContent>
          </Card>

          {/* Final CTA */}
          <Card className="border-gray-200 bg-gray-50">
            <CardContent className="p-8 text-center">
              <div className="max-w-md mx-auto space-y-6">
                <div className="space-y-2">
                  <h3 className="text-2xl font-light text-gray-900">Love what you see?</h3>
                  <p className="text-gray-600 font-light">Schedule a tour and make this house your home</p>
                </div>
                
                <Button 
                  onClick={handleScheduleTour}
                  className="bg-gray-900 hover:bg-black text-white rounded-xl px-8 py-4 font-medium text-lg"
                  size="lg"
                >
                  <Calendar className="h-5 w-5 mr-2" />
                  Book Your Free Tour
                </Button>
                
                <p className="text-sm text-gray-500 font-light">No pressure. Expert guidance. Your timeline.</p>
              </div>
            </CardContent>
          </Card>
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
