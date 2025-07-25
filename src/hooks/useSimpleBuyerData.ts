
import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "@/contexts/Auth0AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  user_type: string;
  free_showing_used?: boolean;
}

interface ShowingRequest {
  id: string;
  property_address: string;
  preferred_date: string | null;
  preferred_time: string | null;
  message: string | null;
  status: string;
  created_at: string;
  assigned_agent_name?: string | null;
  assigned_agent_phone?: string | null;
  assigned_agent_email?: string | null;
  assigned_agent_id?: string | null;
  estimated_confirmation_date?: string | null;
  status_updated_at?: string | null;
}

export const useSimpleBuyerData = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [showingRequests, setShowingRequests] = useState<ShowingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();
  const { user, session, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const currentUser = user || session?.user;

  // Enhanced categorization with new workflow statuses
  const categorizedRequests = useMemo(() => {
    const pendingRequests = showingRequests.filter(req => 
      ['pending', 'submitted', 'under_review', 'agent_assigned', 'awaiting_agreement', 'agent_requested'].includes(req.status)
    );
    
    const activeShowings = showingRequests.filter(req => 
      ['confirmed', 'agent_confirmed', 'scheduled'].includes(req.status)
    );
    
    const completedShowings = showingRequests
      .filter(req => ['completed', 'cancelled'].includes(req.status))
      .sort((a, b) => {
        if (a.status !== b.status) {
          if (a.status === 'completed' && b.status === 'cancelled') return -1;
          if (a.status === 'cancelled' && b.status === 'completed') return 1;
        }
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });

    return { pendingRequests, activeShowings, completedShowings };
  }, [showingRequests]);

  // Fetch showing requests
  const fetchShowingRequests = useCallback(async () => {
    if (!currentUser) return;

    try {
      console.log('Fetching showing requests for user:', currentUser.id);
      const { data: requestsData, error: requestsError } = await supabase
        .from('showing_requests')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false });

      if (requestsError) {
        console.error('Requests error:', requestsError);
        toast({
          title: "Error",
          description: "Failed to load showing requests.",
          variant: "destructive"
        });
        setShowingRequests([]);
      } else {
        console.log('Loaded showing requests:', {
          total: requestsData?.length || 0,
          statuses: requestsData?.reduce((acc, req) => {
            acc[req.status] = (acc[req.status] || 0) + 1;
            return acc;
          }, {} as Record<string, number>) || {}
        });
        setShowingRequests(requestsData || []);
      }
    } catch (error) {
      console.error('Error fetching showing requests:', error);
      setShowingRequests([]);
    }
  }, [currentUser, toast]);

  // Fetch all data
  const fetchAllData = useCallback(async (isRefresh = false) => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    if (isRefresh) {
      setIsRefreshing(true);
    }

    console.log('Fetching simplified buyer dashboard data for user:', currentUser.id);

    try {
      // Fetch profile and showing requests in parallel
      const [profileResult, requestsResult] = await Promise.allSettled([
        supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUser.id)
          .maybeSingle(),
        
        supabase
          .from('showing_requests')
          .select('*')
          .eq('user_id', currentUser.id)
          .order('created_at', { ascending: false })
      ]);

      // Handle profile result
      if (profileResult.status === 'fulfilled') {
        const { data: profileData, error: profileError } = profileResult.value;
        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Profile error:', profileError);
        } else {
          setProfile(profileData);
        }
      }

      // Handle showing requests result
      if (requestsResult.status === 'fulfilled') {
        const { data: requestsData, error: requestsError } = requestsResult.value;
        if (requestsError) {
          console.error('Requests error:', requestsError);
          toast({
            title: "Error",
            description: "Failed to load showing requests.",
            variant: "destructive"
          });
          setShowingRequests([]);
        } else {
          console.log('Loaded showing requests:', {
            total: requestsData?.length || 0,
            statuses: requestsData?.reduce((acc, req) => {
              acc[req.status] = (acc[req.status] || 0) + 1;
              return acc;
            }, {} as Record<string, number>) || {}
          });
          setShowingRequests(requestsData || []);
        }
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [currentUser, toast]);

  const refreshData = useCallback(async () => {
    console.log('Refreshing simplified buyer dashboard data...');
    await fetchAllData(true);
  }, [fetchAllData]);

  // Simple real-time subscription without circuit breaker
  useEffect(() => {
    if (!currentUser) return;

    console.log('Setting up real-time subscription for showing requests');
    
    const channel = supabase
      .channel(`showing_requests_${currentUser.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'showing_requests',
          filter: `user_id=eq.${currentUser.id}`
        },
        (payload) => {
          console.log('Showing request change detected:', payload);
          fetchShowingRequests();
        }
      )
      .subscribe((status) => {
        console.log('Showing requests subscription status:', status);
      });

    return () => {
      console.log('Cleaning up showing requests subscription');
      supabase.removeChannel(channel);
    };
  }, [currentUser, fetchShowingRequests]);

  useEffect(() => {
    if (authLoading) return;
    
    if (!user && !session) {
      setLoading(false);
      navigate('/');
      return;
    }

    fetchAllData();
  }, [user, session, authLoading, navigate, fetchAllData]);

  return {
    profile,
    loading,
    isRefreshing,
    authLoading,
    currentUser,
    refreshData,
    fetchShowingRequests,
    ...categorizedRequests
  };
};
