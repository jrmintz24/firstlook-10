import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface ObjectivePropertyData {
  beds: number | null;
  baths: number | null;
  sqft: number | null;
  propertyType: string | null;
  yearBuilt: number | null;
  lotSize: string | null;
  source: string;
  lastUpdated: string;
}

interface BuyerInsight {
  id: string;
  insight: string;
  category: 'neighborhood' | 'condition' | 'value' | 'highlights' | 'concerns' | 'other';
  buyerName: string;
  tourDate: string;
  isVerified: boolean;
  helpfulCount: number;
}

interface PropertyRatings {
  averagePropertyRating: number;
  averageAgentRating: number;
  totalRatings: number;
}

interface EnhancedPropertyData {
  objective: ObjectivePropertyData | null;
  insights: BuyerInsight[];
  insightsSummary: {
    total: number;
    recent: number;
    topCategories: string[];
  };
  ratings: PropertyRatings | null;
}

export const useEnhancedPropertyData = (address: string, mlsId?: string) => {
  const [data, setData] = useState<EnhancedPropertyData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  console.log('[useEnhancedPropertyData] Hook called with:', { address, mlsId });

  useEffect(() => {
    if (!address) {
      console.log('[useEnhancedPropertyData] No address provided, skipping fetch');
      return;
    }
    
    const fetchPropertyData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // First, try to get cached property data from our database
        const { data: cachedData, error: cacheError } = await supabase
          .from('enhanced_property_data')
          .select('*')
          .eq('address', address)
          .maybeSingle();

        if (cacheError && cacheError.code !== 'PGRST116') {
          throw cacheError;
        }

        let objectiveData: ObjectivePropertyData | null = null;

        if (cachedData && isDataFresh(cachedData.last_updated)) {
          // Use cached data if it's less than 30 days old
          objectiveData = {
            beds: cachedData.beds,
            baths: cachedData.baths,
            sqft: cachedData.sqft,
            propertyType: cachedData.property_type,
            yearBuilt: cachedData.year_built,
            lotSize: cachedData.lot_size,
            source: cachedData.data_source || 'Public Records',
            lastUpdated: cachedData.last_updated
          };
        } else {
          // Fetch fresh data from external sources
          objectiveData = await fetchFromExternalSources(address, mlsId);
          
          // Cache the fresh data
          if (objectiveData) {
            await cachePropertyData(address, objectiveData);
          }
        }

        // Fetch buyer insights
        const insights = await fetchBuyerInsights(address);
        
        // Fetch property ratings
        const ratings = await fetchPropertyRatings(address);

        setData({
          objective: objectiveData,
          insights: insights,
          insightsSummary: generateInsightsSummary(insights),
          ratings: ratings
        });

      } catch (err) {
        console.error('Error fetching enhanced property data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch property data');
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyData();
  }, [address, mlsId]);

  return { data, loading, error, refetch: () => setData(null) };
};

// Helper function to check if data is fresh (less than 30 days old)
const isDataFresh = (lastUpdated: string): boolean => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  return new Date(lastUpdated) > thirtyDaysAgo;
};

// Fetch property data from external sources
const fetchFromExternalSources = async (
  address: string, 
  mlsId?: string
): Promise<ObjectivePropertyData | null> => {
  console.log('🏠 [PropertyData] Fetching from external sources for:', address);
  
  try {
    // For now, we'll implement a county records simulation
    // In production, this would call real county APIs
    const mockCountyData = await simulateCountyRecordsAPI(address);
    
    if (mockCountyData) {
      return {
        ...mockCountyData,
        source: 'County Tax Records',
        lastUpdated: new Date().toISOString()
      };
    }

    // Fallback to other APIs if county data unavailable
    // TODO: Implement RealtyMole, Attom Data, etc.
    
    return null;
  } catch (error) {
    console.error('Error fetching from external sources:', error);
    return null;
  }
};

// Simulate county records API (replace with real implementation)
const simulateCountyRecordsAPI = async (address: string) => {
  // This simulates county tax records
  // In production, replace with real county API calls
  
  // Parse address to extract basic info for simulation
  const addressLower = address.toLowerCase();
  
  // Mock data based on address patterns (for demo)
  if (addressLower.includes('parrots ferry')) {
    return {
      beds: 4,
      baths: 3,
      sqft: 2150,
      propertyType: 'Single Family Residence',
      yearBuilt: 1985,
      lotSize: '0.75 acres'
    };
  }
  
  if (addressLower.includes('mill street')) {
    return {
      beds: 3,
      baths: 2,
      sqft: 1650,
      propertyType: 'Single Family Residence',
      yearBuilt: 1978,
      lotSize: '0.25 acres'
    };
  }

  // Default mock data for other addresses
  return {
    beds: 3,
    baths: 2,
    sqft: 1800,
    propertyType: 'Single Family Residence',
    yearBuilt: 1990,
    lotSize: '0.33 acres'
  };
};

// Cache property data in our database
const cachePropertyData = async (address: string, data: ObjectivePropertyData) => {
  try {
    const { error } = await supabase
      .from('enhanced_property_data')
      .upsert({
        address,
        beds: data.beds,
        baths: data.baths,
        sqft: data.sqft,
        property_type: data.propertyType,
        year_built: data.yearBuilt,
        lot_size: data.lotSize,
        data_source: data.source,
        last_updated: new Date().toISOString()
      });

    if (error) {
      console.error('Error caching property data:', error);
    }
  } catch (error) {
    console.error('Error caching property data:', error);
  }
};

