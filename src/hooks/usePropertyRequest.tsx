
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { PropertyRequestFormData } from "@/types/propertyRequest";
import { usePropertyManagement } from "@/hooks/usePropertyManagement";
import { useShowingSubmission } from "@/hooks/useShowingSubmission";
import { usePendingShowingManagement } from "@/hooks/usePendingShowingManagement";
import { useShowingEligibility } from "@/hooks/useShowingEligibility";

const initialFormData: PropertyRequestFormData = {
  properties: [{ address: "", notes: "" }],
  preferredOptions: [{ date: "", time: "" }],
  notes: "",
  propertyAddress: '',
  preferredDate1: '',
  preferredTime1: '',
  preferredDate2: '',
  preferredTime2: '',
  preferredDate3: '',
  preferredTime3: '',
  selectedProperties: []
};

export const usePropertyRequest = (
  onClose?: () => void, 
  onDataRefresh?: () => Promise<void>,
  skipNavigation?: boolean
) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<PropertyRequestFormData>(initialFormData);
  const [showQuickSignIn, setShowQuickSignIn] = useState(false);
  const [modalFlow, setModalFlow] = useState<'scheduling' | 'auth' | 'limit' | 'closed'>('scheduling');
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Get management hooks
  const { handleAddProperty, handleRemoveProperty } = usePropertyManagement(formData, setFormData);
  const { isSubmitting, submitShowingRequests } = useShowingSubmission(formData, onDataRefresh);
  const { eligibility, checkEligibility } = useShowingEligibility();
  const { 
    pendingShowingAddress, 
    setPendingShowingAddress, 
    getPendingShowingAddress, 
    handleCancelPendingShowing 
  } = usePendingShowingManagement();

  useEffect(() => {
    const loadPendingShowing = async () => {
      const address = await getPendingShowingAddress();
      setPendingShowingAddress(address);
    };
    loadPendingShowing();
  }, []);

  useEffect(() => {
    // Check for pending tour request from localStorage
    const pendingTourRequest = localStorage.getItem('pendingTourRequest');
    if (pendingTourRequest) {
      try {
        const tourData = JSON.parse(pendingTourRequest);
        console.log('usePropertyRequest: Loading pending tour request:', tourData);
        
        if (tourData.propertyAddress) {
          setFormData(prev => ({
            ...prev,
            properties: [{ address: tourData.propertyAddress || '', notes: '' }],
            propertyAddress: tourData.propertyAddress || '',
            preferredDate1: tourData.preferredDate1 || '',
            preferredTime1: tourData.preferredTime1 || '',
            preferredDate2: tourData.preferredDate2 || '',
            preferredTime2: tourData.preferredTime2 || '',
            preferredDate3: tourData.preferredDate3 || '',
            preferredTime3: tourData.preferredTime3 || '',
            notes: tourData.notes || '',
            selectedProperties: tourData.propertyAddress ? [tourData.propertyAddress] : []
          }));
        }
      } catch (error) {
        console.error('usePropertyRequest: Error parsing pending tour request:', error);
        localStorage.removeItem('pendingTourRequest');
      }
    }
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => {
      const updated = {
        ...prev,
        [field]: value
      };

      if (field === 'propertyAddress') {
        if (updated.properties[0] && !updated.properties[0].address.trim()) {
          updated.properties = [
            { address: value, notes: updated.properties[0].notes },
            ...updated.properties.slice(1)
          ];
        }
      }

      return updated;
    });
  };

  const handleNext = () => {
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleContinueToSubscriptions = async () => {
    if (!user) {
      console.log('usePropertyRequest: Storing tour request for unauthenticated user:', formData);
      localStorage.setItem('pendingTourRequest', JSON.stringify(formData));
      setModalFlow('auth');
      return;
    }

    // Check eligibility before submission
    const currentEligibility = await checkEligibility();
    
    if (!currentEligibility?.eligible) {
      if (currentEligibility?.reason === 'free_showing_used') {
        setModalFlow('limit');
        return;
      }
    }

    try {
      // Submit the requests and wait for completion
      await submitShowingRequests();
      
      // Clear form and close modal after successful submission
      setFormData(initialFormData);
      setCurrentStep(1);
      setModalFlow('closed');
      
      // Show success message
      toast({
        title: "Tour Request Submitted",
        description: "Your tour request has been submitted successfully!",
      });
      
      // Call onClose to close the modal
      if (onClose) {
        onClose();
      }
      
      // Navigate to dashboard only if not skipping navigation
      if (!skipNavigation) {
        navigate('/buyer-dashboard');
      }
      
    } catch (error) {
      console.error('Error submitting showing requests:', error);
      toast({
        title: "Submission Error",
        description: "Failed to submit your tour request. Please try again.",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setCurrentStep(1);
    setModalFlow('scheduling');
  };

  return {
    // Legacy properties for backward compatibility
    step: currentStep,
    showAuthModal: modalFlow === 'auth',
    setShowAuthModal: (show: boolean) => setModalFlow(show ? 'auth' : 'scheduling'),
    showFreeShowingLimitModal: modalFlow === 'limit',
    setShowFreeShowingLimitModal: (show: boolean) => setModalFlow(show ? 'limit' : 'scheduling'),
    eligibility,
    
    // Current properties
    currentStep,
    formData,
    setFormData,
    showQuickSignIn,
    setShowQuickSignIn,
    pendingShowingAddress,
    isSubmitting,
    modalFlow,
    setModalFlow,
    handleInputChange,
    handleNext,
    handleBack,
    handleContinueToSubscriptions,
    handleAddProperty,
    handleRemoveProperty,
    handleCancelPendingShowing,
    resetForm
  };
};
