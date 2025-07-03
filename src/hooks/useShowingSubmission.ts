
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { PropertyRequestFormData } from "@/types/propertyRequest";

export const useShowingSubmission = (
  formData: PropertyRequestFormData,
  onDataRefresh?: () => Promise<void>
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const submitShowingRequests = async () => {
    if (!user) {
      console.error('No authenticated user found');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Submitting showing requests:', formData);

      // Get properties from either selectedProperties or the properties array
      const propertiesToSubmit = formData.selectedProperties?.length > 0 
        ? formData.selectedProperties.map(address => ({ address, notes: '' }))
        : formData.properties.filter(p => p.address.trim());

      if (propertiesToSubmit.length === 0) {
        toast({
          title: "Error",
          description: "Please add at least one property address.",
          variant: "destructive"
        });
        return;
      }

      console.log('Properties to submit:', propertiesToSubmit);

      // Create showing requests for each property
      const showingRequests = propertiesToSubmit.map((property, index) => {
        // Get preferred date/time from formData
        const preferredDate = formData.preferredDate1 || formData.preferredOptions?.[0]?.date || null;
        const preferredTime = formData.preferredTime1 || formData.preferredOptions?.[0]?.time || null;

        return {
          user_id: user.id,
          property_address: property.address,
          preferred_date: preferredDate,
          preferred_time: preferredTime,
          message: property.notes || formData.notes || null,
          status: 'pending' as const,
          assigned_agent_id: null,
          assigned_agent_name: null,
          assigned_agent_phone: null,
          assigned_agent_email: null,
          estimated_confirmation_date: null
        };
      });

      console.log('Submitting showing requests:', showingRequests);

      const { data, error } = await supabase
        .from('showing_requests')
        .insert(showingRequests)
        .select();

      if (error) {
        console.error('Error inserting showing requests:', error);
        throw error;
      }

      console.log('Successfully created showing requests:', data);

      toast({
        title: "Success!",
        description: `Tour request${propertiesToSubmit.length > 1 ? 's' : ''} submitted successfully!`,
      });

      // Force immediate refresh of the dashboard data
      if (onDataRefresh) {
        console.log('Triggering immediate data refresh...');
        await onDataRefresh();
      }

      // Also trigger a small delay refresh to catch any async updates
      setTimeout(async () => {
        if (onDataRefresh) {
          console.log('Triggering delayed data refresh...');
          await onDataRefresh();
        }
      }, 1000);

    } catch (error) {
      console.error('Error submitting showing requests:', error);
      toast({
        title: "Error",
        description: "Failed to submit tour requests. Please try again.",
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
