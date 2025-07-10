export interface Property {
  mlsId: string
  listPrice: number
  listDate: string
  modificationTimestamp: string
  address: {
    streetNumber: string
    streetName: string
    unit?: string
    city: string
    state: string
    postalCode: string
    country: string
    full: string
  }
  geo: {
    lat: number
    lng: number
  }
  property: {
    bedrooms: number
    bathsFull: number
    bathsHalf: number
    area: number
    type: string
    subType: string
    yearBuilt?: number
    lotSize?: number
    stories?: number
    parking?: {
      spaces?: number
      type?: string
    }
    roof?: string
    cooling?: string
    heating?: string
    flooring?: string[]
  }
  listingAgent: {
    name?: string
    phone?: string
    email?: string
  }
  coListingAgent?: {
    name?: string
    phone?: string
    email?: string
  }
  office: {
    name?: string
    phone?: string
  }
  photos: string[]
  remarks?: string
  disclaimer?: string
  status: string
  mls: {
    status: string
    area: string
    daysOnMarket?: number
    originalListPrice?: number
  }
}

export interface SearchFilters {
  cities?: string
  minPrice?: number
  maxPrice?: number
  minBeds?: number
  minBaths?: number
  propertyType?: string
  limit?: number
  lastId?: string
}

export interface SearchResponse {
  properties: Property[]
  pagination: {
    total: number
    limit: number
    lastId: string | null
  }
}

export interface PropertyCardProps {
  property: Property
  onScheduleTour?: (property: Property) => void
  onSaveFavorite?: (property: Property) => void
}