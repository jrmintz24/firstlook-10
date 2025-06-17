
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useShowingEligibility } from "@/hooks/useShowingEligibility";
import { PropertyRequestFormData } from "@/types/propertyRequest";
import { usePropertyManagement } from "@/hooks/usePropertyManagement";
import { useShowingSubmission } from "@/hooks/useShowingSubmission";
import { usePendingShowingManagement } from "@/hooks/usePendingShowingManagement";

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
  
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { eligibility, checkEligibility } = useShowingEligibility();

  // Use the smaller hooks
  const { handleAddProperty, handleRemoveProperty } = usePropertyManagement(formData, setFormData);
  const { isSubmitting, submitShowingRequests } = useShowingSubmission(formData);
  const { 
    pendingShowingAddress, 
    setPendingShowingAddress, 
    getPendingShowingAddress, 
    handleCancelPendingShowing 
  } = usePendingShowingManagement();

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

  const handleContinueToSubscriptions = async () => {
    console.log('handleContinueToSubscriptions called', { user: !!user });
    
    if (!user) {
      console.log('No user, storing pending tour request');
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
    console.log('Current eligibility:', currentEligibility);
    
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
    console.log('User is eligible, submitting showing requests');
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
