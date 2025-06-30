
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PostShowingDashboardData {
  actionsSummary: {
    totalActions: number;
    favoritedProperties: number;
    agentConnections: number;
    offerIntents: number;
  };
  recentActions: any[];
  loading: boolean;
}

export const usePostShowingDashboardData = (userId: string) => {
  const [data, setData] = useState<PostShowingDashboardData>({
    actionsSummary: {
      totalActions: 0,
      favoritedProperties: 0,
      agentConnections: 0,
      offerIntents: 0,
    },
    recentActions: [],
    loading: true,
  });
  const { toast } = useToast();

  useEffect(() => {
    if (!userId) return;

    const fetchDashboardData = async () => {
      try {
        // Get post-showing actions
        const { data: actions, error: actionsError } = await supabase
          .from('post_showing_actions')
          .select('*')
          .eq('buyer_id', userId)
          .order('created_at', { ascending: false });

        if (actionsError) throw actionsError;

        // Get property favorites
        const { data: favorites, error: favoritesError } = await supabase
          .from('property_favorites')
          .select('*')
          .eq('buyer_id', userId);

        if (favoritesError) throw favoritesError;

        // Get agent connections
        const { data: agentConnections, error: agentError } = await supabase
          .from('buyer_agent_matches')
          .select('*')
          .eq('buyer_id', userId);

        if (agentError) throw agentError;

        // Get offer intents
        const { data: offerIntents, error: offerError } = await supabase
          .from('offer_intents')
          .select('*')
          .eq('buyer_id', userId);

        if (offerError) throw offerError;

        // Calculate summary
        const actionsSummary = {
          totalActions: (actions?.length || 0) + (favorites?.length || 0) + (agentConnections?.length || 0) + (offerIntents?.length || 0),
          favoritedProperties: favorites?.length || 0,
          agentConnections: agentConnections?.length || 0,
          offerIntents: offerIntents?.length || 0,
        };

        // Get recent actions (last 10)
        const recentActions = [
          ...(actions || []).map(action => ({ ...action, type: 'action' })),
          ...(favorites || []).map(fav => ({ ...fav, type: 'favorite' })),
          ...(agentConnections || []).map(conn => ({ ...conn, type: 'agent_connection' })),
          ...(offerIntents || []).map(offer => ({ ...offer, type: 'offer_intent' })),
        ]
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 10);

        setData({
          actionsSummary,
          recentActions,
          loading: false,
        });

      } catch (error) {
        console.error('Error fetching post-showing dashboard data:', error);
        toast({
          title: "Error",
          description: "Unable to load activity data. Please try again.",
          variant: "destructive",
        });
        setData(prev => ({ ...prev, loading: false }));
      }
    };

    fetchDashboardData();
  }, [userId, toast]);

  return data;
};
