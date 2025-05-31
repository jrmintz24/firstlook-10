
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Grid, List, Loader2, Home } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PropertyCard from "@/components/PropertyCard";
import { Property, PropertyFilters } from "@/types/property";

const Properties = () => {
  const [filters, setFilters] = useState<PropertyFilters>({
    sortBy: 'newest',
    sortOrder: 'desc'
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const { toast } = useToast();

  const { data: properties, isLoading, error, refetch } = useQuery({
    queryKey: ['properties', filters],
    queryFn: async () => {
      let query = supabase
        .from('properties')
        .select('*')
        .eq('status', 'active');

      // Apply filters
      if (filters.search) {
        query = query.or(`address.ilike.%${filters.search}%,city.ilike.%${filters.search}%`);
      }
      
      if (filters.minPrice) {
        query = query.gte('price', filters.minPrice);
      }
      
      if (filters.maxPrice) {
        query = query.lte('price', filters.maxPrice);
      }
      
      if (filters.beds) {
        query = query.gte('beds', filters.beds);
      }
      
      if (filters.baths) {
        query = query.gte('baths', filters.baths);
      }
      
      if (filters.propertyType && filters.propertyType !== 'all') {
        query = query.eq('property_type', filters.propertyType);
      }

      // Apply sorting
      if (filters.sortBy === 'price') {
        query = query.order('price', { ascending: filters.sortOrder === 'asc' });
      } else if (filters.sortBy === 'sqft') {
        query = query.order('sqft', { ascending: filters.sortOrder === 'asc' });
      } else if (filters.sortBy === 'newest') {
        query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data as Property[];
    }
  });

  const syncProperties = async () => {
    try {
      const response = await fetch('/functions/v1/sync-properties', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1Z2NoZWd1a2NjY3VxcGNzcWhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3MTU4NzQsImV4cCI6MjA2NDI5MTg3NH0.4r_GivJvzSZGgFizHGKoGdGnxa7hbZJr2FhgnAUeGdE`,
          'Content-Type': 'application/json',
        },
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast({
          title: "Data Updated!",
          description: `Successfully synced ${result.records_processed} properties`,
        });
        refetch();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Sync Failed",
        description: "Failed to update property data. Please try again.",
        variant: "destructive"
      });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const updateFilter = (key: keyof PropertyFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <Card className="p-6 text-center">
          <CardContent>
            <p className="text-red-600 mb-4">Failed to load properties: {error.message}</p>
            <Button onClick={() => refetch()}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Property Search</h1>
              <p className="text-gray-600 mt-1">
                {properties ? `${properties.length} properties available` : 'Loading...'}
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
              </Button>
              
              <div className="flex items-center border rounded-lg bg-white">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
              
              <Button onClick={syncProperties} className="bg-gradient-to-r from-blue-600 to-green-600">
                Refresh Data
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="w-80 flex-shrink-0">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    Search & Filter
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Search */}
                  <div>
                    <Label htmlFor="search">Location Search</Label>
                    <Input
                      id="search"
                      placeholder="Search by address or neighborhood..."
                      value={filters.search || ''}
                      onChange={(e) => updateFilter('search', e.target.value)}
                    />
                  </div>

                  {/* Price Range */}
                  <div>
                    <Label>Price Range</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <Input
                        type="number"
                        placeholder="Min price"
                        value={filters.minPrice || ''}
                        onChange={(e) => updateFilter('minPrice', e.target.value ? parseInt(e.target.value) : undefined)}
                      />
                      <Input
                        type="number"
                        placeholder="Max price"
                        value={filters.maxPrice || ''}
                        onChange={(e) => updateFilter('maxPrice', e.target.value ? parseInt(e.target.value) : undefined)}
                      />
                    </div>
                  </div>

                  {/* Bedrooms */}
                  <div>
                    <Label>Minimum Bedrooms</Label>
                    <Select value={filters.beds?.toString() || ''} onValueChange={(value) => updateFilter('beds', value ? parseInt(value) : undefined)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Any</SelectItem>
                        <SelectItem value="1">1+</SelectItem>
                        <SelectItem value="2">2+</SelectItem>
                        <SelectItem value="3">3+</SelectItem>
                        <SelectItem value="4">4+</SelectItem>
                        <SelectItem value="5">5+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Bathrooms */}
                  <div>
                    <Label>Minimum Bathrooms</Label>
                    <Select value={filters.baths?.toString() || ''} onValueChange={(value) => updateFilter('baths', value ? parseInt(value) : undefined)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Any</SelectItem>
                        <SelectItem value="1">1+</SelectItem>
                        <SelectItem value="2">2+</SelectItem>
                        <SelectItem value="3">3+</SelectItem>
                        <SelectItem value="4">4+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Property Type */}
                  <div>
                    <Label>Property Type</Label>
                    <Select value={filters.propertyType || 'all'} onValueChange={(value) => updateFilter('propertyType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="Single Family">Single Family</SelectItem>
                        <SelectItem value="Townhouse">Townhouse</SelectItem>
                        <SelectItem value="Condo">Condo</SelectItem>
                        <SelectItem value="Cooperative">Cooperative</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Sort */}
                  <div>
                    <Label>Sort By</Label>
                    <Select value={filters.sortBy || 'newest'} onValueChange={(value) => updateFilter('sortBy', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Newest Listed</SelectItem>
                        <SelectItem value="price">Price</SelectItem>
                        <SelectItem value="sqft">Square Footage</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Results */}
          <div className="flex-1">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading properties...</span>
              </div>
            ) : properties && properties.length > 0 ? (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                {properties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={{
                      id: property.id,
                      address: property.address,
                      price: formatPrice(property.price),
                      beds: property.beds,
                      baths: property.baths,
                      sqft: property.sqft?.toString() || '',
                      propertyType: property.property_type || 'Property',
                      image: property.images?.[0] || '/placeholder.svg'
                    }}
                  />
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <CardContent>
                  <Home className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No Properties Found</h3>
                  <p className="text-gray-500 mb-4">
                    {filters.search || filters.minPrice || filters.maxPrice 
                      ? "Try adjusting your search filters" 
                      : "No properties are currently available"}
                  </p>
                  <Button onClick={syncProperties} variant="outline">
                    Refresh Data
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Properties;
