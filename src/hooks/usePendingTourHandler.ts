
import { useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const usePendingTourHandler = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const hasProcessedRef = useRef(false);

  const processPendingTour = useCallback(async () => {
    if (loading || !user || hasProcessedRef.current) {
      console.log('usePendingTourHandler: Not ready to process or already processed', { 
        loading, 
        hasUser: !!user, 
        hasProcessed: hasProcessedRef.current 
      });
      return;
    }

    // Check if we're currently in the onboarding flow
    const isOnboardingPath = window.location.pathname.includes('/onboarding');
    if (isOnboardingPath) {
      console.log('usePendingTourHandler: User is in onboarding, deferring tour processing');
      return;
    }

    console.log('usePendingTourHandler: Checking for pending tour request...');
    
    // Check if this is a new user from property request
    const isNewUserFromRequest = localStorage.getItem('newUserFromPropertyRequest');
    const pendingTourRequest = localStorage.getItem('pendingTourRequest');
    
    if (!pendingTourRequest) {
      console.log('usePendingTourHandler: No pending tour request found');
      if (isNewUserFromRequest) {
        localStorage.removeItem('newUserFromPropertyRequest');
      }
      return;
    }

    // Check if user has completed onboarding
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_completed')
        .eq('id', user.id)
        .single();

      if (profile && !profile.onboarding_completed) {
        console.log('usePendingTourHandler: Onboarding not completed, deferring tour processing');
        return;
      }
    } catch (error) {
      console.error('usePendingTourHandler: Error checking onboarding status:', error);
      // Continue with tour processing even if we can't check onboarding
    }

    // Mark as processed to prevent duplicate processing
    hasProcessedRef.current = true;

    try {
      const tourData = JSON.parse(pendingTourRequest);
      console.log('usePendingTourHandler: Processing pending tour request:', tourData);

      // Validate required data
      if (!tourData.propertyAddress) {
        console.error('usePendingTourHandler: Missing property information');
        localStorage.removeItem('pendingTourRequest');
        localStorage.removeItem('newUserFromPropertyRequest');
        toast({
          title: "Error",
          description: "Missing property information. Please try requesting a new tour.",
          variant: "destructive"
        });
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
        property_address: tourData.propertyAddress,
        preferred_date: preferredDate || null,
        preferred_time: preferredTime || null,
        message: tourData.notes || null,
        internal_notes: preferredOptions.length > 1 ? JSON.stringify({ preferredOptions }) : null,
        status: 'pending',
        estimated_confirmation_date: estimatedConfirmationDate.toISOString().split('T')[0]
      };

      console.log('usePendingTourHandler: Creating showing request:', showingRequest);

      const { data, error } = await supabase
        .from('showing_requests')
        .insert([showingRequest])
        .select();

      if (error) {
        console.error('usePendingTourHandler: Error creating showing request:', error);
        toast({
          title: "Error",
          description: `Failed to process your tour request: ${error.message}`,
          variant: "destructive"
        });
        // Reset the flag so user can try again
        hasProcessedRef.current = false;
        return;
      }

      console.log('usePendingTourHandler: Successfully created showing request:', data);

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

      // Force a page reload to refresh the dashboard data
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error) {
      console.error('usePendingTourHandler: Error processing pending tour request:', error);
      toast({
        title: "Error",
        description: "Failed to process your tour request. Please try requesting a new tour.",
        variant: "destructive"
      });
      
      // Clear corrupted data and reset flag
      localStorage.removeItem('pendingTourRequest');
      localStorage.removeItem('newUserFromPropertyRequest');
      hasProcessedRef.current = false;
    }
  }, [user, loading, toast]);

  useEffect(() => {
    // Reset the flag when user changes
    if (!user) {
      hasProcessedRef.current = false;
    }
  }, [user]);

  useEffect(() => {
    // Wait for auth to be ready, then process
    if (!loading && user) {
      // Add a small delay to ensure all auth state is settled
      const timeoutId = setTimeout(processPendingTour, 1500);
      return () => clearTimeout(timeoutId);
    }
  }, [loading, user, processPendingTour]);

  // Provide a manual trigger for after onboarding completion
  const triggerPendingTourProcessing = useCallback(() => {
    console.log('usePendingTourHandler: Manual trigger called');
    hasProcessedRef.current = false;
    processPendingTour();
  }, [processPendingTour]);

  return { triggerPendingTourProcessing };
};
