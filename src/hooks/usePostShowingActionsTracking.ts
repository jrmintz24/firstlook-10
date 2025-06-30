
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ActionEvent {
  showingId: string;
  buyerId: string;
  actionType: string;
  timestamp: string;
  success: boolean;
  details?: any;
}

export const usePostShowingActionsTracking = () => {
  const [actionHistory, setActionHistory] = useState<ActionEvent[]>([]);
  const [isTracking, setIsTracking] = useState(false);
  const { toast } = useToast();

  const trackAction = useCallback(async (
    showingId: string,
    buyerId: string,
    actionType: string,
    success: boolean,
    details?: any
  ) => {
    try {
      setIsTracking(true);

      const actionEvent: ActionEvent = {
        showingId,
        buyerId,
        actionType,
        timestamp: new Date().toISOString(),
        success,
        details
      };

      // Add to local state
      setActionHistory(prev => [...prev, actionEvent]);

      // Track in database
      await supabase
        .from('post_showing_actions')
        .insert({
          showing_request_id: showingId,
          buyer_id: buyerId,
          action_type: actionType,
          action_details: {
            success,
            timestamp: actionEvent.timestamp,
            details: details || null
          }
        });

      console.log('Action tracked successfully:', actionEvent);

    } catch (error) {
      console.error('Error tracking action:', error);
      toast({
        title: "Tracking Error",
        description: "Unable to track action. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsTracking(false);
    }
  }, [toast]);

  const getActionHistory = useCallback((showingId: string) => {
    return actionHistory.filter(action => action.showingId === showingId);
  }, [actionHistory]);

  const getCompletedActions = useCallback((showingId: string) => {
    return actionHistory
      .filter(action => action.showingId === showingId && action.success)
      .map(action => action.actionType);
  }, [actionHistory]);

  const hasCompletedAction = useCallback((showingId: string, actionType: string) => {
    return actionHistory.some(
      action => action.showingId === showingId && 
                action.actionType === actionType && 
                action.success
    );
  }, [actionHistory]);

  return {
    actionHistory,
    isTracking,
    trackAction,
    getActionHistory,
    getCompletedActions,
    hasCompletedAction
  };
};
