
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Profile {
  first_name: string;
  last_name: string;
  phone: string;
}

export const useAssignShowingRequest = () => {
  const { user, session } = useAuth();
  const { toast } = useToast();

  const assignToSelf = async (requestId: string, profile: Profile) => {
    const currentUser = user || session?.user;
    if (!currentUser || !profile) {
      console.error('No user or profile available for assignment');
      toast({
        title: "Error",
        description: "Authentication required to assign request.",
        variant: "destructive"
      });
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
        toast({
          title: "Assignment Failed",
          description: "Could not fetch user profile.",
          variant: "destructive"
        });
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

      const { error } = await supabase
        .from('showing_requests')
        .update(updateData)
        .eq('id', requestId);

      console.log('Assignment update result:', { error, agentEmail });

      if (error) {
        console.error('Error assigning request:', error.message, error.details, error.hint);
        if (error.message?.includes('showing_requests_status_check')) {
          toast({
            title: 'Assignment Failed',
            description: 'Database schema outdated. Run `supabase db execute < supabase/sql/20250615_update_status_check.sql` to allow new statuses.',
            variant: "destructive"
          });
        } else {
          toast({
            title: 'Assignment Failed',
            description: `Database error: ${error.message}${error.details ? ` - ${error.details}` : ''}`,
            variant: "destructive"
          });
        }
        return false;
      }

      console.log('Successfully assigned request to:', agentEmail);
      toast({
        title: "Request Assigned",
        description: "You have been assigned to this showing request. It's now pending admin approval."
      });
      return true;
    } catch (error) {
      console.error('Exception during assignment:', error);
      toast({
        title: "Assignment Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  return { assignToSelf };
};
