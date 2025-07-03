import { useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { PropertyRequestFormData } from "@/types/propertyRequest";
import { useShowingSubmission } from "./useShowingSubmission";

export const usePropertyRequest = (
  onClose: () => void,
  onSuccess?: () => Promise<void>,
  skipNavigation: boolean = true,
  subscriptionReadiness?: {
    canSubmitForms: boolean;
    isHealthy: boolean;
    errors: Array<{ name: string; error: string | null; retryCount: number }>;
  }
) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showFreeShowingLimitModal, setShowFreeShowingLimitModal] = useState(false);
  const [pendingShowingAddress, setPendingShowingAddress] = useState("");

  const [formData, setFormData] = useState<PropertyRequestFormData>({
    propertyAddress: "",
    notes: "",
    preferredDate1: "",
    preferredTime1: "",
    properties: []
  });

  const { isSubmitting, submitShowingRequests } = useShowingSubmission(
    formData, 
    onSuccess,
    subscriptionReadiness
  );

  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleNext = useCallback(() => {
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep]);

  const handleBack = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const handleAddProperty = useCallback(() => {
    if (formData.propertyAddress.trim()) {
      const newProperty = {
        address: formData.propertyAddress.trim(),
        notes: ""
      };
      
      setFormData(prev => ({
        ...prev,
        properties: [...prev.properties, newProperty],
        propertyAddress: ""
      }));
    }
  }, [formData.propertyAddress]);

  const handleRemoveProperty = useCallback((addressToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      properties: prev.properties.filter(prop => prop.address !== addressToRemove)
    }));
  }, []);

  const handleContinueToSubscriptions = useCallback(async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    // Check subscription readiness before submission
    if (subscriptionReadiness && !subscriptionReadiness.canSubmitForms) {
      console.warn('Subscriptions not ready, showing warning to user');
      toast({
        title: "Connection Issues",
        description: "We're experiencing connection issues. Your request may take longer to process.",
      });
    }

    try {
      await submitShowingRequests();
      
      if (onSuccess) {
        await onSuccess();
      }
      
      if (!skipNavigation) {
        navigate('/buyer-dashboard');
      }
      
      onClose();
      
    } catch (error) {
      console.error('Failed to submit showing requests:', error);
      // Error is already handled in useShowingSubmission
    }
  }, [user, submitShowingRequests, onSuccess, skipNavigation, navigate, onClose, subscriptionReadiness, toast]);

  const handleCancelPendingShowing = useCallback(() => {
    setPendingShowingAddress("");
    setShowFreeShowingLimitModal(false);
  }, []);

  const resetForm = useCallback(() => {
    setFormData({
      propertyAddress: "",
      notes: "",
      preferredDate1: "",
      preferredTime1: "",
      properties: []
    });
    setCurrentStep(1);
    setShowAuthModal(false);
    setShowFreeShowingLimitModal(false);
    setPendingShowingAddress("");
  }, []);

  return {
    currentStep,
    formData,
    showAuthModal,
    setShowAuthModal,
    showFreeShowingLimitModal,
    setShowFreeShowingLimitModal,
    isSubmitting,
    handleInputChange,
    handleNext,
    handleBack,
    handleContinueToSubscriptions,
    handleAddProperty,
    handleRemoveProperty,
    handleCancelPendingShowing,
    pendingShowingAddress,
    resetForm
  };
};
