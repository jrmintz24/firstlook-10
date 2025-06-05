
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useAssignShowingRequest = () => {
  const { user, session } = useAuth();
  const { toast } = useToast();

  const assignToSelf = async (requestId: string, profile: any) => {
    const currentUser = user || session?.user;
    if (!currentUser || !profile) return;

    try {
      const { error } = await supabase
        .from('showing_requests')
        .update({
          assigned_agent_name: `${profile.first_name} ${profile.last_name}`,
          assigned_agent_phone: profile.phone,
          assigned_agent_email: currentUser.email,
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
      } else {
        toast({
          title: "Request Assigned",
          description: "You have been assigned to this showing request.",
        });
        return true;
      }
    } catch (error) {
      console.error('Error assigning request:', error);
      return false;
    }
  };

  return { assignToSelf };
};

// Default export as well for flexibility
export default useAssignShowingRequest;
