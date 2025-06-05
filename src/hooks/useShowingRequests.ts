
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useAssignShowingRequest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const assignRequest = async (requestId: string, agentId: string, agentName: string, agentPhone: string, agentEmail: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('showing_requests')
        .update({
          assigned_agent_id: agentId,
          assigned_agent_name: agentName,
          assigned_agent_phone: agentPhone,
          assigned_agent_email: agentEmail,
          status: 'agent_assigned'
        })
        .eq('id', requestId);

      if (error) {
        console.error('Error assigning request:', error);
        toast({
          title: "Error",
          description: "Failed to assign request. Please try again.",
          variant: "destructive"
        });
        return false;
      }

      toast({
        title: "Request Assigned",
        description: "You have been assigned to this showing request.",
      });
      return true;
    } catch (error) {
      console.error('Error assigning request:', error);
      toast({
        title: "Error",
        description: "Failed to assign request. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    assignRequest,
    isLoading
  };
};
