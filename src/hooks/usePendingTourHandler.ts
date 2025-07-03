
import { useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuthValidation } from "./useAuthValidation";

interface UsePendingTourHandlerProps {
  onTourProcessed?: () => Promise<void>;
}

export const usePendingTourHandler = ({ onTourProcessed }: UsePendingTourHandlerProps = {}) => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const hasProcessedRef = useRef(false);
  const processingRef = useRef(false);
  const userIdRef = useRef<string | null>(null);
  
  const { validateAuthSession } = useAuthValidation();

  const processPendingTour = useCallback(async () => {
    if (loading || !user || hasProcessedRef.current || processingRef.current) {
      console.log('usePendingTourHandler: Not ready to process', { 
        loading, 
        hasUser: !!user, 
        hasProcessed: hasProcessedRef.current,
        processing: processingRef.current
      });
      return;
    }

    // Validate auth session before processing
    const { isValid, userId } = await validateAuthSession();
    
    if (!isValid || !userId) {
      console.warn('usePendingTourHandler: Invalid auth session, delaying tour processing');
      // Retry after a short delay
      setTimeout(() => {
        processPendingTour();
      }, 2000);
      return;
    }

    const pendingTourRequest = localStorage.getItem('pendingTourRequest');
    
    if (!pendingTourRequest) {
      console.log('usePendingTourHandler: No pending tour request found');
      const isNewUserFromRequest = localStorage.getItem('newUserFromPropertyRequest');
      if (isNewUserFromRequest) {
        localStorage.removeItem('newUserFromPropertyRequest');
        // Navigate to dashboard for new users even without pending tour
        setTimeout(() => {
          navigate('/buyer-dashboard', { replace: true });
        }, 1000);
      }
      return;
    }

    // Mark as processing to prevent duplicate processing
    processingRef.current = true;
    hasProcessedRef.current = true;

    try {
      const tourData = JSON.parse(pendingTourRequest);
      console.log('usePendingTourHandler: Processing pending tour request:', tourData);

      // Validate required data
      if (!tourData.propertyAddress) {
        console.error('usePendingTourHandler: Missing property information');
        throw new Error('Missing property information');
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

      // Create the showing request with validated user ID
      const showingRequest = {
        user_id: userId, // Use validated user ID
        property_address: tourData.propertyAddress,
        preferred_date: preferredDate || null,
        preferred_time: preferredTime || null,
        message: tourData.notes || null,
        internal_notes: preferredOptions.length > 1 ? JSON.stringify({ preferredOptions }) : null,
        status: 'pending',
        assigned_agent_id: null,
        assigned_agent_name: null,
        assigned_agent_phone: null,
        assigned_agent_email: null,
        estimated_confirmation_date: null
      };

      console.log('usePendingTourHandler: Creating showing request:', showingRequest);

      const { data, error } = await supabase
        .from('showing_requests')
        .insert([showingRequest])
        .select();

      if (error) {
        console.error('usePendingTourHandler: Error creating showing request:', error);
        throw error;
      }

      console.log('usePendingTourHandler: Successfully created showing request:', data);

      // Clear the pending data
      localStorage.removeItem('pendingTourRequest');
      localStorage.removeItem('newUserFromPropertyRequest');

      // Show success message
      const isNewUserFromRequest = localStorage.getItem('newUserFromPropertyRequest') === 'true';
      if (isNewUserFromRequest) {
        toast({
          title: "Welcome to FirstLook! 🎉",
          description: `Your tour request for ${showingRequest.property_address} has been submitted! We'll assign an agent within 2-4 hours.`,
        });
      } else {
        toast({
          title: "Tour Request Submitted! 🎉",
          description: `Your tour request for ${showingRequest.property_address} has been submitted successfully!`,
        });
      }

      // Call the callback to refresh data
      if (onTourProcessed) {
        await onTourProcessed();
      }

      // Navigate to dashboard after successful processing
      setTimeout(() => {
        navigate('/buyer-dashboard', { replace: true });
      }, 1500);

    } catch (error) {
      console.error('usePendingTourHandler: Error processing pending tour request:', error);
      
      // Clear corrupted/problematic data
      localStorage.removeItem('pendingTourRequest');
      localStorage.removeItem('newUserFromPropertyRequest');
      
      toast({
        title: "Error",
        description: "Failed to process your tour request. Please try requesting a new tour.",
        variant: "destructive"
      });
      
      // Still navigate to dashboard even on error
      setTimeout(() => {
        navigate('/buyer-dashboard', { replace: true });
      }, 2000);
      
      // Reset flags so user can try again
      hasProcessedRef.current = false;
      processingRef.current = false;
    } finally {
      processingRef.current = false;
    }
  }, [user, loading, toast, onTourProcessed, navigate, validateAuthSession]);

  // Reset flags when user changes
  useEffect(() => {
    if (userIdRef.current !== user?.id) {
      console.log('usePendingTourHandler: User changed, resetting flags');
      hasProcessedRef.current = false;
      processingRef.current = false;
      userIdRef.current = user?.id || null;
    }
  }, [user]);

  useEffect(() => {
    // Wait for auth to be ready, then process with additional buffer
    if (!loading && user && !hasProcessedRef.current) {
      // Add a buffer to ensure auth state is fully settled
      const timeoutId = setTimeout(processPendingTour, 1500); // Increased buffer
      return () => clearTimeout(timeoutId);
    }
  }, [loading, user, processPendingTour]);

  // Manual trigger for after onboarding completion
  const triggerPendingTourProcessing = useCallback(() => {
    console.log('usePendingTourHandler: Manual trigger called');
    hasProcessedRef.current = false;
    processingRef.current = false;
    setTimeout(processPendingTour, 100);
  }, [processPendingTour]);

  return { triggerPendingTourProcessing };
};
