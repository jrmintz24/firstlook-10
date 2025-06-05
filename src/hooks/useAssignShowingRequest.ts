
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { createToastHelper } from "@/utils/toastUtils";

interface Profile {
  first_name: string;
  last_name: string;
  phone: string;
}

export const useAssignShowingRequest = () => {
  const { user, session } = useAuth();
  const toastHelper = createToastHelper();

  const assignToSelf = async (requestId: string, profile: Profile) => {
    const currentUser = user || session?.user;
    if (!currentUser || !profile) return false;

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
        toastHelper.error("Error", "Failed to assign request. Please try again.");
        return false;
      }

      toastHelper.success("Request Assigned", "You have been assigned to this showing request.");
      return true;
    } catch (error) {
      console.error('Error assigning request:', error);
      toastHelper.error("Error", "Failed to assign request. Please try again.");
      return false;
    }
  };

  return { assignToSelf };
};
