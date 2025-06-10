
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { isValidShowingStatus } from "@/utils/showingStatus";

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  user_type: string;
  email?: string;
}

export const useAgentRequest = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const requestAssignment = async (requestId: string, profile: Profile) => {
    if (!profile) {
      console.error('No profile available for assignment request');
      toast({
        title: "Error",
        description: "Profile not loaded. Please refresh the page.",
        variant: "destructive"
      });
      return false;
    }

    setLoading(true);
    const newStatus = "agent_requested";

    if (!isValidShowingStatus(newStatus)) {
      toast({ title: "Error", description: "Invalid status", variant: "destructive" });
      setLoading(false);
      return false;
    }

    console.log('Requesting assignment with profile:', profile);

    try {
      const { error } = await supabase
        .from("showing_requests")
        .update({
          requested_agent_id: profile.id,
          requested_agent_name: `${profile.first_name} ${profile.last_name}`,
          requested_agent_phone: profile.phone,
          requested_agent_email: profile.email || null,
          status: newStatus,
          status_updated_at: new Date().toISOString(),
        })
        .eq("id", requestId);

      if (error) {
        console.error('Error requesting assignment:', error);
        toast({ 
          title: "Error", 
          description: "Failed to request assignment. Please try again.", 
          variant: "destructive" 
        });
        return false;
      }

      toast({ 
        title: "Request Sent", 
        description: "Your assignment request has been sent to admin for approval." 
      });
      return true;
    } catch (error) {
      console.error('Exception requesting assignment:', error);
      toast({ 
        title: "Error", 
        description: "An unexpected error occurred.", 
        variant: "destructive" 
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { requestAssignment, loading };
};
