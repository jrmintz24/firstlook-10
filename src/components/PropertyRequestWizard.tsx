import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useShowingSubmission } from "@/hooks/useShowingSubmission";
import { PropertyRequestFormData } from "@/types/propertyRequest";
import PropertySelectionStep from "./property-request/PropertySelectionStep";
import SchedulingStep from "./property-request/SchedulingStep";
import SummaryStep from "./property-request/SummaryStep";

interface PropertyRequestWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const PropertyRequestWizard = ({ isOpen, onClose, onSuccess }: PropertyRequestWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<PropertyRequestFormData>({
    properties: [{ address: "", notes: "" }],
    preferredDate1: "",
    preferredTime1: "",
    notes: ""
  });

  const { user, loading: authLoading, profileReady } = useAuth();
  const { isSubmitting, submitShowingRequests } = useShowingSubmission(formData);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setFormData({
        properties: [{ address: "", notes: "" }],
        preferredDate1: "",
        preferredTime1: "",
        notes: ""
      });
    }
  }, [isOpen]);

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      console.error('No user found during submission');
      return;
    }

    if (!profileReady) {
      console.log('Profile not ready, waiting...');
      // Give a moment for profile to be ready
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    try {
      console.log('Submitting tour request...', { 
        userId: user.id, 
        profileReady,
        formData 
      });
      
      await submitShowingRequests();
      
      console.log('Tour request submitted successfully');
      onClose();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Tour request submission failed:', error);
      // Error is already handled in the hook with toast
    }
  };

  const steps = [
    {
      number: 1,
      title: "Property Selection",
      component: (
        <PropertySelectionStep
          formData={formData}
          setFormData={setFormData}
          onNext={handleNext}
        />
      )
    },
    {
      number: 2,
      title: "Schedule Tour",
      component: (
        <SchedulingStep
          formData={formData}
          setFormData={setFormData}
          onNext={handleNext}
          onBack={handleBack}
        />
      )
    },
    {
      number: 3,
      title: "Review & Submit",
      component: (
        <SummaryStep
          formData={formData}
          onBack={handleBack}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          authLoading={authLoading}
          profileReady={profileReady}
        />
      )
    }
  ];

  if (authLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Loading...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Request a Tour</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Progress indicator */}
        <div className="flex items-center justify-center space-x-4 mb-6">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step.number
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {step.number}
              </div>
              <span className="ml-2 text-sm font-medium text-gray-700">
                {step.title}
              </span>
              {index < steps.length - 1 && (
                <div className="w-8 h-px bg-gray-300 mx-4" />
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        <Card>
          <CardHeader>
            <CardTitle>{steps[currentStep - 1].title}</CardHeader>
          </CardHeader>
          <CardContent>
            {steps[currentStep - 1].component}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyRequestWizard;