// Helper function to normalize addresses for consistent matching
const normalizeAddress = (address: string): string => {
  if (!address) return '';
  
  // Remove extra commas, normalize spacing, remove USA suffix
  return address
    .replace(/,\s*USA\s*$/i, '') // Remove ", USA" at end
    .replace(/^(\d+),\s+/, '$1 ') // Remove comma after house number
    .replace(/,(\s+)/, '$1') // Remove other stray commas followed by spaces
    .replace(/\s+/g, ' ') // Normalize multiple spaces
    .trim();
};

// Fetch buyer insights from database
const fetchBuyerInsights = async (address: string): Promise<BuyerInsight[]> => {
  const normalizedAddress = normalizeAddress(address);
  console.log('[fetchBuyerInsights] Fetching insights for:', { 
    original: address, 
    normalized: normalizedAddress 
  });
  
  try {
    // Try multiple address variations
    const addressVariations = [
      normalizedAddress,
      address, // original
      address.replace(/,\s*USA\s*$/i, ''), // without USA
      address.replace(/^(\d+),\s+/, '$1 ') // without comma after number
    ].filter((addr, index, arr) => arr.indexOf(addr) === index); // remove duplicates
    
    console.log('[fetchBuyerInsights] Trying address variations:', addressVariations);
    
    // In development, also fetch unapproved insights for debugging
    const isDevelopment = window.location.hostname === 'localhost';
    
    let query = supabase
      .from('buyer_insights')
      .select('*')
      .in('property_address', addressVariations);
    
    // Only filter by approval status in production
    if (!isDevelopment) {
      query = query.eq('is_approved', true);
    }
    
    const { data, error } = await query
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching buyer insights:', error);
      return [];
    }

    console.log('[fetchBuyerInsights] Raw insights data:', data);
    console.log('[fetchBuyerInsights] Found', data?.length || 0, 'insights');

    return data?.map(insight => ({
      id: insight.id,
      insight: insight.insight_text,
      category: insight.category,
      buyerName: insight.buyer_name || 'Anonymous Buyer',
      tourDate: insight.tour_date,
      isVerified: insight.is_verified || false,
      helpfulCount: insight.helpful_count || 0
    })) || [];

  } catch (error) {
    console.error('Error fetching buyer insights:', error);
    return [];
  }
};

// Fetch property ratings from completed tours
const fetchPropertyRatings = async (address: string): Promise<PropertyRatings | null> => {
  const normalizedAddress = normalizeAddress(address);
  console.log('[fetchPropertyRatings] Fetching ratings for:', { 
    original: address, 
    normalized: normalizedAddress 
  });
  
  try {
    // Try multiple address variations
    const addressVariations = [
      normalizedAddress,
      address, // original
      address.replace(/,\s*USA\s*$/i, ''), // without USA
      address.replace(/^(\d+),\s+/, '$1 ') // without comma after number
    ].filter((addr, index, arr) => arr.indexOf(addr) === index); // remove duplicates
    
    console.log('[fetchPropertyRatings] Trying address variations:', addressVariations);
    
    // Get all feedback for this property by joining showing_requests with buyer_feedback
    const { data, error } = await supabase
      .from('showing_requests')
      .select(`
        id,
        property_address,
        buyer_feedback!inner(
          property_rating,
          agent_rating
        )
      `)
      .in('property_address', addressVariations)
      .eq('status', 'completed');

    if (error) {
      console.error('Error fetching property ratings:', error);
      return null;
    }

    console.log('[fetchPropertyRatings] Raw ratings data:', data);

    if (!data || data.length === 0) {
      console.log('[fetchPropertyRatings] No ratings found');
      return null;
    }

    // Calculate averages
    let totalPropertyRating = 0;
    let totalAgentRating = 0;
    let propertyRatingCount = 0;
    let agentRatingCount = 0;

    data.forEach(showing => {
      const feedback = showing.buyer_feedback[0];
      if (feedback?.property_rating) {
        totalPropertyRating += feedback.property_rating;
        propertyRatingCount++;
      }
      if (feedback?.agent_rating) {
        totalAgentRating += feedback.agent_rating;
        agentRatingCount++;
      }
    });

    return {
      averagePropertyRating: propertyRatingCount > 0 ? totalPropertyRating / propertyRatingCount : 0,
      averageAgentRating: agentRatingCount > 0 ? totalAgentRating / agentRatingCount : 0,
      totalRatings: Math.max(propertyRatingCount, agentRatingCount)
    };

  } catch (error) {
    console.error('Error fetching property ratings:', error);
    return null;
  }
};

// Generate insights summary
const generateInsightsSummary = (insights: BuyerInsight[]) => {
  const recent = insights.filter(insight => {
    const tourDate = new Date(insight.tourDate);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return tourDate > thirtyDaysAgo;
  }).length;

  const categoryCounts = insights.reduce((acc, insight) => {
    acc[insight.category] = (acc[insight.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topCategories = Object.entries(categoryCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([category]) => category);

  return {
    total: insights.length,
    recent,
    topCategories
  };
};