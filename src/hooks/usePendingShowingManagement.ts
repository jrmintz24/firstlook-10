
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/Auth0AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useShowingEligibility } from "@/hooks/useShowingEligibility";

export const usePendingShowingManagement = () => {
  const [pendingShowingAddress, setPendingShowingAddress] = useState<string>('');
  const { toast } = useToast();
  const { user } = useAuth();
  const { checkEligibility, resetFreeShowingEligibility } = useShowingEligibility();

  const getPendingShowingAddress = async (): Promise<string> => {
    if (!user) return '';
    
    try {
      const { data, error } = await supabase
        .from('showing_requests')
        .select('property_address')
        .eq('user_id', user.id)
        .not('status', 'in', '(completed,cancelled)')
        .limit(1)
        .single();

      if (error || !data) return '';
      return data.property_address;
    } catch (error) {
      return '';
    }
  };

  const handleCancelPendingShowing = async () => {
    if (!user) return;

    try {
      // Get the active showing
      const { data: activeShowing, error: fetchError } = await supabase
        .from('showing_requests')
        .select('id')
        .eq('user_id', user.id)
        .not('status', 'in', '(completed,cancelled)')
        .limit(1)
        .single();

      if (fetchError || !activeShowing) {
        toast({
          title: "Error",
          description: "Could not find active showing to cancel.",
          variant: "destructive"
        });
        return;
      }

      // Cancel the showing
      const { error: cancelError } = await supabase
        .from('showing_requests')
        .update({ status: 'cancelled' })
        .eq('id', activeShowing.id);

      if (cancelError) {
        toast({
          title: "Error",
          description: "Failed to cancel showing. Please try again.",
          variant: "destructive"
        });
        return;
      }

      // Reset free showing eligibility
      await resetFreeShowingEligibility();
      
      toast({
        title: "Showing Cancelled",
        description: "Your previous showing has been cancelled. You can now book a different property.",
      });

      // Refresh eligibility
      await checkEligibility();
    } catch (error) {
      console.error('Error cancelling showing:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    }
  };

  return {
    pendingShowingAddress,
    setPendingShowingAddress,
    getPendingShowingAddress,
    handleCancelPendingShowing
  };
};
