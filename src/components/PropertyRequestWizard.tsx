
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
    handleCancelPendingShowing,
    pendingShowingAddress,
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
    handleContinueToSubscriptions();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[700px] max-h-[85vh] bg-white border-2 border-gray-200">
          <DialogHeader className="border-b border-gray-100 pb-4">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-semibold text-gray-900">
                {getStepTitle()}
              </DialogTitle>
              <div className="flex items-center gap-2">
                {[1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className={`w-8 h-2 rounded-full transition-colors ${
                      step <= currentStep ? 'bg-black' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          </DialogHeader>
          
          <div className="py-4">
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
        onCancelPendingShowing={handleCancelPendingShowing}
        pendingShowingAddress={pendingShowingAddress}
      />
    </>
  );
};

export default PropertyRequestWizard;
