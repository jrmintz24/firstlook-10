
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

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
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

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

  const handleAddProperty = () => {
    const propertyAddress = formData.propertyAddress || `MLS ID: ${formData.mlsId}`;
    if (propertyAddress && !formData.selectedProperties.includes(propertyAddress)) {
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
    }
  };

  const handleRemoveProperty = (propertyToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      selectedProperties: prev.selectedProperties.filter(prop => prop !== propertyToRemove)
    }));
  };

  const handleContinueToSubscriptions = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    
    // Store tour data in localStorage to persist across navigation
    const tourData = {
      properties: formData.selectedProperties,
      preferredDates: [
        { date: formData.preferredDate1, time: formData.preferredTime1 },
        { date: formData.preferredDate2, time: formData.preferredTime2 },
        { date: formData.preferredDate3, time: formData.preferredTime3 },
      ].filter(slot => slot.date && slot.time),
      notes: formData.notes,
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('pendingTourRequest', JSON.stringify(tourData));
    navigate('/subscriptions');
  };

  return {
    step,
    formData,
    showAuthModal,
    setShowAuthModal,
    handleInputChange,
    handleNext,
    handleBack,
    handleAddProperty,
    handleRemoveProperty,
    handleContinueToSubscriptions,
  };
};
