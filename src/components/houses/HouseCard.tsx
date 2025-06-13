
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Loader2, MapPin, Bed, Bath, Square } from 'lucide-react'

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

interface HouseCardProps {
  house: House
  assigning: string | null
  onAssignHouse: (houseId: string) => void
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

const HouseCard = ({ house, assigning, onAssignHouse }: HouseCardProps) => {
  return (
    <Card key={house.id} className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg">{house.address}</CardTitle>
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
            className="w-full h-32 object-cover rounded"
          />
        )}
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-1">
            <Bed className="h-3 w-3" />
            {house.beds} beds
          </div>
          <div className="flex items-center gap-1">
            <Bath className="h-3 w-3" />
            {house.baths} baths
          </div>
          {house.sqft && (
            <div className="flex items-center gap-1 col-span-2">
              <Square className="h-3 w-3" />
              {house.sqft.toLocaleString()} sq ft
            </div>
          )}
        </div>

        <div className="font-bold text-lg text-green-600">
          {formatPrice(house.price)}
        </div>

        {house.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {house.description}
          </p>
        )}

        <Button 
          onClick={() => onAssignHouse(house.id)}
          disabled={assigning === house.id}
          className="w-full"
        >
          {assigning === house.id ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Assigning...
            </>
          ) : (
            'Select This House'
          )}
        </Button>
      </CardContent>
    </Card>
  )
}

export default HouseCard
