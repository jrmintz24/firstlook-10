
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { PropertyRequestFormData } from "@/types/propertyRequest";

export const useShowingSubmission = (
  formData: PropertyRequestFormData,
  onDataRefresh?: () => Promise<void>
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const ensureProfileExists = async (userId: string, maxRetries = 3): Promise<boolean> => {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', userId)
          .maybeSingle();

        if (error) {
          console.error(`Profile check attempt ${attempt + 1} failed:`, error);
          if (attempt < maxRetries - 1) {
            await new Promise(resolve => setTimeout(resolve, 500 * (attempt + 1)));
            continue;
          }
          return false;
        }

        if (profile) {
          console.log('Profile confirmed to exist for user:', userId);
          return true;
        }

        // Profile doesn't exist, wait a bit and retry
        console.log(`Profile not found on attempt ${attempt + 1}, retrying...`);
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
      } catch (error) {
        console.error(`Profile check attempt ${attempt + 1} error:`, error);
        if (attempt < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, 500 * (attempt + 1)));
        }
      }
    }
    
    return false;
  };

  const submitWithRetry = async (showingRequests: any[], maxRetries = 2) => {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        console.log(`Submission attempt ${attempt + 1}:`, {
          requestCount: showingRequests.length,
          userId: user?.id,
          requests: showingRequests
        });

        const { data, error } = await supabase
          .from('showing_requests')
          .insert(showingRequests)
          .select();

        if (error) {
          console.error(`Submission attempt ${attempt + 1} failed:`, error);
          
          // Check if it's an RLS/authentication related error
          if (error.message?.includes('row-level security') || 
              error.message?.includes('check_user_id_not_null') ||
              error.message?.includes('violates row-level security')) {
            
            if (attempt < maxRetries - 1) {
              console.log('RLS error detected, waiting and retrying...');
              await new Promise(resolve => setTimeout(resolve, 1000));
              continue;
            }
          }
          
          throw error;
        }

        console.log('Submission successful:', data);
        return data;
      } catch (error) {
        console.error(`Submission attempt ${attempt + 1} exception:`, error);
        if (attempt === maxRetries - 1) {
          throw error;
        }
        await new Promise(resolve => setTimeout(resolve, 500 * (attempt + 1)));
      }
    }
  };

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

    setIsSubmitting(true);
    
    try {
      console.log('Starting showing submission process for user:', user.id);
      
      // Ensure profile exists before proceeding
      const profileExists = await ensureProfileExists(user.id);
      if (!profileExists) {
        console.error('Profile verification failed after retries');
        throw new Error('Profile not ready. Please try again in a moment.');
      }

      // Prepare showing requests
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

      console.log('Prepared requests for submission:', showingRequests);

      // Submit with retry logic
      const data = await submitWithRetry(showingRequests);

      // Clear any pending tour request from localStorage
      localStorage.removeItem('pendingTourRequest');

      // Refresh dashboard data if callback provided
      if (onDataRefresh) {
        await onDataRefresh();
      }

      toast({
        title: "Tour Request Submitted",
        description: `Successfully submitted ${showingRequests.length} tour request${showingRequests.length > 1 ? 's' : ''}!`,
      });

      return data;

    } catch (error: any) {
      console.error('Final submission error:', error);
      
      let errorMessage = "Failed to submit tour request. Please try again.";
      
      if (error.message?.includes('Profile not ready')) {
        errorMessage = "Your profile is still being set up. Please wait a moment and try again.";
      } else if (error.message?.includes('violates row-level security')) {
        errorMessage = "Authentication error. Please refresh the page and try again.";
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
