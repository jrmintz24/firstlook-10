import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PostShowingAction {
  id: string;
  action_type: string;
  created_at: string;
  action_details?: any;
}

interface ShowingWithAgent {
  id: string;
  assigned_agent_name?: string;
  assigned_agent_email?: string;
  assigned_agent_phone?: string;
  assigned_agent_id?: string;
  property_address: string;
  status: string;
}

export const usePostShowingActionsManager = (buyerId?: string) => {
  const [completedActions, setCompletedActions] = useState<Record<string, PostShowingAction[]>>({});
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchActionsForShowing = useCallback(async (showingId: string): Promise<PostShowingAction[]> => {
    if (!buyerId) return [];
    
    // Return cached data if available
    if (completedActions[showingId]) {
      return completedActions[showingId];
    }

    try {
      const { data, error } = await supabase
        .from('post_showing_actions')
        .select('*')
        .eq('showing_request_id', showingId)
        .eq('buyer_id', buyerId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const actions = data || [];
      setCompletedActions(prev => ({
        ...prev,
        [showingId]: actions
      }));

      return actions;
    } catch (error) {
      console.error('Error fetching post-showing actions:', error);
      return [];
    }
  }, [buyerId, completedActions]);

  const hasCompletedAction = useCallback((showingId: string, actionType: string): boolean => {
    const actions = completedActions[showingId] || [];
    return actions.some(action => action.action_type === actionType);
  }, [completedActions]);

  const getCompletedActionTypes = useCallback((showingId: string): string[] => {
    const actions = completedActions[showingId] || [];
    return actions.map(action => action.action_type);
  }, [completedActions]);

  const recordAction = useCallback(async (showingId: string, actionType: string, actionDetails?: any): Promise<boolean> => {
    if (!buyerId) return false;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('post_showing_actions')
        .insert({
          showing_request_id: showingId,
          buyer_id: buyerId,
          action_type: actionType,
          action_details: actionDetails || {}
        });

      if (error) throw error;

      // Refresh actions for this showing
      await fetchActionsForShowing(showingId);
      
      toast({
        title: "Action Recorded",
        description: "Your choice has been saved.",
      });

      return true;
    } catch (error) {
      console.error('Error recording action:', error);
      toast({
        title: "Error",
        description: "Failed to record action. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [buyerId, fetchActionsForShowing, toast]);

  // Silent method to record contact attempts without user notifications
  const recordContactAttemptSilently = useCallback(async (
    showingId: string, 
    contactMethod: 'sms' | 'call' | 'email', 
    specialistDetails: any
  ): Promise<boolean> => {
    if (!buyerId) return false;

    const actionType = `attempted_contact_${contactMethod}`;
    
    try {
      const { error } = await supabase
        .from('post_showing_actions')
        .insert({
          showing_request_id: showingId,
          buyer_id: buyerId,
          action_type: actionType,
          action_details: specialistDetails || {}
        });

      if (error) throw error;

      // Refresh actions for this showing silently
      await fetchActionsForShowing(showingId);
      
      console.log(`Contact attempt logged: ${contactMethod}`, specialistDetails);
      return true;
    } catch (error) {
      console.error('Error recording contact attempt:', error);
      // Don't show error to user - fail silently for better UX
      return false;
    }
  }, [buyerId, fetchActionsForShowing]);

  // Keep the old method for backwards compatibility, but now it uses the silent version
  const recordContactAttempt = useCallback(async (
    showingId: string, 
    contactMethod: 'sms' | 'call' | 'email', 
    specialistDetails: any
  ): Promise<boolean> => {
    return await recordContactAttemptSilently(showingId, contactMethod, specialistDetails);
  }, [recordContactAttemptSilently]);

  const getAgentFromShowing = useCallback((showing: ShowingWithAgent) => {
    return {
      id: showing.assigned_agent_id || showing.assigned_agent_email,
      name: showing.assigned_agent_name,
      email: showing.assigned_agent_email,
      phone: showing.assigned_agent_phone,
      available: !!(showing.assigned_agent_name && showing.assigned_agent_email)
    };
  }, []);

  return {
    completedActions,
    loading,
    fetchActionsForShowing,
    hasCompletedAction,
    getCompletedActionTypes,
    recordAction,
    recordContactAttempt,
    recordContactAttemptSilently,
    getAgentFromShowing
  };
};
