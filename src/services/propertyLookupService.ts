// On-demand property lookup service using MLS ID
import { supabase } from '@/integrations/supabase/client';

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

export const lookupPropertyByIdxId = async (searchKey: string, originalAddress?: string): Promise<PropertyLookupData | null> => {
  try {
    console.log('🔍 [Property Lookup] Searching for property with key:', searchKey, 'Original address:', originalAddress);
    
    // First try: Search by idx_id if it looks like an ID
    if (searchKey && searchKey.length < 100) {
      const { data: idxData, error: idxError } = await supabase
        .from('idx_properties')
        .select('*')
        .eq('idx_id', searchKey)
        .single();
      
      if (idxData) {
        console.log('✅ [Property Lookup] Found property by idx_id:', idxData);
        return formatDatabaseProperty(idxData, originalAddress);
      }
      
      // Second try: Search by mls_id
      const { data: mlsData, error: mlsError } = await supabase
        .from('idx_properties')
        .select('*')
        .eq('mls_id', searchKey)
        .single();
      
      if (mlsData) {
        console.log('✅ [Property Lookup] Found property by mls_id:', mlsData);
        return formatDatabaseProperty(mlsData, originalAddress);
      }
    }
    
    // Third try: Search by address if we have one
    const addressToSearch = originalAddress || searchKey;
    if (addressToSearch && addressToSearch.length > 10) {
      console.log('🔍 [Property Lookup] Searching by address:', addressToSearch);
      
      const { data: addressData, error: addressError } = await supabase
        .from('idx_properties')
        .select('*')
        .eq('address', addressToSearch)
        .single();
      
      if (addressData) {
        console.log('✅ [Property Lookup] Found property by address:', addressData);
        return formatDatabaseProperty(addressData, originalAddress);
      }
      
      // Fourth try: Fuzzy address search (contains)
      const { data: fuzzyData, error: fuzzyError } = await supabase
        .from('idx_properties')
        .select('*')
        .ilike('address', `%${addressToSearch.split(',')[0]}%`)
        .limit(1)
        .single();
      
      if (fuzzyData) {
        console.log('✅ [Property Lookup] Found property by fuzzy address match:', fuzzyData);
        return formatDatabaseProperty(fuzzyData, originalAddress);
      }
    }
    
    // If no real data found, return null instead of fake data
    console.log('❌ [Property Lookup] No property found in database for search key:', searchKey);
    return null;
    
  } catch (error) {
    console.error('❌ [Property Lookup] Error fetching property data:', error);
    return null;
  }
};

const formatDatabaseProperty = (dbProperty: any, originalAddress?: string): PropertyLookupData => {
  console.log('📄 [Property Lookup] Formatting database property:', dbProperty);
  
  // Handle images - they might be stored as JSON array or simple array
  let images: string[] = [];
  if (dbProperty.images) {
    try {
      if (Array.isArray(dbProperty.images)) {
        // If it's already an array, extract URLs
        images = dbProperty.images.map((img: any) => {
          if (typeof img === 'string') return img;
          if (typeof img === 'object' && img.url) return img.url;
          return img;
        }).filter(Boolean);
      } else if (typeof dbProperty.images === 'string') {
        const parsed = JSON.parse(dbProperty.images);
        images = Array.isArray(parsed) ? parsed : [parsed];
      }
    } catch (e) {
      console.log('📷 [Property Lookup] Could not parse images, using fallback');
      images = [];
    }
  }
  
  // Don't use default images - leave empty if no real images
  if (images.length === 0) {
    images = [];
  }
  
  return {
    mlsId: dbProperty.idx_id || dbProperty.mls_id, // Use idx_id if available, fallback to mls_id
    address: originalAddress || dbProperty.address || 'Property',
    price: dbProperty.price ? `$${Number(dbProperty.price).toLocaleString()}` : '',
    beds: dbProperty.beds ? `${dbProperty.beds} bed${dbProperty.beds > 1 ? 's' : ''}` : '',
    baths: dbProperty.baths ? `${dbProperty.baths} bath${dbProperty.baths > 1 ? 's' : ''}` : '',
    sqft: dbProperty.sqft ? `${Number(dbProperty.sqft).toLocaleString()} sqft` : '',
    images,
    propertyUrl: dbProperty.ihf_page_url || `https://www.firstlookhometours.com/listing?id=${dbProperty.idx_id || dbProperty.mls_id}`
  };
};

const storePropertyData = async (propertyData: PropertyLookupData) => {
  try {
    console.log('💾 [Property Lookup] Storing property data in database:', propertyData);
    
    const { error } = await supabase
      .from('idx_properties')
      .upsert({
        idx_id: propertyData.mlsId, // Store as idx_id (primary IDX identifier)
        mls_id: propertyData.mlsId, // Also store as mls_id for compatibility
        address: propertyData.address,
        price: parseInt(propertyData.price.replace(/[^\d]/g, '')) || null,
        beds: parseInt(propertyData.beds.replace(/[^\d]/g, '')) || null,
        baths: parseFloat(propertyData.baths.replace(/[^\d.]/g, '')) || null,
        sqft: parseInt(propertyData.sqft.replace(/[^\d]/g, '')) || null,
        images: propertyData.images,
        ihf_page_url: propertyData.propertyUrl,
        property_type: 'Single Family Residential',
        status: 'Active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'idx_id'
      });
    
    if (error) {
      console.error('❌ [Property Lookup] Error storing property data:', error);
    } else {
      console.log('✅ [Property Lookup] Property data stored successfully');
    }
  } catch (error) {
    console.error('❌ [Property Lookup] Error storing property data:', error);
  }
};


// Cache for property lookups to avoid repeated calls
const propertyCache = new Map<string, PropertyLookupData>();

export const getCachedPropertyData = async (searchKey: string, originalAddress?: string): Promise<PropertyLookupData | null> => {
  // Create cache key using address if available, otherwise use search key
  const cacheKey = originalAddress || searchKey;
  
  // Check cache first
  if (propertyCache.has(cacheKey)) {
    console.log('🎯 [Property Lookup] Using cached data for key:', cacheKey);
    return propertyCache.get(cacheKey) || null;
  }
  
  // Fetch and cache
  const propertyData = await lookupPropertyByIdxId(searchKey, originalAddress);
  if (propertyData) {
    propertyCache.set(cacheKey, propertyData);
  }
  
  return propertyData;
};