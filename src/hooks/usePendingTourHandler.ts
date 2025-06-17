
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export const usePendingTourHandler = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const processPendingTour = async () => {
      if (loading || !user) return;

      console.log('Checking for pending tour request...');
      
      // Check if this is a new user from property request
      const isNewUserFromRequest = localStorage.getItem('newUserFromPropertyRequest');
      const pendingTourRequest = localStorage.getItem('pendingTourRequest');
      
      if (!pendingTourRequest) {
        console.log('No pending tour request found');
        return;
      }

      try {
        const tourData = JSON.parse(pendingTourRequest);
        console.log('Processing pending tour request:', tourData);

        // Validate required data
        if (!tourData.propertyAddress && !tourData.mlsId) {
          console.error('Missing property information in pending tour request');
          localStorage.removeItem('pendingTourRequest');
          localStorage.removeItem('newUserFromPropertyRequest');
          return;
        }

        // Get preferred date/time options
        const preferredOptions = [];
        for (let i = 1; i <= 3; i++) {
          const date = tourData[`preferredDate${i}`];
          const time = tourData[`preferredTime${i}`];
          if (date) {
            preferredOptions.push({ date, time: time || '' });
          }
        }

        const preferredDate = preferredOptions[0]?.date || '';
        const preferredTime = preferredOptions[0]?.time || '';

        // Calculate estimated confirmation date (2-4 hours from now)
        const estimatedConfirmationDate = new Date();
        estimatedConfirmationDate.setHours(estimatedConfirmationDate.getHours() + 3);

        // Create the showing request
        const showingRequest = {
          user_id: user.id,
          property_address: tourData.propertyAddress || `Property (MLS: ${tourData.mlsId})`,
          preferred_date: preferredDate || null,
          preferred_time: preferredTime || null,
          message: tourData.notes || null,
          internal_notes: preferredOptions.length > 1 ? JSON.stringify({ preferredOptions }) : null,
          status: 'pending',
          estimated_confirmation_date: estimatedConfirmationDate.toISOString().split('T')[0]
        };

        console.log('Creating showing request:', showingRequest);

        const { data, error } = await supabase
          .from('showing_requests')
          .insert([showingRequest])
          .select();

        if (error) {
          console.error('Error creating showing request:', error);
          toast({
            title: "Error",
            description: `Failed to process your tour request: ${error.message}`,
            variant: "destructive"
          });
          return;
        }

        console.log('Successfully created showing request:', data);

        // Clear the pending data
        localStorage.removeItem('pendingTourRequest');
        localStorage.removeItem('newUserFromPropertyRequest');

        // Show success message
        if (isNewUserFromRequest) {
          toast({
            title: "Welcome to FirstLook! 🎉",
            description: `Your tour request for ${showingRequest.property_address} has been submitted successfully! We'll review and assign a showing partner within 2-4 hours.`,
          });
        } else {
          toast({
            title: "Tour Request Submitted! 🎉",
            description: `Your tour request for ${showingRequest.property_address} has been submitted successfully!`,
          });
        }

        // If on auth page, redirect to dashboard
        if (window.location.pathname.includes('/buyer-auth')) {
          navigate('/buyer-dashboard', { replace: true });
        }

      } catch (error) {
        console.error('Error processing pending tour request:', error);
        toast({
          title: "Error",
          description: "Failed to process your tour request. Please try requesting a new tour.",
          variant: "destructive"
        });
        
        // Clear corrupted data
        localStorage.removeItem('pendingTourRequest');
        localStorage.removeItem('newUserFromPropertyRequest');
      }
    };

    // Small delay to ensure auth state is fully loaded
    const timeoutId = setTimeout(processPendingTour, 1000);
    
    return () => clearTimeout(timeoutId);
  }, [user, loading, toast, navigate]);
};
