import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface PropertyDetails {
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
  mlsId?: string;
  idxId?: string;
  city?: string;
  state?: string;
  zip?: string;
  status?: string;
  agentName?: string;
  agentPhone?: string;
  agentEmail?: string;
}

// Helper function to normalize address for matching
const normalizeAddress = (address: string): string => {
  return address
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[.,#]/g, '')
    .trim();
};

// Helper function to calculate days on market
const calculateDaysOnMarket = (createdAt: string): number => {
  const created = new Date(createdAt);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - created.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Convert database record to PropertyDetails
const mapDbPropertyToDetails = (dbProperty: any): PropertyDetails => {
  return {
    beds: dbProperty.beds,
    baths: dbProperty.baths,
    sqft: dbProperty.sqft,
    price: dbProperty.price,
    pricePerSqft: dbProperty.sqft && dbProperty.price 
      ? Math.round(dbProperty.price / dbProperty.sqft) 
      : undefined,
    propertyType: dbProperty.property_type,
    yearBuilt: dbProperty.year_built,
    daysOnMarket: calculateDaysOnMarket(dbProperty.created_at),
    lotSize: dbProperty.lot_size,
    address: dbProperty.address,
    listingId: dbProperty.mls_id || dbProperty.idx_id,
    images: Array.isArray(dbProperty.images) ? dbProperty.images : [],
    description: dbProperty.description,
    mlsId: dbProperty.mls_id,
    idxId: dbProperty.idx_id,
    city: dbProperty.city,
    state: dbProperty.state,
    zip: dbProperty.zip,
    status: dbProperty.status,
    agentName: dbProperty.agent_name,
    agentPhone: dbProperty.agent_phone,
    agentEmail: dbProperty.agent_email
  };
};

export const usePropertyDetails = (address: string | undefined, idxPropertyId?: string) => {
  const [details, setDetails] = useState<PropertyDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!address && !idxPropertyId) {
      setDetails(null);
      return;
    }

    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      
      try {
        let query = supabase
          .from('idx_properties')
          .select('*');

        // If we have an IDX property ID, use that for exact match
        if (idxPropertyId) {
          query = query.or(`idx_id.eq.${idxPropertyId},mls_id.eq.${idxPropertyId}`);
        } else if (address) {
          // Otherwise, try to match by address
          const normalizedAddress = normalizeAddress(address);
          
          // Try exact match first
          query = query.ilike('address', `%${address}%`);
        }

        const { data: properties, error: queryError } = await query.limit(1);

        if (queryError) {
          throw queryError;
        }

        if (properties && properties.length > 0) {
          const propertyDetails = mapDbPropertyToDetails(properties[0]);
          setDetails(propertyDetails);
        } else {
          // No property found in database
          console.warn(`No property found for ${idxPropertyId ? `ID: ${idxPropertyId}` : `address: ${address}`}`);
          setDetails(null);
        }
      } catch (err) {
        setError('Failed to fetch property details');
        console.error('Error fetching property details:', err);
        setDetails(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [address, idxPropertyId]);

  return { details, loading, error };
};