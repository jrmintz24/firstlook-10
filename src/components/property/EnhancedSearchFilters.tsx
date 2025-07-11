
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { SearchFilters as SearchFiltersType } from "@/types/simplyrets"
import { Search, RotateCcw, Loader2 } from "lucide-react"
import { LocationInput } from "./LocationInput"
import { PriceRangeSelect } from "./PriceRangeSelect"
import { PropertyTypeFilter } from "./PropertyTypeFilter"
import { BedroomBathroomSelect } from "./BedroomBathroomSelect"

interface EnhancedSearchFiltersProps {
  filters: SearchFiltersType
  onFiltersChange: (filters: SearchFiltersType) => void
  onSearch: () => void
  isLoading?: boolean
}

export const EnhancedSearchFilters = ({ 
  filters, 
  onFiltersChange, 
  onSearch, 
  isLoading 
}: EnhancedSearchFiltersProps) => {
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>([])

  const handleFilterChange = (key: keyof SearchFiltersType, value: string | number | undefined) => {
    onFiltersChange({
      ...filters,
      [key]: value
    })
  }

  const handleLocationChange = (value: string) => {
    handleFilterChange('cities', value || undefined)
  }

  const handlePropertyTypeChange = (types: string[]) => {
    setSelectedPropertyTypes(types)
    handleFilterChange('propertyType', types.length === 0 ? undefined : types.join(','))
  }

  const handleClearAll = () => {
    setSelectedPropertyTypes([])
    onFiltersChange({
      cities: undefined,
      limit: 20
    })
  }

  const hasActiveFilters = filters.cities || filters.minPrice || filters.maxPrice || 
                          filters.minBeds || filters.minBaths || selectedPropertyTypes.length > 0

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Main Search Container */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        
        {/* Header with Clear Filters */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Find Your Perfect Home</h2>
          {hasActiveFilters && (
            <button
              onClick={handleClearAll}
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 hover:underline transition-colors"
              aria-label="Clear all search filters"
            >
              <RotateCcw className="h-4 w-4" />
              Clear All Filters
            </button>
          )}
        </div>

        {/* Main Search Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
          {/* Location - Takes 2 columns on large screens */}
          <div className="sm:col-span-2 lg:col-span-2">
            <LocationInput
              value={filters.cities || ''}
              onChange={handleLocationChange}
            />
          </div>

          {/* Price Range */}
          <div>
            <PriceRangeSelect
              type="min"
              value={filters.minPrice}
              onChange={(value) => handleFilterChange('minPrice', value)}
            />
          </div>

          <div>
            <PriceRangeSelect
              type="max"
              value={filters.maxPrice}
              onChange={(value) => handleFilterChange('maxPrice', value)}
            />
          </div>

          {/* Bedrooms */}
          <div>
            <BedroomBathroomSelect
              type="beds"
              value={filters.minBeds}
              onChange={(value) => handleFilterChange('minBeds', value)}
            />
          </div>

          {/* Bathrooms */}
          <div>
            <BedroomBathroomSelect
              type="baths"
              value={filters.minBaths}
              onChange={(value) => handleFilterChange('minBaths', value)}
            />
          </div>
        </div>

        {/* Property Type Filter */}
        <div className="mb-6">
          <PropertyTypeFilter
            selectedTypes={selectedPropertyTypes}
            onChange={handlePropertyTypeChange}
          />
        </div>

        {/* Search Button */}
        <div className="flex justify-center">
          <Button 
            onClick={onSearch} 
            disabled={isLoading}
            className="h-12 px-8 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg disabled:transform-none disabled:hover:shadow-md"
            aria-label="Search for properties"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="h-5 w-5 mr-2" />
                Search Properties
              </>
            )}
          </Button>
        </div>

        {/* Property Count Display */}
        {hasActiveFilters && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Search with your selected filters to see available properties
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
