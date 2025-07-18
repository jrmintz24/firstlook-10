
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { SearchFilters as SearchFiltersType } from "@/types/simplyrets"
import { Search, SlidersHorizontal } from "lucide-react"

interface SearchFiltersProps {
  filters: SearchFiltersType
  onFiltersChange: (filters: SearchFiltersType) => void
  onSearch: () => void
  isLoading?: boolean
}

export const SearchFilters = ({ filters, onFiltersChange, onSearch, isLoading }: SearchFiltersProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [usePriceSlider, setUsePriceSlider] = useState(true)

  const handleFilterChange = (key: keyof SearchFiltersType, value: string | number | undefined) => {
    onFiltersChange({
      ...filters,
      [key]: value
    })
  }

  const formatPrice = (price: string) => {
    const num = parseInt(price.replace(/,/g, ''))
    return isNaN(num) ? '' : num.toLocaleString()
  }

  const handlePriceChange = (key: 'minPrice' | 'maxPrice', value: string) => {
    const numericValue = parseInt(value.replace(/,/g, ''))
    handleFilterChange(key, isNaN(numericValue) ? undefined : numericValue)
  }

  const handlePriceSliderChange = (values: number[]) => {
    handleFilterChange('minPrice', values[0] === 0 ? undefined : values[0])
    handleFilterChange('maxPrice', values[1] === 2000000 ? undefined : values[1])
  }

  const dcBaltimoreAreas = [
    'Washington,Baltimore,Bethesda,Arlington,Alexandria,Silver Spring,Rockville,Gaithersburg,Annapolis',
    'Washington',
    'Baltimore', 
    'Bethesda',
    'Arlington',
    'Alexandria',
    'Silver Spring',
    'Rockville',
    'Gaithersburg',
    'Annapolis'
  ]

  return (
    <Card className="mb-6">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Search Properties</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2"
          >
            <SlidersHorizontal className="h-4 w-4" />
            {isExpanded ? 'Less Filters' : 'More Filters'}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Primary Filters - Always Visible */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Select
              value={filters.cities || dcBaltimoreAreas[0]}
              onValueChange={(value) => handleFilterChange('cities', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select area" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={dcBaltimoreAreas[0]}>DC/Baltimore Metro</SelectItem>
                {dcBaltimoreAreas.slice(1).map((city) => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Bedrooms */}
          <div className="space-y-2">
            <Label htmlFor="minBeds">Min Bedrooms</Label>
            <Select
              value={filters.minBeds?.toString() || 'any'}
              onValueChange={(value) => handleFilterChange('minBeds', value === 'any' ? undefined : parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Any" />
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
          <div className="space-y-2">
            <Label htmlFor="minBaths">Min Bathrooms</Label>
            <Select
              value={filters.minBaths?.toString() || 'any'}
              onValueChange={(value) => handleFilterChange('minBaths', value === 'any' ? undefined : parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Any" />
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
          <div className="space-y-2">
            <Label>&nbsp;</Label>
            <Button 
              onClick={onSearch} 
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <Search className="h-4 w-4 mr-2" />
              {isLoading ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </div>

        {/* Price Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Label className="text-sm font-medium">Price Range</Label>
            <div className="flex items-center gap-2">
              <Button
                variant={usePriceSlider ? "default" : "outline"}
                size="sm"
                onClick={() => setUsePriceSlider(true)}
              >
                Slider
              </Button>
              <Button
                variant={!usePriceSlider ? "default" : "outline"}
                size="sm"
                onClick={() => setUsePriceSlider(false)}
              >
                Manual
              </Button>
            </div>
          </div>

          {usePriceSlider ? (
            <div className="space-y-4">
              <Slider
                value={[filters.minPrice || 0, filters.maxPrice || 2000000]}
                min={0}
                max={2000000}
                step={25000}
                onValueChange={handlePriceSliderChange}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>${(filters.minPrice || 0).toLocaleString()}</span>
                <span>${(filters.maxPrice || 2000000).toLocaleString()}</span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minPrice">Min Price</Label>
                <Input
                  id="minPrice"
                  placeholder="$0"
                  value={filters.minPrice ? formatPrice(filters.minPrice.toString()) : ''}
                  onChange={(e) => handlePriceChange('minPrice', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxPrice">Max Price</Label>
                <Input
                  id="maxPrice"
                  placeholder="No limit"
                  value={filters.maxPrice ? formatPrice(filters.maxPrice.toString()) : ''}
                  onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        {/* Expanded Filters */}
        {isExpanded && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
            {/* Property Type */}
            <div className="space-y-2">
              <Label htmlFor="propertyType">Property Type</Label>
              <Select
                value={filters.propertyType || 'any'}
                onValueChange={(value) => handleFilterChange('propertyType', value === 'any' ? undefined : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Type</SelectItem>
                  <SelectItem value="Residential">Residential</SelectItem>
                  <SelectItem value="Condo">Condo</SelectItem>
                  <SelectItem value="Townhouse">Townhouse</SelectItem>
                  <SelectItem value="Multi-Family">Multi-Family</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Clear Filters */}
            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <Button
                variant="outline"
                onClick={() => onFiltersChange({
                  cities: dcBaltimoreAreas[0],
                  limit: 20
                })}
                className="w-full"
              >
                Clear All Filters
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
