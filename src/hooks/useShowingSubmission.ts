
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { PropertyRequestFormData } from "@/types/propertyRequest";

export const useShowingSubmission = (
  formData: PropertyRequestFormData,
  onDataRefresh?: () => Promise<void>,
  subscriptionReadiness?: {
    canSubmitForms: boolean;
    isHealthy: boolean;
    errors: Array<{ name: string; error: string | null; retryCount: number }>;
  }
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const submitShowingRequests = async () => {
    if (!user?.id) {
      console.error('No authenticated user found for showing submission');
      toast({
        title: "Authentication Required",
        description: "Please sign in to submit tour requests.",
        variant: "destructive"
      });
      throw new Error('User must be authenticated to submit showing requests');
    }

    // Check subscription readiness if provided
    if (subscriptionReadiness && !subscriptionReadiness.canSubmitForms) {
      console.warn('Subscription not ready, but proceeding with submission and manual refresh fallback');
      
      // Show warning if there are subscription issues
      if (subscriptionReadiness.errors.length > 0) {
        toast({
          title: "Connection Issues Detected",
          description: "Your tour request will be submitted, but real-time updates may be delayed.",
          variant: "default"
        });
      }
    }

    setIsSubmitting(true);
    
    try {
      console.log('Submitting showing requests for user:', user.id);
      console.log('Form data:', formData);
      console.log('Subscription readiness:', subscriptionReadiness);

      const showingRequests = [];

      // Handle multiple properties if they exist
      if (formData.properties && formData.properties.length > 0) {
        for (const property of formData.properties) {
          if (property.address.trim()) {
            showingRequests.push({
              user_id: user.id,
              property_address: property.address.trim(),
              message: property.notes || formData.notes || null,
              preferred_date: formData.preferredDate1 || null,
              preferred_time: formData.preferredTime1 || null,
              status: 'pending'
            });
          }
        }
      }

      // Handle single property from direct form fields
      if (formData.propertyAddress && formData.propertyAddress.trim()) {
        const request = {
          user_id: user.id,
          property_address: formData.propertyAddress.trim(),
          message: formData.notes || null,
          preferred_date: formData.preferredDate1 || null,
          preferred_time: formData.preferredTime1 || null,
          status: 'pending'
        };

        // Avoid duplicates
        const isDuplicate = showingRequests.some(req => 
          req.property_address === request.property_address
        );
        
        if (!isDuplicate) {
          showingRequests.push(request);
        }
      }

      if (showingRequests.length === 0) {
        throw new Error('No valid properties to submit');
      }

      console.log('Submitting requests:', showingRequests);

      // Submit all requests
      const { data, error } = await supabase
        .from('showing_requests')
        .insert(showingRequests)
        .select();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Successfully submitted showing requests:', data);

      // Clear any pending tour request from localStorage
      localStorage.removeItem('pendingTourRequest');

      // Always refresh data after submission - this provides fallback for subscription issues
      if (onDataRefresh) {
        console.log('Refreshing dashboard data after submission...');
        await onDataRefresh();
      }

      // Show success message with appropriate context
      const successMessage = subscriptionReadiness?.isHealthy 
        ? `Successfully submitted ${showingRequests.length} tour request${showingRequests.length > 1 ? 's' : ''}!`
        : `Tour request submitted! Your dashboard will update shortly.`;

      toast({
        title: "Tour Request Submitted",
        description: successMessage,
      });

      return data;

    } catch (error: any) {
      console.error('Error submitting showing requests:', error);
      
      let errorMessage = "Failed to submit tour request. Please try again.";
      
      if (error.message?.includes('violates row-level security')) {
        errorMessage = "Authentication error. Please sign in and try again.";
      } else if (error.message?.includes('check_user_id_not_null')) {
        errorMessage = "Authentication required. Please ensure you're signed in.";
      }

      toast({
        title: "Submission Error",
        description: errorMessage,
        variant: "destructive"
      });

      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    submitShowingRequests
  };
};
