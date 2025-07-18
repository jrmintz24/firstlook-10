
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { PropertyRequestFormData } from "@/types/propertyRequest";

export const useShowingSubmission = (
  onDataRefresh?: () => Promise<void>
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const findPropertyByAddress = async (address: string) => {
    try {
      console.log('🔍 Looking for property with address:', address);
      
      // Try exact match first
      const { data: exactMatch } = await supabase
        .from('idx_properties')
        .select('id, mls_id, address')
        .eq('address', address)
        .single();
      
      if (exactMatch) {
        console.log('✅ Found exact property match:', exactMatch);
        return exactMatch;
      }
      
      // Try partial match (in case address format is slightly different)
      const { data: partialMatches } = await supabase
        .from('idx_properties')
        .select('id, mls_id, address')
        .ilike('address', `%${address.split(',')[0]}%`); // Match street address part
      
      if (partialMatches && partialMatches.length > 0) {
        console.log('✅ Found partial property match:', partialMatches[0]);
        return partialMatches[0];
      }
      
      console.log('❌ No property found for address:', address);
      return null;
    } catch (error) {
      console.error('Error finding property:', error);
      return null;
    }
  };

  const submitShowingRequests = async (formData: PropertyRequestFormData) => {
    console.log('DEBUG: submitShowingRequests called with formData:', formData);
    
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
      console.log('Submitting showing requests for user:', user.id);
      console.log('Form data:', formData);

      const showingRequests = [];

      // Handle multiple properties if they exist
      if (formData.properties && formData.properties.length > 0) {
        console.log('DEBUG: Processing properties array:', formData.properties);
        for (const property of formData.properties) {
          if (property.address && property.address.trim()) {
            console.log('DEBUG: Adding property from properties array:', property.address.trim());
            
            // Find matching property in idx_properties
            const propertyMatch = await findPropertyByAddress(property.address.trim());
            
            showingRequests.push({
              user_id: user.id,
              property_address: property.address.trim(),
              property_id: formData.propertyId || null,
              idx_property_id: propertyMatch?.id || null,
              mls_id: propertyMatch?.mls_id || null,
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
          console.log('DEBUG: Processing single propertyAddress:', formData.propertyAddress.trim());
          
          // Find matching property in idx_properties
          const propertyMatch = await findPropertyByAddress(formData.propertyAddress.trim());
          
          const request = {
            user_id: user.id,
            property_address: formData.propertyAddress.trim(),
            property_id: formData.propertyId || null,
            idx_property_id: propertyMatch?.id || null,
            mls_id: propertyMatch?.mls_id || null,
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
          console.log('DEBUG: Adding single property:', request.property_address);
          showingRequests.push(request);
        } else {
          console.log('DEBUG: Skipping duplicate property:', request.property_address);
        }
      }

      console.log('DEBUG: Final showing requests to submit:', showingRequests);

      if (showingRequests.length === 0) {
        console.error('DEBUG: No valid properties found to submit');
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
