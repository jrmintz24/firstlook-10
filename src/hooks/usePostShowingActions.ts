import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface PostShowingAction {
  id: string;
  showing_request_id: string;
  buyer_id: string;
  action_type: 'favorited' | 'made_offer' | 'hired_agent' | 'scheduled_more_tours';
  action_details: any;
  created_at: string;
}

interface ActionStates {
  [showingId: string]: {
    favorited: boolean;
    made_offer: boolean;
    hired_agent: boolean;
    scheduled_more_tours: boolean;
    actions: PostShowingAction[];
  };
}

export const usePostShowingActions = () => {
  const [actionStates, setActionStates] = useState<ActionStates>({});
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  console.log('🔍 [DEBUG] usePostShowingActions render count:', ++window.postShowingActionsRenderCount || (window.postShowingActionsRenderCount = 1));
  console.log('🔍 [DEBUG] usePostShowingActions user:', user?.id);
  console.log('🔍 [DEBUG] usePostShowingActions actionStates keys:', Object.keys(actionStates));

  // Fetch all action states for the current user
  const fetchActionStates = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      const { data: actions, error } = await supabase
        .from('post_showing_actions')
        .select('*')
        .eq('buyer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching post-showing actions:', error);
        return;
      }

      // Group actions by showing_request_id
      const groupedActions: ActionStates = {};
      
      actions?.forEach((action) => {
        const showingId = action.showing_request_id;
        
        if (!groupedActions[showingId]) {
          groupedActions[showingId] = {
            favorited: false,
            made_offer: false,
            hired_agent: false,
            scheduled_more_tours: false,
            actions: []
          };
        }

        // Mark the action type as true
        if (action.action_type in groupedActions[showingId]) {
          groupedActions[showingId][action.action_type as keyof typeof groupedActions[showingId]] = true;
        }

        // Add to actions array
        groupedActions[showingId].actions.push(action);
      });

      setActionStates(groupedActions);
    } catch (error) {
      console.error('Exception fetching post-showing actions:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Record a new action
  const recordAction = useCallback(async (
    showingId: string,
    actionType: PostShowingAction['action_type'],
    actionDetails: any = {}
  ) => {
    if (!user?.id) {
      console.error('No user found for recording action');
      return false;
    }

    try {
      // First check if this action already exists
      const { data: existingAction } = await supabase
        .from('post_showing_actions')
        .select('id')
        .eq('buyer_id', user.id)
        .eq('showing_request_id', showingId)
        .eq('action_type', actionType)
        .maybeSingle();

      if (existingAction) {
        console.log(`Action ${actionType} already exists for showing ${showingId}`);
        return true; // Already recorded, that's fine
      }

      // Insert new action
      const { error } = await supabase
        .from('post_showing_actions')
        .insert({
          showing_request_id: showingId,
          buyer_id: user.id,
          action_type: actionType,
          action_details: actionDetails
        });

      if (error) {
        console.error('Error recording post-showing action:', error);
        return false;
      }

      // Update local state immediately
      setActionStates(prev => ({
        ...prev,
        [showingId]: {
          ...prev[showingId],
          [actionType]: true,
          actions: [
            ...(prev[showingId]?.actions || []),
            {
              id: 'temp-' + Date.now(),
              showing_request_id: showingId,
              buyer_id: user.id,
              action_type: actionType,
              action_details: actionDetails,
              created_at: new Date().toISOString()
            }
          ]
        }
      }));

      console.log(`Successfully recorded action ${actionType} for showing ${showingId}`);
      return true;
    } catch (error) {
      console.error('Exception recording post-showing action:', error);
      return false;
    }
  }, [user?.id]);

  // Remove an action (for undo functionality)
  const removeAction = useCallback(async (
    showingId: string,
    actionType: PostShowingAction['action_type']
  ) => {
    if (!user?.id) {
      console.error('No user found for removing action');
      return false;
    }

    try {
      const { error } = await supabase
        .from('post_showing_actions')
        .delete()
        .eq('buyer_id', user.id)
        .eq('showing_request_id', showingId)
        .eq('action_type', actionType);

      if (error) {
        console.error('Error removing post-showing action:', error);
        return false;
      }

      // Update local state immediately
      setActionStates(prev => {
        const updated = { ...prev };
        if (updated[showingId]) {
          updated[showingId] = {
            ...updated[showingId],
            [actionType]: false,
            actions: updated[showingId].actions.filter(
              action => action.action_type !== actionType
            )
          };
        }
        return updated;
      });

      console.log(`Successfully removed action ${actionType} for showing ${showingId}`);
      return true;
    } catch (error) {
      console.error('Exception removing post-showing action:', error);
      return false;
    }
  }, [user?.id]);

  // Get action states for a specific showing (stable reference)
  const getActionsForShowing = useCallback((showingId: string) => {
    const currentActionStates = actionStates;
    return currentActionStates[showingId] || {
      favorited: false,
      made_offer: false,
      hired_agent: false,
      scheduled_more_tours: false,
      actions: []
    };
  }, []); // Empty dependency array to create stable reference

  // Check if a specific action was taken
  const hasAction = useCallback((showingId: string, actionType: PostShowingAction['action_type']) => {
    return actionStates[showingId]?.[actionType] || false;
  }, [actionStates]);

  // Get count of actions taken for a showing (stable reference)
  const getActionCount = useCallback((showingId: string) => {
    const currentActionStates = actionStates;
    const actions = currentActionStates[showingId];
    if (!actions) return 0;
    
    return [
      actions.favorited,
      actions.made_offer,
      actions.hired_agent,
      actions.scheduled_more_tours
    ].filter(Boolean).length;
  }, []); // Empty dependency array to create stable reference

  // Initialize on mount
  useEffect(() => {
    fetchActionStates();
  }, [fetchActionStates]);

  return {
    actionStates,
    loading,
    recordAction,
    removeAction,
    getActionsForShowing,
    hasAction,
    getActionCount,
    refetch: fetchActionStates
  };
};