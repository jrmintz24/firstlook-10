
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { PropertyRequestFormData } from "@/types/propertyRequest";
import { usePropertyManagement } from "@/hooks/usePropertyManagement";
import { useShowingSubmission } from "@/hooks/useShowingSubmission";
import { usePendingShowingManagement } from "@/hooks/usePendingShowingManagement";

const initialFormData: PropertyRequestFormData = {
  propertyAddress: '',
  mlsId: '',
  preferredDate1: '',
  preferredTime1: '',
  preferredDate2: '',
  preferredTime2: '',
  preferredDate3: '',
  preferredTime3: '',
  notes: '',
  selectedProperties: []
};

export const usePropertyRequest = (onClose?: () => void) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<PropertyRequestFormData>(initialFormData);
  const [showQuickSignIn, setShowQuickSignIn] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Get management hooks
  const { handleAddProperty, handleRemoveProperty } = usePropertyManagement(formData, setFormData);
  const { isSubmitting, submitShowingRequests } = useShowingSubmission(formData);
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
        console.log('Loading pending tour request:', tourData);
        
        if (tourData.propertyAddress || tourData.mlsId) {
          setFormData(prev => ({
            ...prev,
            propertyAddress: tourData.propertyAddress || '',
            mlsId: tourData.mlsId || ''
          }));
        }
      } catch (error) {
        console.error('Error parsing pending tour request:', error);
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
      localStorage.setItem('pendingTourRequest', JSON.stringify(formData));
      setShowQuickSignIn(true);
      return;
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

  const handleQuickSignInSuccess = () => {
    setShowQuickSignIn(false);
    // After successful sign in, the form will automatically submit
    handleContinueToSubscriptions();
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setCurrentStep(1);
  };

  return {
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
    handleQuickSignInSuccess,
    handleAddProperty,
    handleRemoveProperty,
    handleCancelPendingShowing,
    resetForm
  };
};
