
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
  const { success, error } = useToastHelper();

  const assignToSelf = async (requestId: string, profile: Profile) => {
    const currentUser = user || session?.user;
    if (!currentUser || !profile) {
      console.error('No user or profile available for assignment');
      error("Error", "Authentication required to assign request.");
      return false;
    }

    console.log('Attempting to assign request:', { requestId, profile, userEmail: currentUser.email });

    try {
      // Get the user's profile to ensure we have the email
      const { data: userProfile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();

      if (profileError) {
        console.error('Error fetching user profile:', profileError);
        error("Assignment Failed", "Could not fetch user profile.");
        return false;
      }

      const agentEmail = currentUser.email;
      
      // Go directly to pending_admin_approval status instead of under_review
      const updateData = {
        assigned_agent_id: currentUser.id,
        assigned_agent_name: `${profile.first_name} ${profile.last_name}`,
        assigned_agent_phone: profile.phone,
        assigned_agent_email: agentEmail,
        status: 'pending_admin_approval', // Changed from 'under_review' to skip redundant step
        status_updated_at: new Date().toISOString()
      };

      console.log('Assignment update data:', updateData);

      const { error: updateError } = await supabase
        .from('showing_requests')
        .update(updateData)
        .eq('id', requestId);

      console.log('Assignment update result:', { error: updateError, agentEmail });

      if (updateError) {
        console.error('Error assigning request:', updateError.message, updateError.details, updateError.hint);
        if (updateError.message?.includes('showing_requests_status_check')) {
          error('Assignment Failed', 'Database schema outdated. Run `supabase db execute < supabase/sql/20250615_update_status_check.sql` to allow new statuses.');
        } else {
          error('Assignment Failed', `Database error: ${updateError.message}${updateError.details ? ` - ${updateError.details}` : ''}`);
        }
        return false;
      }

      console.log('Successfully assigned request to:', agentEmail);
      success("Request Assigned", "You have been assigned to this showing request. It's now pending admin approval.");
      return true;
    } catch (err) {
      console.error('Exception during assignment:', err);
      error("Assignment Failed", "An unexpected error occurred. Please try again.");
      return false;
    }
  };

  return { assignToSelf };
};
