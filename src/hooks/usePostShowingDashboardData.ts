
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const usePostShowingDashboardData = (userId: string) => {
  const [completedShowings, setCompletedShowings] = useState<any[]>([]);
  const [postShowingActions, setPostShowingActions] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [agentConnections, setAgentConnections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchDashboardData = useCallback(async () => {
    if (!userId) return;

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
  }, [userId, toast]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!userId) return;

    console.log('Setting up real-time subscriptions for post-showing dashboard:', userId);

    // Subscribe to property favorites
    const favoritesChannel = supabase
      .channel(`property_favorites_${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'property_favorites',
          filter: `buyer_id=eq.${userId}`
        },
        (payload) => {
          console.log('Property favorites change:', payload);
          fetchDashboardData();
        }
      )
      .subscribe();

    // Subscribe to post-showing actions
    const actionsChannel = supabase
      .channel(`post_showing_actions_${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'post_showing_actions',
          filter: `buyer_id=eq.${userId}`
        },
        (payload) => {
          console.log('Post-showing actions change:', payload);
          fetchDashboardData();
        }
      )
      .subscribe();

    // Subscribe to buyer-agent matches
    const matchesChannel = supabase
      .channel(`buyer_agent_matches_${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'buyer_agent_matches',
          filter: `buyer_id=eq.${userId}`
        },
        (payload) => {
          console.log('Buyer-agent matches change:', payload);
          fetchDashboardData();
        }
      )
      .subscribe();

    // Subscribe to showing requests for completed status updates
    const showingsChannel = supabase
      .channel(`showing_requests_${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'showing_requests',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          console.log('Showing requests change:', payload);
          if (payload.new?.status === 'completed') {
            fetchDashboardData();
          }
        }
      )
      .subscribe();

    // Cleanup subscriptions
    return () => {
      console.log('Cleaning up post-showing dashboard subscriptions');
      supabase.removeChannel(favoritesChannel);
      supabase.removeChannel(actionsChannel);
      supabase.removeChannel(matchesChannel);
      supabase.removeChannel(showingsChannel);
    };
  }, [userId, fetchDashboardData]);

  // Initial data fetch
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Calculate actions summary
  const actionsSummary = {
    totalActions: postShowingActions.length,
    favoritedProperties: favorites.length,
    agentConnections: agentConnections.length,
    offerIntents: postShowingActions.filter(action => action.action_type === 'offer_intent').length
  };

  // Manual refresh function
  const refreshData = useCallback(() => {
    console.log('Manual refresh triggered for post-showing dashboard');
    return fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    completedShowings,
    postShowingActions,
    favorites,
    agentConnections,
    loading,
    actionsSummary,
    refreshData
  };
};
