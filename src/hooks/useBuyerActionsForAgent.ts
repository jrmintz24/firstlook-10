
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface BuyerAction {
  showingId: string;
  actions: {
    favorited?: boolean;
    madeOffer?: boolean;
    hiredAgent?: boolean;
    scheduledMoreTours?: boolean;
    askedQuestions?: number;
    propertyRating?: number;
    agentRating?: number;
    latestAction?: string;
    actionTimestamp?: string;
  };
}

export const useBuyerActionsForAgent = (agentId: string) => {
  const [buyerActions, setBuyerActions] = useState<Record<string, BuyerAction['actions']>>({});
  const [loading, setLoading] = useState(false);

  const fetchBuyerActions = async () => {
    if (!agentId) return;
    
    setLoading(true);
    try {
      // Get all completed showings for this agent
      const { data: completedShowings, error: showingsError } = await supabase
        .from('showing_requests')
        .select('id, user_id')
        .eq('assigned_agent_id', agentId)
        .eq('status', 'completed');

      if (showingsError) throw showingsError;

      if (!completedShowings?.length) {
        setLoading(false);
        return;
      }

      const showingIds = completedShowings.map(s => s.id);
      const buyerIds = completedShowings.map(s => s.user_id).filter(Boolean);

      // Fetch all buyer actions in parallel
      const [
        postShowingActions,
        propertyFavorites,
        buyerFeedback,
        agentReferrals,
        followUpQuestions
      ] = await Promise.all([
        // Post-showing actions
        supabase
          .from('post_showing_actions')
          .select('showing_request_id, action_type, created_at')
          .in('showing_request_id', showingIds),
        
        // Property favorites
        supabase
          .from('property_favorites')
          .select('showing_request_id, created_at')
          .in('showing_request_id', showingIds),
        
        // Buyer feedback
        supabase
          .from('buyer_feedback')
          .select('showing_request_id, property_rating, agent_rating, created_at')
          .in('showing_request_id', showingIds),
        
        // Agent referrals (hired agent)
        supabase
          .from('agent_referrals')
          .select('showing_request_id, referral_type, referral_date')
          .eq('agent_id', agentId)
          .in('buyer_id', buyerIds),
        
        // Follow-up questions
        supabase
          .from('follow_up_questions')
          .select('showing_request_id, created_at')
          .in('showing_request_id', showingIds)
      ]);

      // Process and combine all data
      const actionsMap: Record<string, BuyerAction['actions']> = {};

      completedShowings.forEach(showing => {
        const showingId = showing.id;
        const actions: BuyerAction['actions'] = {};

        // Check post-showing actions
        const showingActions = postShowingActions.data?.filter(a => a.showing_request_id === showingId) || [];
        actions.madeOffer = showingActions.some(a => a.action_type === 'request_offer_assistance');
        actions.scheduledMoreTours = showingActions.some(a => a.action_type.includes('schedule'));

        // Check if favorited
        actions.favorited = propertyFavorites.data?.some(f => f.showing_request_id === showingId) || false;

        // Check feedback ratings
        const feedback = buyerFeedback.data?.find(f => f.showing_request_id === showingId);
        if (feedback) {
          actions.propertyRating = feedback.property_rating;
          actions.agentRating = feedback.agent_rating;
        }

        // Check if hired agent
        actions.hiredAgent = agentReferrals.data?.some(r => 
          r.showing_request_id === showingId && r.referral_type === 'hire_agent'
        ) || false;

        // Count questions
        actions.askedQuestions = followUpQuestions.data?.filter(q => q.showing_request_id === showingId).length || 0;

        // Get latest action
        const allActions = [
          ...(showingActions.map(a => ({ type: a.action_type, date: a.created_at }))),
          ...(propertyFavorites.data?.filter(f => f.showing_request_id === showingId).map(f => ({ type: 'favorited', date: f.created_at })) || []),
          ...(followUpQuestions.data?.filter(q => q.showing_request_id === showingId).map(q => ({ type: 'asked_question', date: q.created_at })) || [])
        ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        if (allActions.length > 0) {
          actions.latestAction = allActions[0].type;
          actions.actionTimestamp = allActions[0].date;
        }

        actionsMap[showingId] = actions;
      });

      setBuyerActions(actionsMap);
    } catch (error) {
      console.error('Error fetching buyer actions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuyerActions();
  }, [agentId]);

  return {
    buyerActions,
    loading,
    refetch: fetchBuyerActions
  };
};
