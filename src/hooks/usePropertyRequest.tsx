
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useShowingEligibility } from "@/hooks/useShowingEligibility";

const convertTo24Hour = (time: string): string => {
  const [t, modifier] = time.split(' ');
  let hours = t.split(':')[0];
  const minutes = t.split(':')[1];
  if (modifier.toLowerCase() === 'pm' && hours !== '12') {
    hours = String(Number(hours) + 12);
  }
  if (modifier.toLowerCase() === 'am' && hours === '12') {
    hours = '00';
  }
  return `${hours.padStart(2, '0')}:${minutes}:00`;
};

export interface PropertyRequestFormData {
  propertyAddress: string;
  mlsId: string;
  preferredDate1: string;
  preferredTime1: string;
  preferredDate2: string;
  preferredTime2: string;
  preferredDate3: string;
  preferredTime3: string;
  notes: string;
  selectedProperties: string[];
}

interface EligibilityResult {
  eligible: boolean;
  reason: string;
  active_showing_count?: number;
  subscription_tier?: string;
}

export const usePropertyRequest = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<PropertyRequestFormData>({
    propertyAddress: '',
    mlsId: '',
    preferredDate1: '',
    preferredTime1: '',
    preferredDate2: '',
    preferredTime2: '',
    preferredDate3: '',
    preferredTime3: '',
    notes: '',
    selectedProperties: [],
  });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showFreeShowingLimitModal, setShowFreeShowingLimitModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingShowingAddress, setPendingShowingAddress] = useState<string>('');
  
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { eligibility, checkEligibility, markFreeShowingUsed, resetFreeShowingEligibility } = useShowingEligibility();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step === 1) {
      // Check if user has either selected properties OR has entered a single property
      const hasSelectedProperties = formData.selectedProperties.length > 0;
      const hasSingleProperty = formData.propertyAddress || formData.mlsId;
      
      if (!hasSelectedProperties && !hasSingleProperty) {
        toast({
          title: "Property Required",
          description: "Please provide either a property address or MLS ID",
          variant: "destructive"
        });
        return;
      }
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleAddProperty = async () => {
    const propertyAddress = formData.propertyAddress || `MLS ID: ${formData.mlsId}`;
    
    if (!propertyAddress) {
      toast({
        title: "Property Required",
        description: "Please provide either a property address or MLS ID",
        variant: "destructive"
      });
      return;
    }

    if (formData.selectedProperties.includes(propertyAddress)) {
      toast({
        title: "Property Already Added",
        description: "This property is already in your tour session",
        variant: "destructive"
      });
      return;
    }

    // Check eligibility before allowing multiple properties for non-subscribers
    if (user && formData.selectedProperties.length >= 1) {
      const currentEligibility = await checkEligibility();
      
      if (!currentEligibility?.eligible || currentEligibility.reason !== 'subscribed') {
        toast({
          title: "Subscription Required",
          description: "Multiple properties in one tour session require a subscription. Please subscribe to add more homes!",
          variant: "destructive"
        });
        navigate('/subscriptions');
        return;
      }
    }

    setFormData(prev => ({
      ...prev,
      selectedProperties: [...prev.selectedProperties, propertyAddress],
      propertyAddress: '',
      mlsId: ''
    }));
    
    toast({
      title: "Property Added!",
      description: `Added "${propertyAddress}" to your tour session`,
    });
  };

  const handleRemoveProperty = (propertyToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      selectedProperties: prev.selectedProperties.filter(prop => prop !== propertyToRemove)
    }));
  };

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
      // Get all properties to submit
      const propertiesToSubmit = formData.selectedProperties.length > 0 
        ? formData.selectedProperties 
        : [formData.propertyAddress || `MLS ID: ${formData.mlsId}`];

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

      // Gather all preferred date/time options
      const preferredOptions = [1, 2, 3]
        .map((num) => {
          const date = formData[`preferredDate${num}` as keyof PropertyRequestFormData] as string;
          const time = formData[`preferredTime${num}` as keyof PropertyRequestFormData] as string;
          if (!date && !time) return null;
          return {
            date,
            time: time ? convertTo24Hour(time) : ''
          };
        })
        .filter(Boolean) as { date: string; time: string }[];

      const preferredDate = preferredOptions[0]?.date || '';
      const preferredTime = preferredOptions[0]?.time || '';

      // Calculate estimated confirmation date (2 business days from now)
      const estimatedDate = new Date();
      estimatedDate.setDate(estimatedDate.getDate() + 2);

      // Create showing requests for each property.
      const requests = propertiesToSubmit.map(property => ({
        user_id: user.id,
        property_address: property,
        preferred_date: preferredDate || null,
        preferred_time: preferredTime || null,
        message: formData.notes || null,
        internal_notes: preferredOptions.length > 1 ? JSON.stringify({ preferredOptions }) : null,
        status: 'pending',
        estimated_confirmation_date: estimatedDate.toISOString().split('T')[0]
      }));

      const { error } = await supabase
        .from('showing_requests')
        .insert(requests);

      if (error) {
        console.error('Error creating showing requests:', error);
        toast({
          title: "Error",
          description: "Failed to submit showing request. Please try again.",
          variant: "destructive"
        });
        return;
      }

      // Mark free showing as used for first-time users
      const currentEligibility = await checkEligibility();
      if (currentEligibility?.reason === 'first_free_showing') {
        await markFreeShowingUsed();
      }

      // Clear any pending tour data
      localStorage.removeItem('pendingTourRequest');
      
      toast({
        title: "Request Submitted Successfully! 🎉",
        description: `Your showing request${propertiesToSubmit.length > 1 ? 's have' : ' has'} been submitted. We'll review and assign a showing partner within 2-4 hours.`,
      });

      // Redirect to the appropriate dashboard
      const redirectPath =
        user.user_metadata?.user_type === 'agent'
          ? '/agent-dashboard'
          : '/buyer-dashboard';

      window.location.href = redirectPath;
      
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

  const handleContinueToSubscriptions = async () => {
    if (!user) {
      const properties = formData.selectedProperties.length > 0
        ? formData.selectedProperties
        : [formData.propertyAddress || `MLS ID: ${formData.mlsId}`];

      const preferredDates = [1, 2, 3]
        .map((num) => ({
          date: formData[`preferredDate${num}` as keyof PropertyRequestFormData] as string,
          time: formData[`preferredTime${num}` as keyof PropertyRequestFormData] as string,
        }))
        .filter((opt) => opt.date || opt.time);

      localStorage.setItem(
        'pendingTourRequest',
        JSON.stringify({ properties, preferredDates, notes: formData.notes })
      );
      setShowAuthModal(true);
      return;
    }
    
    // Check showing eligibility before proceeding
    const currentEligibility = await checkEligibility();
    
    if (!currentEligibility?.eligible) {
      if (currentEligibility?.reason === 'active_showing_exists') {
        // Show the free showing limit modal
        const address = await getPendingShowingAddress();
        setPendingShowingAddress(address);
        setShowFreeShowingLimitModal(true);
        return;
      } else if (currentEligibility?.reason === 'free_showing_used') {
        // Direct to subscriptions for users who have used their free showing
        toast({
          title: "Subscription Required",
          description: "You've already used your free showing. Subscribe to continue viewing homes!",
        });
        navigate('/subscriptions');
        return;
      }
    }

    // Submit the showing requests directly if eligible
    await submitShowingRequests();
  };

  return {
    step,
    formData,
    showAuthModal,
    setShowAuthModal,
    showFreeShowingLimitModal,
    setShowFreeShowingLimitModal,
    pendingShowingAddress,
    isSubmitting,
    eligibility,
    handleInputChange,
    handleNext,
    handleBack,
    handleAddProperty,
    handleRemoveProperty,
    handleContinueToSubscriptions,
    handleCancelPendingShowing,
    submitShowingRequests,
  };
};
