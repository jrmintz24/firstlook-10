
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
  // New array format
  properties: [{ address: "", notes: "" }],
  preferredOptions: [{ date: "", time: "" }],
  notes: "",
  // Legacy fields for backward compatibility
  propertyAddress: '',
  preferredDate1: '',
  preferredTime1: '',
  preferredDate2: '',
  preferredTime2: '',
  preferredDate3: '',
  preferredTime3: '',
  selectedProperties: []
};

export const usePropertyRequest = (onClose?: () => void) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<PropertyRequestFormData>(initialFormData);
  const [showQuickSignIn, setShowQuickSignIn] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showFreeShowingLimitModal, setShowFreeShowingLimitModal] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Get management hooks
  const { handleAddProperty, handleRemoveProperty } = usePropertyManagement(formData, setFormData);
  const { isSubmitting, submitShowingRequests } = useShowingSubmission(formData);
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
            propertyAddress: tourData.propertyAddress || '',
            preferredDate1: tourData.preferredDate1 || '',
            preferredTime1: tourData.preferredTime1 || '',
            preferredDate2: tourData.preferredDate2 || '',
            preferredTime2: tourData.preferredTime2 || '',
            preferredDate3: tourData.preferredDate3 || '',
            preferredTime3: tourData.preferredTime3 || '',
            notes: tourData.notes || ''
          }));
        }
      } catch (error) {
        console.error('usePropertyRequest: Error parsing pending tour request:', error);
        localStorage.removeItem('pendingTourRequest');
      }
    }
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleContinueToSubscriptions = async () => {
    if (!user) {
      // Store current form data in localStorage before redirecting to auth
      console.log('usePropertyRequest: Storing tour request for unauthenticated user:', formData);
      localStorage.setItem('pendingTourRequest', JSON.stringify(formData));
      setShowAuthModal(true);
      return;
    }

    // Check eligibility before submission
    const currentEligibility = await checkEligibility();
    
    if (!currentEligibility?.eligible) {
      if (currentEligibility?.reason === 'free_showing_used') {
        setShowFreeShowingLimitModal(true);
        return;
      }
    }

    await submitShowingRequests();
    
    // Clear form and close modal
    setFormData(initialFormData);
    setCurrentStep(1);
    
    // Call onClose to trigger dashboard refresh
    if (onClose) {
      onClose();
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setCurrentStep(1);
  };

  return {
    // Legacy properties for backward compatibility
    step: currentStep,
    showAuthModal,
    setShowAuthModal,
    showFreeShowingLimitModal,
    setShowFreeShowingLimitModal,
    eligibility,
    
    // Current properties
    currentStep,
    formData,
    setFormData,
    showQuickSignIn,
    setShowQuickSignIn,
    pendingShowingAddress,
    isSubmitting,
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
