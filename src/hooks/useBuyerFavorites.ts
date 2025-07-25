
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { enhancedBackfillFavorites } from "@/utils/backfillFavorites";

interface FavoriteProperty {
  id: string;
  buyer_id: string;
  showing_request_id: string | null;
  property_address: string;
  notes: string | null;
  created_at: string;
  mls_id?: string;
  idx_property_id?: string;
  // IDX property details
  idx_property?: {
    id: string;
    price: number | null;
    beds: number | null;
    baths: number | null;
    sqft: number | null;
    images: any;
    property_type: string | null;
    status: string | null;
    city: string | null;
    state: string | null;
  };
}

export const useBuyerFavorites = (buyerId?: string) => {
  const [favorites, setFavorites] = useState<FavoriteProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchFavorites = useCallback(async () => {
    if (!buyerId) {
      setLoading(false);
      return;
    }

    try {
      // First, try to backfill any missing IDX property data
      try {
        await enhancedBackfillFavorites(buyerId);
      } catch (backfillError) {
        console.warn('Backfill failed, continuing with normal fetch:', backfillError);
      }

      const { data, error } = await supabase
        .from('property_favorites')
        .select(`
          *,
          idx_property:idx_properties!left(
            id,
            price,
            beds,
            baths,
            sqft,
            images,
            property_type,
            status,
            city,
            state
          )
        `)
        .eq('buyer_id', buyerId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFavorites(data || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast({
        title: "Error",
        description: "Failed to load favorite properties.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [buyerId, toast]);

  const removeFavorite = useCallback(async (favoriteId: string) => {
    try {
      const { error } = await supabase
        .from('property_favorites')
        .delete()
        .eq('id', favoriteId);

      if (error) throw error;

      setFavorites(prev => prev.filter(fav => fav.id !== favoriteId));
      toast({
        title: "Removed",
        description: "Property removed from favorites.",
      });
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast({
        title: "Error",
        description: "Failed to remove property from favorites.",
        variant: "destructive"
      });
    }
  }, [toast]);

  const updateNotes = useCallback(async (favoriteId: string, notes: string) => {
    try {
      const { error } = await supabase
        .from('property_favorites')
        .update({ notes })
        .eq('id', favoriteId);

      if (error) throw error;

      setFavorites(prev => prev.map(fav => 
        fav.id === favoriteId ? { ...fav, notes } : fav
      ));
      
      toast({
        title: "Updated",
        description: "Notes updated successfully.",
      });
    } catch (error) {
      console.error('Error updating notes:', error);
      toast({
        title: "Error",
        description: "Failed to update notes.",
        variant: "destructive"
      });
    }
  }, [toast]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  return {
    favorites,
    loading,
    removeFavorite,
    updateNotes,
    refetchFavorites: fetchFavorites
  };
};
