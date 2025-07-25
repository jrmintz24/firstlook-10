import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { PropertyRequestFormData, PropertyEntry } from "@/types/propertyRequest";
import { usePropertyManagement } from "@/hooks/usePropertyManagement";
import { useShowingSubmission } from "@/hooks/useShowingSubmission";
import { usePendingShowingManagement } from "@/hooks/usePendingShowingManagement";
import { useShowingEligibility } from "@/hooks/useShowingEligibility";

const initialFormData: PropertyRequestFormData = {
  properties: [{ address: "", notes: "", mlsId: "", source: "manual" }],
  preferredOptions: [{ date: "", time: "" }],
  notes: "",
  propertyAddress: '',
  propertyId: '',
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

  // Get management hooks with updated property handling
  const { handleAddProperty, handleRemoveProperty } = usePropertyManagement(formData, setFormData);
  const { isSubmitting, submitShowingRequests } = useShowingSubmission(onDataRefresh);
  const { eligibility, checkEligibility } = useShowingEligibility();
  const { 
    pendingShowingAddress, 
    setPendingShowingAddress, 
    getPendingShowingAddress, 
    handleCancelPendingShowing 
  } = usePendingShowingManagement();

  console.log('usePropertyRequest - Current modalFlow:', modalFlow);

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
            properties: [{ address: tourData.propertyAddress || '', notes: '', mlsId: tourData.mlsId || '', source: tourData.source || 'manual' }],
            propertyAddress: tourData.propertyAddress || '',
            propertyId: tourData.propertyId || '',
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
            { 
              address: value, 
              notes: updated.properties[0].notes,
              mlsId: updated.properties[0].mlsId || '',
              source: updated.properties[0].source || 'manual'
            },
            ...updated.properties.slice(1)
          ];
        }
      }

      return updated;
    });
  };

  // Function to add IDX property to the form
  const handleAddIDXProperty = (property: any) => {
    const newPropertyEntry: PropertyEntry = {
      address: property.address?.full || property.address || '',
      notes: property.remarks || '',
      mlsId: property.mlsId || '',
      source: 'idx'
    };

    setFormData(prev => {
      const existingProperties = prev.properties.filter(p => p.address.trim());
      const updatedProperties = [...existingProperties, newPropertyEntry];
      
      return {
        ...prev,
        properties: updatedProperties,
        propertyAddress: newPropertyEntry.address,
        selectedProperties: [...prev.selectedProperties, newPropertyEntry.address]
      };
    });

    toast({
      title: "IDX Property Added",
      description: `Added ${newPropertyEntry.address} to your tour request`,
    });
  };

  const handleNext = () => {
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleContinueToSubscriptions = async (currentFormData?: PropertyRequestFormData) => {
    console.log('handleContinueToSubscriptions called');
    console.log('Current user:', user?.id);
    
    const dataToSubmit = currentFormData || formData;
    console.log('Form data to submit:', dataToSubmit);

    if (!user?.id) {
      console.log('usePropertyRequest: No authenticated user, storing tour request');
      localStorage.setItem('pendingTourRequest', JSON.stringify(dataToSubmit));
      setModalFlow('auth');
      return;
    }

    const currentEligibility = await checkEligibility();
    console.log('User eligibility:', currentEligibility);
    
    if (!currentEligibility?.eligible) {
      if (currentEligibility?.reason === 'monthly_limit_exceeded') {
        console.log('Monthly limit exceeded, showing limit modal');
        setModalFlow('limit');
        return;
      }
    }

    try {
      console.log('Submitting showing requests for authenticated user:', user.id);
      
      await submitShowingRequests(dataToSubmit);
      
      setFormData(initialFormData);
      setCurrentStep(1);
      setModalFlow('closed');
      
      toast({
        title: "Tour Request Submitted",
        description: "Your tour request has been submitted successfully!",
      });
      
      if (onClose) {
        onClose();
      }
      
      if (!skipNavigation) {
        console.log('Navigating to buyer dashboard');
        navigate('/buyer-dashboard', { replace: true });
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
    console.log('Resetting form and modal state');
    setFormData(initialFormData);
    setCurrentStep(1);
    setModalFlow('closed');
  };

  return {
    // Legacy properties for backward compatibility
    step: currentStep,
    showAuthModal: modalFlow === 'auth',
    setShowAuthModal: (show: boolean) => setModalFlow(show ? 'auth' : 'closed'),
    showFreeShowingLimitModal: modalFlow === 'limit',
    setShowFreeShowingLimitModal: (show: boolean) => setModalFlow(show ? 'limit' : 'closed'),
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
    handleAddIDXProperty,
    resetForm
  };
};
