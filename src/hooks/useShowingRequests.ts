import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import type { ShowingRequest, AgentInfo } from '@/types';

export interface ShowingRequestUpdates {
  status?: string;
  assigned_agent_id?: string;
  assigned_agent_name?: string;
  assigned_agent_phone?: string;
  assigned_agent_email?: string;
  estimated_confirmation_date?: string;
  internal_notes?: string;
}

export const useShowingRequests = () => {
  const { user, session } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['showing-requests'],
    queryFn: async (): Promise<ShowingRequest[]> => {
      const { data, error } = await supabase
        .from('showing_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  // Real-time subscription with enhanced error handling
  useEffect(() => {
    if (!user && !session) return;

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
          
          // Invalidate and refetch
          queryClient.invalidateQueries({ queryKey: ['showing-requests'] });
          
          // Show appropriate toast notifications
          if (payload.eventType === 'INSERT') {
            toast({
              title: "New Showing Request",
              description: "A new showing request has been submitted.",
            });
          } else if (payload.eventType === 'UPDATE') {
            const oldRecord = payload.old as ShowingRequest;
            const newRecord = payload.new as ShowingRequest;
            
            if (oldRecord.status !== newRecord.status) {
              toast({
                title: "Status Updated",
                description: `Showing request status changed to ${newRecord.status}`,
              });
            }
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to showing requests updates');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('Error subscribing to showing requests updates');
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, session, queryClient, toast]);

  return query;
};

export const useAssignShowingRequest = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ requestId, agentInfo }: { requestId: string, agentInfo: AgentInfo }) => {
      const { data, error } = await supabase
        .from('showing_requests')
        .update({
          assigned_agent_id: agentInfo.id,
          assigned_agent_name: agentInfo.name,
          assigned_agent_phone: agentInfo.phone,
          assigned_agent_email: agentInfo.email,
          status: 'agent_assigned'
        })
        .eq('id', requestId)
        .select()
        .single();

      if (error) {
        console.error('Error assigning showing request:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['showing-requests'] });
      toast({
        title: "Request Assigned",
        description: "You have successfully assigned this request to yourself.",
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

export const useUpdateShowingRequest = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string, updates: ShowingRequestUpdates }) => {
      const { data, error } = await supabase
        .from('showing_requests')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating showing request:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['showing-requests'] });
      toast({
        title: "Request Updated",
        description: "The request has been updated successfully.",
      });
    },
    onError: (error: any) => {
      console.error('Error updating request:', error);
      toast({
        title: "Error",
        description: "Failed to update request. Please try again.",
        variant: "destructive",
      });
    },
  });
};
