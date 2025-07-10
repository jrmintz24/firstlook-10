
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SearchFilters as SearchFiltersType } from "@/types/simplyrets"
import { Search, MapPin, Home, DollarSign, Filter } from "lucide-react"

interface ModernSearchFiltersProps {
  filters: SearchFiltersType
  onFiltersChange: (filters: SearchFiltersType) => void
  onSearch: () => void
  isLoading?: boolean
}

const propertyTypes = [
  { value: 'all', label: 'All Types' },
  { value: 'Residential', label: 'House' },
  { value: 'Condo', label: 'Condo' },
  { value: 'Townhouse', label: 'Townhouse' },
  { value: 'Multi-Family', label: 'Multi-Family' },
]

const dcBaltimoreAreas = [
  { value: 'Washington,Baltimore,Bethesda,Arlington,Alexandria,Silver Spring,Rockville,Gaithersburg,Annapolis', label: 'DC/Baltimore Metro' },
  { value: 'Washington', label: 'Washington DC' },
  { value: 'Baltimore', label: 'Baltimore' },
  { value: 'Bethesda', label: 'Bethesda' },
  { value: 'Arlington', label: 'Arlington' },
  { value: 'Alexandria', label: 'Alexandria' },
  { value: 'Silver Spring', label: 'Silver Spring' },
  { value: 'Rockville', label: 'Rockville' },
  { value: 'Gaithersburg', label: 'Gaithersburg' },
  { value: 'Annapolis', label: 'Annapolis' },
]

export const ModernSearchFilters = ({ filters, onFiltersChange, onSearch, isLoading }: ModernSearchFiltersProps) => {
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>([])

  const handleFilterChange = (key: keyof SearchFiltersType, value: string | number | undefined) => {
    onFiltersChange({
      ...filters,
      [key]: value
    })
  }

  const handlePropertyTypeToggle = (type: string) => {
    const newTypes = selectedPropertyTypes.includes(type)
      ? selectedPropertyTypes.filter(t => t !== type)
      : [...selectedPropertyTypes, type]
    
    setSelectedPropertyTypes(newTypes)
    handleFilterChange('propertyType', newTypes.length === 0 ? undefined : newTypes.join(','))
  }

  const formatPrice = (price: string) => {
    const num = parseInt(price.replace(/[^0-9]/g, ''))
    return isNaN(num) ? '' : num.toLocaleString()
  }

  const handlePriceChange = (key: 'minPrice' | 'maxPrice', value: string) => {
    const numericValue = parseInt(value.replace(/[^0-9]/g, ''))
    handleFilterChange(key, isNaN(numericValue) ? undefined : numericValue)
  }

  return (
    <div className="space-y-8">
      {/* Main Search Form */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {/* Location */}
        <div className="md:col-span-2 lg:col-span-2">
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Select
              value={filters.cities || dcBaltimoreAreas[0].value}
              onValueChange={(value) => handleFilterChange('cities', value)}
            >
              <SelectTrigger className="h-14 pl-12 text-left border-gray-200 rounded-xl">
                <SelectValue placeholder="Where do you want to live?" />
              </SelectTrigger>
              <SelectContent>
                {dcBaltimoreAreas.map((area) => (
                  <SelectItem key={area.value} value={area.value}>
                    {area.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Price Range */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Min Price"
              value={filters.minPrice ? formatPrice(filters.minPrice.toString()) : ''}
              onChange={(e) => handlePriceChange('minPrice', e.target.value)}
              className="h-14 pl-10 border-gray-200 rounded-xl"
            />
          </div>
          <div className="relative flex-1">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Max Price"
              value={filters.maxPrice ? formatPrice(filters.maxPrice.toString()) : ''}
              onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
              className="h-14 pl-10 border-gray-200 rounded-xl"
            />
          </div>
        </div>

        {/* Bedrooms */}
        <div className="relative">
          <Home className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Select
            value={filters.minBeds?.toString() || 'any'}
            onValueChange={(value) => handleFilterChange('minBeds', value === 'any' ? undefined : parseInt(value))}
          >
            <SelectTrigger className="h-14 pl-12 border-gray-200 rounded-xl">
              <SelectValue placeholder="Bedrooms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any Beds</SelectItem>
              <SelectItem value="1">1+ Bed</SelectItem>
              <SelectItem value="2">2+ Beds</SelectItem>
              <SelectItem value="3">3+ Beds</SelectItem>
              <SelectItem value="4">4+ Beds</SelectItem>
              <SelectItem value="5">5+ Beds</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Search Button */}
        <Button 
          onClick={onSearch} 
          disabled={isLoading}
          className="h-14 bg-gray-900 hover:bg-black text-white rounded-xl px-8 font-medium"
        >
          <Search className="h-5 w-5 mr-2" />
          {isLoading ? 'Searching...' : 'Search'}
        </Button>
      </div>

      {/* Property Type Pills */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Property Type
        </h3>
        <div className="flex flex-wrap gap-3">
          {propertyTypes.slice(1).map((type) => (
            <button
              key={type.value}
              onClick={() => handlePropertyTypeToggle(type.value)}
              className={`px-6 py-3 rounded-full border-2 transition-all font-medium ${
                selectedPropertyTypes.includes(type.value)
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Additional Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Select
          value={filters.minBaths?.toString() || 'any'}
          onValueChange={(value) => handleFilterChange('minBaths', value === 'any' ? undefined : parseInt(value))}
        >
          <SelectTrigger className="h-12 border-gray-200 rounded-xl">
            <SelectValue placeholder="Min Bathrooms" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any Baths</SelectItem>
            <SelectItem value="1">1+ Bath</SelectItem>
            <SelectItem value="2">2+ Baths</SelectItem>
            <SelectItem value="3">3+ Baths</SelectItem>
            <SelectItem value="4">4+ Baths</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          onClick={() => onFiltersChange({
            cities: dcBaltimoreAreas[0].value,
            limit: 20
          })}
          className="h-12 border-gray-200 rounded-xl"
        >
          Clear Filters
        </Button>
      </div>
    </div>
  )
}
