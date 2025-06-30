
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const usePostShowingActionsTracking = () => {
  const [actionsData, setActionsData] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(false);

  const fetchActionsForShowing = async (showingId: string) => {
    if (actionsData[showingId]) return actionsData[showingId];
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('post_showing_actions')
        .select('*')
        .eq('showing_request_id', showingId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setActionsData(prev => ({
        ...prev,
        [showingId]: data || []
      }));

      return data || [];
    } catch (error) {
      console.error('Error fetching post-showing actions:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getCompletedActions = (showingId: string): string[] => {
    const actions = actionsData[showingId] || [];
    return actions.map(action => action.action_type);
  };

  const hasCompletedAction = (showingId: string, actionType: string): boolean => {
    const actions = actionsData[showingId] || [];
    return actions.some(action => action.action_type === actionType);
  };

  const getActionDetails = (showingId: string, actionType: string) => {
    const actions = actionsData[showingId] || [];
    return actions.find(action => action.action_type === actionType);
  };

  const getLatestAction = (showingId: string) => {
    const actions = actionsData[showingId] || [];
    return actions[0]; // Already sorted by created_at desc
  };

  const trackAction = async (showingId: string, actionType: string, actionDetails?: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { error } = await supabase
        .from('post_showing_actions')
        .insert({
          showing_request_id: showingId,
          buyer_id: user.id,
          action_type: actionType,
          action_details: actionDetails || {}
        });

      if (error) throw error;

      // Refresh the actions for this showing
      await fetchActionsForShowing(showingId);
      return true;
    } catch (error) {
      console.error('Error tracking action:', error);
      return false;
    }
  };

  return {
    fetchActionsForShowing,
    getCompletedActions,
    hasCompletedAction,
    getActionDetails,
    getLatestAction,
    trackAction,
    loading
  };
};
