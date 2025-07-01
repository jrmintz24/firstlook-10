
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { usePropertyRequest } from "@/hooks/usePropertyRequest";
import PropertySelectionStep from "@/components/property-request/PropertySelectionStep";
import SchedulingStep from "@/components/property-request/SchedulingStep";
import SummaryStep from "@/components/property-request/SummaryStep";
import QuickSignInModal from "@/components/property-request/QuickSignInModal";
import FreeShowingLimitModal from "@/components/showing-limits/FreeShowingLimitModal";

interface PropertyRequestWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const PropertyRequestWizard = ({ isOpen, onClose, onSuccess }: PropertyRequestWizardProps) => {
  const {
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
    resetForm
  } = usePropertyRequest(() => {
    onClose();
    if (onSuccess) {
      onSuccess();
    }
  });

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleAddPropertyToSelected = () => {
    if (formData.propertyAddress.trim()) {
      handleAddProperty();
    }
  };

  const handleRemovePropertyFromSelected = (property: string) => {
    handleRemoveProperty(property);
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Select Properties";
      case 2:
        return "Choose Times";
      case 3:
        return "Review & Submit";
      default:
        return "Request a Tour";
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PropertySelectionStep
            formData={formData}
            onInputChange={handleInputChange}
            onAddProperty={handleAddPropertyToSelected}
            onRemoveProperty={handleRemovePropertyFromSelected}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <SchedulingStep
            formData={formData}
            onInputChange={handleInputChange}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <SummaryStep
            formData={formData}
            onInputChange={handleInputChange}
            onContinueToSubscriptions={handleContinueToSubscriptions}
            onBack={handleBack}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return null;
    }
  };

  const handleAuthSuccess = () => {
    // After successful authentication, continue with the tour submission
    handleContinueToSubscriptions();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {getStepTitle()}
              <span className="text-sm text-gray-500">({currentStep}/3)</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="mt-4">
            {renderCurrentStep()}
          </div>
        </DialogContent>
      </Dialog>

      <QuickSignInModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />

      <FreeShowingLimitModal
        isOpen={showFreeShowingLimitModal}
        onClose={() => setShowFreeShowingLimitModal(false)}
      />
    </>
  );
};

export default PropertyRequestWizard;
