import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SuggestedProperty {
  id: string;
  address: string;
  source: 'favorite' | 'recent_request';
  created_at: string;
  mls_id?: string;
  idx_property_id?: string;
}

export const useSuggestedProperties = (userId?: string) => {
  const [properties, setProperties] = useState<SuggestedProperty[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSuggestedProperties = async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      // Fetch favorite properties
      const { data: favorites, error: favError } = await supabase
        .from('property_favorites')
        .select('property_address, mls_id, idx_property_id, created_at')
        .eq('buyer_id', userId)
        .order('created_at', { ascending: false })
        .limit(5);

      // Fetch recent showing requests (last 10, completed or not)
      const { data: recentRequests, error: reqError } = await supabase
        .from('showing_requests')
        .select('property_address, created_at')
        .eq('buyer_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (favError) {
        console.error('Error fetching favorites:', favError);
      }

      if (reqError) {
        console.error('Error fetching recent requests:', reqError);
      }

      // Combine and deduplicate properties
      const combined: SuggestedProperty[] = [];
      const seenAddresses = new Set<string>();

      // Add favorites first (higher priority)
      if (favorites) {
        favorites.forEach((fav, index) => {
          if (fav.property_address && !seenAddresses.has(fav.property_address.toLowerCase())) {
            seenAddresses.add(fav.property_address.toLowerCase());
            combined.push({
              id: `fav-${index}`,
              address: fav.property_address,
              source: 'favorite',
              created_at: fav.created_at,
              mls_id: fav.mls_id,
              idx_property_id: fav.idx_property_id
            });
          }
        });
      }

      // Add recent requests (if not already in favorites)
      if (recentRequests) {
        recentRequests.forEach((req, index) => {
          if (req.property_address && !seenAddresses.has(req.property_address.toLowerCase())) {
            seenAddresses.add(req.property_address.toLowerCase());
            combined.push({
              id: `req-${index}`,
              address: req.property_address,
              source: 'recent_request',
              created_at: req.created_at
            });
          }
        });
      }

      // Sort by creation date (newest first) and take top 8
      const sorted = combined
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 8);

      setProperties(sorted);
    } catch (err) {
      console.error('Exception fetching suggested properties:', err);
      setError('Failed to load suggested properties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchSuggestedProperties();
    }
  }, [userId]);

  return {
    properties,
    loading,
    error,
    refetch: fetchSuggestedProperties
  };
};