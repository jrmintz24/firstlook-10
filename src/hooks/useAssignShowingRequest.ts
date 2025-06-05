
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToastHelper } from "@/utils/toastUtils";

interface Profile {
  first_name: string;
  last_name: string;
  phone: string;
}

export const useAssignShowingRequest = () => {
  const { user, session } = useAuth();
  const toastHelper = useToastHelper();

  const assignToSelf = async (requestId: string, profile: Profile) => {
    const currentUser = user || session?.user;
    if (!currentUser || !profile) {
      console.error('No user or profile available for assignment');
      toastHelper.error("Error", "Authentication required to assign request.");
      return false;
    }

    console.log('Attempting to assign request:', { requestId, profile, userEmail: currentUser.email });

    try {
      const { error } = await supabase
        .from('showing_requests')
        .update(
          {
            assigned_agent_id: currentUser.id,
            assigned_agent_name: `${profile.first_name} ${profile.last_name}`,
            assigned_agent_phone: profile.phone,
            assigned_agent_email: currentUser.email,
            status: 'agent_assigned',
            status_updated_at: new Date().toISOString()
          },
          { returning: 'minimal' }
        )
        .eq('id', requestId);

      console.log('Assignment update result:', { error });

      if (error) {
        console.error('Error assigning request:', error);
        toastHelper.error("Assignment Failed", `Database error: ${error.message}`);
        return false;
      }

      console.log('Successfully assigned request');
      toastHelper.success("Request Assigned", "You have been assigned to this showing request and will contact the client within 2 hours.");
      return true;
    } catch (error) {
      console.error('Exception during assignment:', error);
      toastHelper.error("Assignment Failed", "An unexpected error occurred. Please try again.");
      return false;
    }
  };

  return { assignToSelf };
};
