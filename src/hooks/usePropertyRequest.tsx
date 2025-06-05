
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const convertTo24Hour = (time: string): string => {
  const [t, modifier] = time.split(' ');
  let [hours, minutes] = t.split(':');
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
  const [isSubmitting, setIsSubmitting] = useState(false);
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

      // Get the primary preferred date/time
      const preferredDate = formData.preferredDate1;
      const preferredTime = formData.preferredTime1
        ? convertTo24Hour(formData.preferredTime1)
        : '';

      // Calculate estimated confirmation date (2 business days from now)
      const estimatedDate = new Date();
      estimatedDate.setDate(estimatedDate.getDate() + 2);

      // Create showing requests for each property.
      // Use the legacy "pending" status since the database check constraint
      // currently only allows this value.
      const requests = propertiesToSubmit.map(property => ({
        user_id: user.id,
        property_address: property,
        preferred_date: preferredDate || null,
        preferred_time: preferredTime || null,
        message: formData.notes || null,
        status: 'pending',
        estimated_confirmation_date: estimatedDate.toISOString().split('T')[0] // YYYY-MM-DD format
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

      // Clear any pending tour data
      localStorage.removeItem('pendingTourRequest');
      
      toast({
        title: "Request Submitted Successfully! 🎉",
        description: `Your showing request${propertiesToSubmit.length > 1 ? 's have' : ' has'} been submitted. We'll review and assign a showing partner within 2-4 hours.`,
      });

      // Navigate to dashboard
      navigate('/buyer-dashboard');
      
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
      setShowAuthModal(true);
      return;
    }
    
    // Submit the showing requests directly instead of going to subscriptions
    await submitShowingRequests();
  };

  return {
    step,
    formData,
    showAuthModal,
    setShowAuthModal,
    isSubmitting,
    handleInputChange,
    handleNext,
    handleBack,
    handleAddProperty,
    handleRemoveProperty,
    handleContinueToSubscriptions,
    submitShowingRequests,
  };
};

