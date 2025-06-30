
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PostShowingNotification {
  id: string;
  showing_id: string;
  buyer_name: string;
  property_address: string;
  action_type: string;
  action_details: any;
  created_at: string;
  read: boolean;
}

export const useAgentPostShowingNotifications = (agentId: string) => {
  const [notifications, setNotifications] = useState<PostShowingNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchNotifications = useCallback(async () => {
    if (!agentId) return;

    try {
      // Get recent completed showings for this agent
      const { data: showings, error: showingsError } = await supabase
        .from('showing_requests')
        .select(`
          id,
          property_address,
          status_updated_at,
          profiles!inner(first_name, last_name)
        `)
        .eq('assigned_agent_id', agentId)
        .eq('status', 'completed')
        .gte('status_updated_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .order('status_updated_at', { ascending: false });

      if (showingsError) throw showingsError;

      const showingIds = showings?.map(s => s.id) || [];

      // Get post-showing actions for these showings
      const { data: actions, error: actionsError } = await supabase
        .from('post_showing_actions')
        .select('*')
        .in('showing_request_id', showingIds)
        .order('created_at', { ascending: false });

      if (actionsError) throw actionsError;

      // Get favorites and agent connections as notifications too
      const { data: favorites } = await supabase
        .from('property_favorites')
        .select('*')
        .in('showing_request_id', showingIds)
        .order('created_at', { ascending: false });

      const { data: agentConnections } = await supabase
        .from('buyer_agent_matches')
        .select('*')
        .in('showing_request_id', showingIds)
        .eq('agent_id', agentId)
        .order('created_at', { ascending: false });

      // Combine all notifications
      const allNotifications: PostShowingNotification[] = [];

      // Add post-showing actions
      actions?.forEach(action => {
        const showing = showings?.find(s => s.id === action.showing_request_id);
        if (showing) {
          allNotifications.push({
            id: `action-${action.id}`,
            showing_id: action.showing_request_id,
            buyer_name: `${showing.profiles?.first_name || ''} ${showing.profiles?.last_name || ''}`.trim() || 'Unknown',
            property_address: showing.property_address,
            action_type: action.action_type,
            action_details: action.action_details,
            created_at: action.created_at,
            read: false // We'll implement read tracking later
          });
        }
      });

      // Add favorites
      favorites?.forEach(favorite => {
        const showing = showings?.find(s => s.id === favorite.showing_request_id);
        if (showing) {
          allNotifications.push({
            id: `favorite-${favorite.id}`,
            showing_id: favorite.showing_request_id,
            buyer_name: `${showing.profiles?.first_name || ''} ${showing.profiles?.last_name || ''}`.trim() || 'Unknown',
            property_address: showing.property_address,
            action_type: 'favorite_property',
            action_details: { notes: favorite.notes },
            created_at: favorite.created_at,
            read: false
          });
        }
      });

      // Add agent connections
      agentConnections?.forEach(connection => {
        const showing = showings?.find(s => s.id === connection.showing_request_id);
        if (showing) {
          allNotifications.push({
            id: `connection-${connection.id}`,
            showing_id: connection.showing_request_id,
            buyer_name: `${showing.profiles?.first_name || ''} ${showing.profiles?.last_name || ''}`.trim() || 'Unknown',
            property_address: showing.property_address,
            action_type: 'connect_with_agent',
            action_details: { match_source: connection.match_source },
            created_at: connection.created_at,
            read: false
          });
        }
      });

      // Sort by date (most recent first)
      allNotifications.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setNotifications(allNotifications);
      setUnreadCount(allNotifications.filter(n => !n.read).length);

    } catch (error) {
      console.error('Error fetching post-showing notifications:', error);
      toast({
        title: "Error",
        description: "Unable to load notifications. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [agentId, toast]);

  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, read: true }
          : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    setUnreadCount(0);
  }, []);

  useEffect(() => {
    fetchNotifications();

    // Set up real-time updates for post-showing actions
    const actionsChannel = supabase
      .channel('post-showing-actions-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'post_showing_actions'
        },
        (payload) => {
          console.log('New post-showing action:', payload);
          fetchNotifications(); // Refresh notifications
          
          // Show toast notification
          toast({
            title: "New Buyer Action",
            description: "A buyer has taken action after a showing. Check your notifications.",
          });
        }
      )
      .subscribe();

    // Set up real-time updates for favorites
    const favoritesChannel = supabase
      .channel('favorites-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'property_favorites'
        },
        (payload) => {
          console.log('New favorite:', payload);
          fetchNotifications();
          
          toast({
            title: "Property Favorited",
            description: "A buyer has favorited a property after a showing.",
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(actionsChannel);
      supabase.removeChannel(favoritesChannel);
    };
  }, [fetchNotifications, toast]);

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    refreshNotifications: fetchNotifications
  };
};
