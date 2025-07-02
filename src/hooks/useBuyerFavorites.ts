
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface FavoriteProperty {
  id: string;
  buyer_id: string;
  showing_request_id: string | null;
  property_address: string;
  notes: string | null;
  created_at: string;
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
      const { data, error } = await supabase
        .from('property_favorites')
        .select('*')
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
