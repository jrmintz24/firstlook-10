// On-demand property lookup service using MLS ID
export interface PropertyLookupData {
  mlsId: string;
  address: string;
  price: string;
  beds: string;
  baths: string;
  sqft: string;
  images: string[];
  propertyUrl: string;
}

export const lookupPropertyByMlsId = async (mlsId: string, originalAddress?: string): Promise<PropertyLookupData | null> => {
  try {
    console.log('🔍 [Property Lookup] Fetching property data for MLS ID:', mlsId, 'Original address:', originalAddress);
    
    // For now, we'll use realistic mock data based on MLS ID patterns
    // In the future, this could call your IDX provider's API
    const propertyData = generatePropertyDataFromMlsId(mlsId, originalAddress);
    
    console.log('✅ [Property Lookup] Found property data:', propertyData);
    return propertyData;
    
  } catch (error) {
    console.error('❌ [Property Lookup] Error fetching property data:', error);
    return null;
  }
};

const generatePropertyDataFromMlsId = (mlsId: string, originalAddress?: string): PropertyLookupData => {
  // Generate realistic property data based on MLS ID patterns
  const mlsNumber = mlsId.replace(/[^0-9]/g, '');
  const lastDigit = parseInt(mlsNumber.slice(-1)) || 0;
  const secondLastDigit = parseInt(mlsNumber.slice(-2, -1)) || 0;
  
  // Use MLS ID to determine property characteristics
  const priceRanges = [650000, 750000, 850000, 950000, 1200000];
  const bedCounts = [3, 4, 4, 5, 5];
  const bathCounts = [2, 2.5, 3, 3.5, 4];
  const sqftRanges = [1800, 2200, 2600, 3000, 3400];
  
  const priceIndex = lastDigit % priceRanges.length;
  const bedIndex = secondLastDigit % bedCounts.length;
  
  // Generate property images based on MLS ID
  const imageUrls = [
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=400&h=300&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=400&h=300&fit=crop&auto=format'
  ];
  
  const selectedImages = [
    imageUrls[lastDigit % imageUrls.length],
    imageUrls[(lastDigit + 1) % imageUrls.length],
    imageUrls[(lastDigit + 2) % imageUrls.length]
  ];
  
  return {
    mlsId,
    address: originalAddress || 'Property Address Not Available', // Use original address if available
    price: `$${priceRanges[priceIndex].toLocaleString()}`,
    beds: `${bedCounts[bedIndex]} bed${bedCounts[bedIndex] > 1 ? 's' : ''}`,
    baths: `${bathCounts[bedIndex]} bath${bathCounts[bedIndex] > 1 ? 's' : ''}`,
    sqft: `${sqftRanges[bedIndex].toLocaleString()} sqft`,
    images: selectedImages,
    propertyUrl: `https://www.firstlookhometours.com/listing?id=${mlsId}`
  };
};

// Cache for property lookups to avoid repeated calls
const propertyCache = new Map<string, PropertyLookupData>();

export const getCachedPropertyData = async (mlsId: string, originalAddress?: string): Promise<PropertyLookupData | null> => {
  // Check cache first
  if (propertyCache.has(mlsId)) {
    console.log('🎯 [Property Lookup] Using cached data for MLS ID:', mlsId);
    return propertyCache.get(mlsId) || null;
  }
  
  // Fetch and cache
  const propertyData = await lookupPropertyByMlsId(mlsId, originalAddress);
  if (propertyData) {
    propertyCache.set(mlsId, propertyData);
  }
  
  return propertyData;
};