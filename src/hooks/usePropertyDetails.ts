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

// Helper function to calculate days on market
const calculateDaysOnMarket = (createdAt: string): number => {
  const created = new Date(createdAt);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - created.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Enhanced property data mapping with fallbacks to raw_data
const mapDbPropertyToDetails = (dbProperty: any): PropertyDetails => {
  // Helper to get value from db field or raw_data
  const getValue = (dbField: any, rawDataKey: string) => {
    if (dbField !== null && dbField !== undefined && dbField !== '') {
      return dbField;
    }
    if (dbProperty.raw_data && dbProperty.raw_data[rawDataKey]) {
      const rawValue = dbProperty.raw_data[rawDataKey];
      return rawValue !== '' ? rawValue : null;
    }
    return null;
  };

  // Parse numeric values safely
  const parseNumber = (value: any): number | undefined => {
    if (value === null || value === undefined || value === '') return undefined;
    const parsed = typeof value === 'string' ? parseFloat(value.replace(/[,$]/g, '')) : Number(value);
    return isNaN(parsed) ? undefined : parsed;
  };

  const beds = parseNumber(getValue(dbProperty.beds, 'beds'));
  const baths = parseNumber(getValue(dbProperty.baths, 'baths'));
  const sqft = parseNumber(getValue(dbProperty.sqft, 'sqft'));
  const price = parseNumber(getValue(dbProperty.price, 'price'));

  return {
    beds,
    baths,
    sqft,
    price,
    pricePerSqft: sqft && price ? Math.round(price / sqft) : undefined,
    propertyType: getValue(dbProperty.property_type, 'property_type') || getValue(dbProperty.property_type, 'propertyType'),
    yearBuilt: parseNumber(getValue(dbProperty.year_built, 'year_built')),
    daysOnMarket: calculateDaysOnMarket(dbProperty.created_at),
    lotSize: getValue(dbProperty.lot_size, 'lot_size'),
    address: dbProperty.address,
    listingId: dbProperty.mls_id || dbProperty.idx_id,
    images: Array.isArray(dbProperty.images) ? dbProperty.images : [],
    description: getValue(dbProperty.description, 'description'),
    mlsId: dbProperty.mls_id,
    idxId: dbProperty.idx_id,
    city: getValue(dbProperty.city, 'city'),
    state: getValue(dbProperty.state, 'state'),
    zip: getValue(dbProperty.zip, 'zip'),
    status: getValue(dbProperty.status, 'status'),
    agentName: getValue(dbProperty.agent_name, 'agent_name'),
    agentPhone: getValue(dbProperty.agent_phone, 'agent_phone'),
    agentEmail: getValue(dbProperty.agent_email, 'agent_email')
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