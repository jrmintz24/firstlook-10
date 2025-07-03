
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useReliableSubscription } from './useReliableSubscription';
import { useSubscriptionReadiness } from './useSubscriptionReadiness';

export const useSimpleBuyerData = () => {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [activeShowings, setActiveShowings] = useState([]);
  const [completedShowings, setCompletedShowings] = useState([]);

  const fetchProfile = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  }, [user?.id]);

  const fetchShowingRequests = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('showing_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      const pending = data?.filter(req => ['pending', 'agent_assigned', 'agent_confirmed', 'awaiting_agreement'].includes(req.status)) || [];
      const active = data?.filter(req => req.status === 'confirmed') || [];
      const completed = data?.filter(req => req.status === 'completed') || [];
      
      setPendingRequests(pending);
      setActiveShowings(active);
      setCompletedShowings(completed);
    } catch (error) {
      console.error('Error fetching showing requests:', error);
      toast({
        title: "Error",
        description: "Failed to load your tours. Please refresh the page.",
        variant: "destructive"
      });
    }
  }, [user?.id, toast]);

  const refreshData = useCallback(async () => {
    setLoading(true);
    await Promise.all([
      fetchProfile(),
      fetchShowingRequests()
    ]);
    setLoading(false);
  }, [fetchProfile, fetchShowingRequests]);

  // Set up subscriptions
  const showingRequestsSubscription = useReliableSubscription({
    channelName: `buyer_showing_requests_${user?.id}`,
    table: 'showing_requests',
    filter: user?.id ? `user_id=eq.${user.id}` : undefined,
    onDataChange: fetchShowingRequests,
    enabled: !!user?.id
  });

  // Track subscription readiness
  const subscriptionReadiness = useSubscriptionReadiness({
    subscriptions: {
      showingRequests: {
        isReady: showingRequestsSubscription.isReady,
        connectionHealth: showingRequestsSubscription.connectionHealth
      }
    },
    requiredForSubmission: ['showingRequests'] // This subscription is required for form submissions
  });

  // Initial data load
  useEffect(() => {
    if (user?.id) {
      refreshData();
    } else {
      setLoading(false);
    }
  }, [user?.id, refreshData]);

  return {
    profile,
    loading: loading || authLoading,
    authLoading,
    currentUser: user,
    pendingRequests,
    activeShowings,
    completedShowings,
    refreshData,
    fetchShowingRequests,
    subscriptionReadiness // Expose subscription readiness for form components
  };
};
