
import { Alert, AlertDescription } from '../ui/alert'
import HouseCard from './HouseCard'

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

interface HouseGridProps {
  houses: House[]
  assigning: string | null
  onAssignHouse: (houseId: string) => void
}

const HouseGrid = ({ houses, assigning, onAssignHouse }: HouseGridProps) => {
  if (houses.length === 0) {
    return (
      <Alert>
        <AlertDescription>
          No houses are currently available for assignment. Please check back later.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {houses.map((house) => (
        <HouseCard
          key={house.id}
          house={house}
          assigning={assigning}
          onAssignHouse={onAssignHouse}
        />
      ))}
    </div>
  )
}

export default HouseGrid
