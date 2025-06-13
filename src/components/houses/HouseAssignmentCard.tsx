
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Loader2, Home, MapPin, Bed, Bath, Square } from 'lucide-react'

interface House {
  id: string
  address: string
  city: string
  state: string
  zip_code: string | null
  beds: number
  baths: number
  sqft: number | null
  price: number
  description: string | null
  image_url: string | null
  available: boolean
}

interface HouseAssignment {
  id: string
  house_id: string
  assigned_at: string
  status: string
  houses: House
}

interface HouseAssignmentCardProps {
  assignment: HouseAssignment
  assigning: string | null
  onRemoveAssignment: () => void
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

const HouseAssignmentCard = ({ assignment, assigning, onRemoveAssignment }: HouseAssignmentCardProps) => {
  const house = assignment.houses

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-green-600 mb-2">Your Assigned House</h2>
        <p className="text-gray-600">You have been assigned to the following property:</p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              {house.address}
            </CardTitle>
            <Badge variant="secondary">Assigned</Badge>
          </div>
          <CardDescription className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {house.city}, {house.state} {house.zip_code}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {house.image_url && (
            <img
              src={house.image_url}
              alt={house.address}
              className="w-full h-48 object-cover rounded-lg"
            />
          )}
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Bed className="h-4 w-4 text-gray-500" />
              <span>{house.beds} beds</span>
            </div>
            <div className="flex items-center gap-2">
              <Bath className="h-4 w-4 text-gray-500" />
              <span>{house.baths} baths</span>
            </div>
            {house.sqft && (
              <div className="flex items-center gap-2">
                <Square className="h-4 w-4 text-gray-500" />
                <span>{house.sqft.toLocaleString()} sq ft</span>
              </div>
            )}
            <div className="font-semibold text-lg">
              {formatPrice(house.price)}
            </div>
          </div>

          {house.description && (
            <p className="text-gray-600">{house.description}</p>
          )}

          <div className="text-sm text-gray-500">
            Assigned on: {new Date(assignment.assigned_at).toLocaleDateString()}
          </div>

          <Button 
            variant="outline" 
            onClick={onRemoveAssignment}
            disabled={assigning === 'removing'}
            className="w-full"
          >
            {assigning === 'removing' ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Removing Assignment...
              </>
            ) : (
              'Remove Assignment'
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default HouseAssignmentCard
