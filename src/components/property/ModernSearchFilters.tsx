
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

const priceRanges = {
  min: [
    { value: 'any', label: 'Any' },
    { value: '100000', label: '$100K' },
    { value: '200000', label: '$200K' },
    { value: '300000', label: '$300K' },
    { value: '400000', label: '$400K' },
    { value: '500000', label: '$500K' },
    { value: '600000', label: '$600K' },
    { value: '700000', label: '$700K' },
    { value: '800000', label: '$800K' },
    { value: '900000', label: '$900K' },
    { value: '1000000', label: '$1M+' },
  ],
  max: [
    { value: 'any', label: 'Any' },
    { value: '200000', label: '$200K' },
    { value: '300000', label: '$300K' },
    { value: '400000', label: '$400K' },
    { value: '500000', label: '$500K' },
    { value: '600000', label: '$600K' },
    { value: '700000', label: '$700K' },
    { value: '800000', label: '$800K' },
    { value: '900000', label: '$900K' },
    { value: '1000000', label: '$1M' },
    { value: '1500000', label: '$1.5M' },
    { value: '2000000', label: '$2M+' },
  ]
}

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

  const handleLocationChange = (value: string) => {
    handleFilterChange('cities', value || undefined)
  }

  const handlePriceChange = (key: 'minPrice' | 'maxPrice', value: string) => {
    const numericValue = value === 'any' ? undefined : parseInt(value)
    handleFilterChange(key, numericValue)
  }

  return (
    <div className="space-y-8">
      {/* Main Search Form */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Location Input */}
        <div className="md:col-span-2 lg:col-span-2">
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Enter an address, neighborhood, city, or ZIP code"
              value={filters.cities || ''}
              onChange={(e) => handleLocationChange(e.target.value)}
              className="h-14 pl-12 text-left border-gray-200 rounded-xl"
            />
          </div>
        </div>

        {/* Min Price Dropdown */}
        <div className="relative">
          <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
          <Select
            value={filters.minPrice?.toString() || 'any'}
            onValueChange={(value) => handlePriceChange('minPrice', value)}
          >
            <SelectTrigger className="h-14 pl-12 border-gray-200 rounded-xl">
              <SelectValue placeholder="Min Price" />
            </SelectTrigger>
            <SelectContent>
              {priceRanges.min.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Max Price Dropdown */}
        <div className="relative">
          <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
          <Select
            value={filters.maxPrice?.toString() || 'any'}
            onValueChange={(value) => handlePriceChange('maxPrice', value)}
          >
            <SelectTrigger className="h-14 pl-12 border-gray-200 rounded-xl">
              <SelectValue placeholder="Max Price" />
            </SelectTrigger>
            <SelectContent>
              {priceRanges.max.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Bedrooms */}
        <div className="relative">
          <Home className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
          <Select
            value={filters.minBeds?.toString() || 'any'}
            onValueChange={(value) => handleFilterChange('minBeds', value === 'any' ? undefined : parseInt(value))}
          >
            <SelectTrigger className="h-14 pl-12 border-gray-200 rounded-xl">
              <SelectValue placeholder="Beds" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="1">1+</SelectItem>
              <SelectItem value="2">2+</SelectItem>
              <SelectItem value="3">3+</SelectItem>
              <SelectItem value="4">4+</SelectItem>
              <SelectItem value="5">5+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bathrooms */}
        <div className="relative">
          <Select
            value={filters.minBaths?.toString() || 'any'}
            onValueChange={(value) => handleFilterChange('minBaths', value === 'any' ? undefined : parseInt(value))}
          >
            <SelectTrigger className="h-14 border-gray-200 rounded-xl">
              <SelectValue placeholder="Baths" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="1">1+</SelectItem>
              <SelectItem value="2">2+</SelectItem>
              <SelectItem value="3">3+</SelectItem>
              <SelectItem value="4">4+</SelectItem>
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

      {/* Clear Filters */}
      <div className="flex justify-start">
        <Button
          variant="outline"
          onClick={() => {
            setSelectedPropertyTypes([])
            onFiltersChange({
              cities: undefined,
              limit: 20
            })
          }}
          className="h-12 border-gray-200 rounded-xl"
        >
          Clear All Filters
        </Button>
      </div>
    </div>
  )
}
