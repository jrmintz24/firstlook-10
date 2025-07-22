import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AgentStats {
  completedShowings: number;
  averageRating: number;
  totalReviews: number;
  averageResponseTime?: number; // in hours
}

export const useAgentStats = (agentId?: string) => {
  const [stats, setStats] = useState<AgentStats>({
    completedShowings: 0,
    averageRating: 0,
    totalReviews: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAgentStats = async (id: string) => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      // Get completed showings count
      const { count: showingCount, error: showingError } = await supabase
        .from('showing_requests')
        .select('*', { count: 'exact', head: true })
        .eq('assigned_agent_id', id)
        .eq('status', 'completed');

      if (showingError) {
        console.error('Error fetching showing count:', showingError);
      }

      // Get agent ratings and feedback
      const { data: feedbackData, error: feedbackError } = await supabase
        .from('buyer_feedback')
        .select('agent_rating')
        .eq('agent_id', id)
        .not('agent_rating', 'is', null);

      if (feedbackError) {
        console.error('Error fetching feedback:', feedbackError);
      }

      // Calculate rating statistics
      let averageRating = 0;
      let totalReviews = 0;

      if (feedbackData && feedbackData.length > 0) {
        totalReviews = feedbackData.length;
        const totalRating = feedbackData.reduce((sum, feedback) => sum + (feedback.agent_rating || 0), 0);
        averageRating = totalRating / totalReviews;
      }

      // Set default values if no data
      const finalStats: AgentStats = {
        completedShowings: showingCount || 0,
        averageRating: averageRating || 4.8, // Default to 4.8 if no ratings yet
        totalReviews: totalReviews || 0
      };

      setStats(finalStats);
    } catch (err) {
      console.error('Exception fetching agent stats:', err);
      setError('Failed to load agent statistics');
      
      // Fallback to default values
      setStats({
        completedShowings: 0,
        averageRating: 4.8,
        totalReviews: 0
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (agentId) {
      fetchAgentStats(agentId);
    } else {
      // Default values when no agent ID provided
      setStats({
        completedShowings: 0,
        averageRating: 4.8,
        totalReviews: 0
      });
    }
  }, [agentId]);

  return {
    stats,
    loading,
    error,
    refetch: () => agentId && fetchAgentStats(agentId)
  };
};