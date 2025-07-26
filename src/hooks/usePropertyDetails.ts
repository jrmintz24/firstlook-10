import { useState, useEffect } from 'react';

interface PropertyDetails {
  beds?: number;
  baths?: number;
  sqft?: number;
  price?: number;
  pricePerSqft?: number;
  propertyType?: string;
  yearBuilt?: number;
  daysOnMarket?: number;
  lotSize?: string;
  address?: string;
  listingId?: string;
  images?: string[];
  description?: string;
}

// Mock data generator - replace with actual API call
const generateMockPropertyDetails = (address: string): PropertyDetails => {
  // Generate consistent mock data based on address
  const hash = address.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  const beds = 2 + (hash % 4);
  const baths = 1 + (hash % 3);
  const sqft = 1200 + (hash % 2000);
  const price = 400000 + (hash % 600000);
  const yearBuilt = 1980 + (hash % 44);
  const daysOnMarket = hash % 90;
  
  const propertyTypes = ['Single Family', 'Condo', 'Townhouse', 'Multi-Family'];
  const propertyType = propertyTypes[hash % propertyTypes.length];
  
  return {
    beds,
    baths,
    sqft,
    price,
    pricePerSqft: Math.round(price / sqft),
    propertyType,
    yearBuilt,
    daysOnMarket,
    lotSize: `${4000 + (hash % 10000)} sq ft`,
    address,
    description: `Beautiful ${beds} bed, ${baths} bath ${propertyType.toLowerCase()} in a desirable neighborhood.`
  };
};

export const usePropertyDetails = (address: string | undefined) => {
  const [details, setDetails] = useState<PropertyDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!address) {
      setDetails(null);
      return;
    }

    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // TODO: Replace with actual API call
        // const response = await fetch(`/api/properties/details?address=${encodeURIComponent(address)}`);
        // const data = await response.json();
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Use mock data for now
        const mockData = generateMockPropertyDetails(address);
        setDetails(mockData);
      } catch (err) {
        setError('Failed to fetch property details');
        console.error('Error fetching property details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [address]);

  return { details, loading, error };
};