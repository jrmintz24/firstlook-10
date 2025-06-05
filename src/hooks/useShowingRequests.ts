import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface ShowingRequest {
  id: string;
  property_address: string;
  preferred_date: string | null;
  preferred_time: string | null;
  message: string | null;
  status: string;
  created_at: string;
  assigned_agent_id?: string | null;
  assigned_agent_name?: string | null;
  assigned_agent_phone?: string | null;
  assigned_agent_email?: string | null;
  estimated_confirmation_date?: string | null;
  status_updated_at?: string | null;
  user_id?: string | null;
}

export const useShowingRequests = () => {
  const { user, userType } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Set up real-time subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('showing-requests-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'showing_requests'
        },
        (payload) => {
          console.log('Real-time update received:', payload);
          
          // Invalidate and refetch showing requests
          queryClient.invalidateQueries({ queryKey: ['showing-requests'] });
          
          // Show toast notification for status updates
          if (payload.eventType === 'UPDATE' && payload.new?.status !== payload.old?.status) {
            const newRequest = payload.new as ShowingRequest;
            toast({
              title: "Request Updated",
              description: `Showing for ${newRequest.property_address} status changed to ${newRequest.status}`,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient, toast]);

  return useQuery({
    queryKey: ['showing-requests', user?.id, userType],
    queryFn: async (): Promise<ShowingRequest[]> => {
      if (!user) throw new Error('User not authenticated');

      let query = supabase.from('showing_requests').select('*');
      
      // Filter based on user type
      if (userType === 'buyer') {
        query = query.eq('user_id', user.id);
      }
      // For agents, fetch all requests (they can see unassigned and their own)
      
      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching showing requests:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchOnWindowFocus: true,
  });
};

export const useCreateShowingRequest = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (request: Omit<ShowingRequest, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('showing_requests')
        .insert([request])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['showing-requests'] });
      toast({
        title: "Request Submitted",
        description: "Your showing request has been submitted successfully!",
      });
    },
    onError: (error: any) => {
      console.error('Error creating showing request:', error);
      toast({
        title: "Error",
        description: "Failed to submit showing request. Please try again.",
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
      toast({
        title: "Request Updated",
        description: "The showing request has been updated successfully.",
      });
    },
    onError: (error: any) => {
      console.error('Error updating showing request:', error);
      toast({
        title: "Error",
        description: "Failed to update showing request. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useAssignShowingRequest = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ requestId, agentInfo }: { 
      requestId: string; 
      agentInfo: { id: string; name: string; phone: string; email: string } 
    }) => {
      const { data, error } = await supabase
        .from('showing_requests')
        .update({
          assigned_agent_id: agentInfo.id,
          assigned_agent_name: agentInfo.name,
          assigned_agent_phone: agentInfo.phone,
          assigned_agent_email: agentInfo.email,
          status: 'under_review'
        })
        .eq('id', requestId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['showing-requests'] });
      toast({
        title: "Request Assigned",
        description: "You have been assigned to this showing request.",
      });
    },
    onError: (error: any) => {
      console.error('Error assigning request:', error);
      toast({
        title: "Error",
        description: "Failed to assign request. Please try again.",
        variant: "destructive",
      });
    },
  });
};
