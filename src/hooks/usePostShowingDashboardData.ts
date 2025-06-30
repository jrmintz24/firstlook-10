
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const usePostShowingDashboardData = (userId: string) => {
  const [completedShowings, setCompletedShowings] = useState<any[]>([]);
  const [postShowingActions, setPostShowingActions] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [agentConnections, setAgentConnections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!userId) return;

    const fetchDashboardData = async () => {
      try {
        // Get completed showings
        const { data: showingsData, error: showingsError } = await supabase
          .from('showing_requests')
          .select('*')
          .eq('user_id', userId)
          .eq('status', 'completed')
          .order('created_at', { ascending: false });

        if (showingsError) throw showingsError;

        // Get post-showing actions
        const { data: actionsData, error: actionsError } = await supabase
          .from('post_showing_actions')
          .select('*')
          .eq('buyer_id', userId)
          .order('created_at', { ascending: false });

        if (actionsError) throw actionsError;

        // Get property favorites
        const { data: favoritesData, error: favoritesError } = await supabase
          .from('property_favorites')
          .select('*')
          .eq('buyer_id', userId)
          .order('created_at', { ascending: false });

        if (favoritesError) throw favoritesError;

        // Get agent connections
        const { data: connectionsData, error: connectionsError } = await supabase
          .from('buyer_agent_matches')
          .select('*')
          .eq('buyer_id', userId)
          .order('created_at', { ascending: false });

        if (connectionsError) throw connectionsError;

        setCompletedShowings(showingsData || []);
        setPostShowingActions(actionsData || []);
        setFavorites(favoritesData || []);
        setAgentConnections(connectionsData || []);
        setLoading(false);

      } catch (error) {
        console.error('Error fetching post-showing dashboard data:', error);
        toast({
          title: "Error",
          description: "Unable to load activity data. Please try again.",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [userId, toast]);

  // Calculate actions summary
  const actionsSummary = {
    totalActions: postShowingActions.length,
    favoritedProperties: favorites.length,
    agentConnections: agentConnections.length,
    offerIntents: postShowingActions.filter(action => action.action_type === 'offer_intent').length
  };

  return {
    completedShowings,
    postShowingActions,
    favorites,
    agentConnections,
    loading,
    actionsSummary
  };
};
