import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Bed, Bath, Square, Calendar } from "lucide-react"
import { Property } from "@/types/simplyrets"
import { useNavigate } from "react-router-dom"

interface PropertyCardProps {
  property: Property
  onScheduleTour?: (property: Property) => void
}

export const PropertyCard = ({ property, onScheduleTour }: PropertyCardProps) => {
  const navigate = useNavigate()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price)
  }

  const totalBaths = property.property.bathsFull + (property.property.bathsHalf * 0.5)

  const handleViewDetails = () => {
    navigate(`/property/${property.mlsId}`)
  }

  const handleScheduleTour = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onScheduleTour) {
      onScheduleTour(property)
    }
  }

  return (
    <Card className="group cursor-pointer hover:shadow-lg transition-all duration-200 border-gray-200 overflow-hidden">
      <div onClick={handleViewDetails} className="relative">
        {/* Property Image */}
        <div className="relative h-48 overflow-hidden">
          {property.photos && property.photos.length > 0 ? (
            <img
              src={property.photos[0]}
              alt={property.address.full}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">No Image Available</span>
            </div>
          )}
          
          {/* Status Badge */}
          <Badge className="absolute top-3 left-3 bg-green-600 hover:bg-green-700 text-white">
            {property.mls.status}
          </Badge>
          
          {/* Days on Market */}
          {property.mls.daysOnMarket && (
            <Badge variant="secondary" className="absolute top-3 right-3 bg-white/90 text-gray-700">
              {property.mls.daysOnMarket} days
            </Badge>
          )}
        </div>

        <CardContent className="p-4">
          {/* Price */}
          <div className="mb-2">
            <h3 className="text-xl font-bold text-gray-900">
              {formatPrice(property.listPrice)}
            </h3>
          </div>

          {/* Property Details */}
          <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Bed className="h-4 w-4" />
              <span>{property.property.bedrooms}</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="h-4 w-4" />
              <span>{totalBaths}</span>
            </div>
            {property.property.area && (
              <div className="flex items-center gap-1">
                <Square className="h-4 w-4" />
                <span>{property.property.area.toLocaleString()} sqft</span>
              </div>
            )}
          </div>

          {/* Address */}
          <div className="flex items-start gap-2 mb-3">
            <MapPin className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
            <span className="text-sm text-gray-700 line-clamp-2">
              {property.address.full}
            </span>
          </div>

          {/* Property Type */}
          <div className="mb-4">
            <Badge variant="outline" className="text-xs">
              {property.property.type} {property.property.subType && `• ${property.property.subType}`}
            </Badge>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={handleViewDetails}
            >
              View Details
            </Button>
            <Button 
              size="sm" 
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              onClick={handleScheduleTour}
            >
              <Calendar className="h-4 w-4 mr-1" />
              Schedule Tour
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}