
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type { ShowingRequest, PropertyRequestFormData, AgentInfo } from '@/types';

export const useShowingRequests = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['showing-requests', user?.id],
    queryFn: async (): Promise<ShowingRequest[]> => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('showing_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching showing requests:', error);
        throw error;
      }

      return (data || []).map(item => ({
        ...item,
        property_city: item.property_address ? 'Washington' : undefined,
        property_state: item.property_address ? 'DC' : undefined,
        property_zip: item.property_address ? undefined : undefined,
        status: item.status as ShowingRequest['status']
      }));
    },
    enabled: !!user,
  });
};

export const useAgentShowingRequests = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['agent-showing-requests', user?.id],
    queryFn: async (): Promise<ShowingRequest[]> => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('showing_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching agent showing requests:', error);
        throw error;
      }

      return (data || []).map(item => ({
        ...item,
        property_city: item.property_address ? 'Washington' : undefined,
        property_state: item.property_address ? 'DC' : undefined,
        property_zip: item.property_address ? undefined : undefined,
        status: item.status as ShowingRequest['status']
      }));
    },
    enabled: !!user,
  });
};

export const useCreateShowingRequest = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (requestData: PropertyRequestFormData) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('showing_requests')
        .insert({
          user_id: user.id,
          property_address: requestData.property_address,
          preferred_date: requestData.preferred_date || null,
          preferred_time: requestData.preferred_time || null,
          message: requestData.message || null,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['showing-requests'] });
      toast({
        title: "Request Submitted",
        description: "Your showing request has been submitted successfully.",
      });
    },
    onError: (error: any) => {
      console.error('Error creating showing request:', error);
      toast({
        title: "Error",
        description: "Failed to submit request. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateShowingRequest = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<ShowingRequest> }) => {
      const { data, error } = await supabase
        .from('showing_requests')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['showing-requests'] });
      queryClient.invalidateQueries({ queryKey: ['agent-showing-requests'] });
      toast({
        title: "Request Updated",
        description: "The showing request has been updated successfully.",
      });
    },
    onError: (error: any) => {
      console.error('Error updating showing request:', error);
      toast({
        title: "Error", 
        description: "Failed to update request. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useAssignShowingRequest = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ requestId, agentInfo }: { requestId: string; agentInfo: AgentInfo }) => {
      const { data, error } = await supabase
        .from('showing_requests')
        .update({
          assigned_agent_id: agentInfo.id,
          assigned_agent_name: agentInfo.name,
          assigned_agent_email: agentInfo.email,
          assigned_agent_phone: agentInfo.phone,
          status: 'assigned'
        })
        .eq('id', requestId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['showing-requests'] });
      queryClient.invalidateQueries({ queryKey: ['agent-showing-requests'] });
      toast({
        title: "Request Assigned",
        description: "You have been assigned to this showing request.",
      });
    },
    onError: (error: any) => {
      console.error('Error assigning showing request:', error);
      toast({
        title: "Error",
        description: "Failed to assign request. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useShowingRequestsSubscription = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  React.useEffect(() => {
    if (!user) return;

    const subscription = supabase
      .channel('showing_requests_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'showing_requests',
          filter: `user_id=eq.${user.id}`
        }, 
        (payload) => {
          console.log('Real-time update:', payload);
          
          queryClient.invalidateQueries({ queryKey: ['showing-requests'] });
          queryClient.invalidateQueries({ queryKey: ['agent-showing-requests'] });
          
          if (payload.eventType === 'UPDATE') {
            toast({
              title: "Status Update",
              description: "Your showing request status has been updated.",
            });
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user, queryClient, toast]);
};
