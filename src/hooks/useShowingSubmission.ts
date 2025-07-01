
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useShowingEligibility } from "@/hooks/useShowingEligibility";
import { PropertyRequestFormData } from "@/types/propertyRequest";
import { getPropertiesToSubmit, getPreferredOptions, getEstimatedConfirmationDate } from "@/utils/propertyRequestUtils";

export const useShowingSubmission = (formData: PropertyRequestFormData, onSuccess?: () => void) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { checkEligibility, markFreeShowingUsed } = useShowingEligibility();

  const submitShowingRequests = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to submit your showing request",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('Submitting showing requests for user:', user.id);
      
      const propertiesToSubmit = getPropertiesToSubmit(formData);
      console.log('Properties to submit:', propertiesToSubmit);

      // Check eligibility before submission - especially for multiple properties
      if (propertiesToSubmit.length > 1) {
        const currentEligibility = await checkEligibility();
        
        if (!currentEligibility?.eligible || currentEligibility.reason !== 'subscribed') {
          toast({
            title: "Subscription Required",
            description: "Multiple properties in one tour session require a subscription. Please subscribe to continue!",
            variant: "destructive"
          });
          navigate('/subscriptions');
          return;
        }
      }

      const preferredOptions = getPreferredOptions(formData);
      const preferredDate = preferredOptions[0]?.date || '';
      const preferredTime = preferredOptions[0]?.time || '';
      const estimatedConfirmationDate = getEstimatedConfirmationDate();

      // Create showing requests for each property
      const requests = propertiesToSubmit.map(property => ({
        user_id: user.id,
        property_address: property,
        preferred_date: preferredDate || null,
        preferred_time: preferredTime || null,
        message: formData.notes || null,
        internal_notes: preferredOptions.length > 1 ? JSON.stringify({ preferredOptions }) : null,
        status: 'pending',
        estimated_confirmation_date: estimatedConfirmationDate
      }));

      console.log('Inserting showing requests:', requests);

      const { data, error } = await supabase
        .from('showing_requests')
        .insert(requests)
        .select();

      if (error) {
        console.error('Error creating showing requests:', error);
        toast({
          title: "Error",
          description: `Failed to submit showing request: ${error.message}`,
          variant: "destructive"
        });
        return;
      }

      console.log('Successfully created showing requests:', data);

      // Mark free showing as used for first-time users
      const currentEligibility = await checkEligibility();
      if (currentEligibility?.reason === 'first_free_showing') {
        await markFreeShowingUsed();
      }

      // Clear any pending tour data
      localStorage.removeItem('pendingTourRequest');
      
      // Call the success callback to refresh dashboard data
      if (onSuccess) {
        onSuccess();
      }
      
      toast({
        title: "Request Submitted Successfully! 🎉",
        description: `Your showing request${propertiesToSubmit.length > 1 ? 's have' : ' has'} been submitted. We'll review and assign a showing partner within 2-4 hours.`,
      });

      // Redirect to the buyer dashboard
      navigate('/buyer-dashboard');
      
    } catch (error) {
      console.error('Error submitting showing requests:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    submitShowingRequests
  };
};
