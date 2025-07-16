
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { usePropertyRequest } from "@/hooks/usePropertyRequest";
import PropertySelectionStep from "@/components/property-request/PropertySelectionStep";
import SchedulingStep from "@/components/property-request/SchedulingStep";
import SummaryStep from "@/components/property-request/SummaryStep";
import QuickSignInModal from "@/components/property-request/QuickSignInModal";
import FreeShowingLimitModal from "@/components/showing-limits/FreeShowingLimitModal";
import { PropertyEntry } from "@/types/propertyRequest";

interface PropertyRequestWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => Promise<void>;
  skipNavigation?: boolean;
  initialProperties?: PropertyEntry[];
}

const PropertyRequestWizard = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  skipNavigation = true,
  initialProperties = []
}: PropertyRequestWizardProps) => {
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
  } = usePropertyRequest(onClose, onSuccess, skipNavigation);

  // Initialize form with initial properties when modal opens
  React.useEffect(() => {
    if (isOpen && initialProperties.length > 0) {
      console.log('[PropertyRequestWizard] Setting initial properties:', initialProperties);
      // Set the first property as the main address for backward compatibility
      if (initialProperties[0]?.address) {
        handleInputChange('propertyAddress', initialProperties[0].address);
      }
    }
  }, [isOpen, initialProperties]);

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
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] bg-white border border-gray-200 shadow-xl">
          <DialogHeader className="border-b border-gray-100 pb-4">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-semibold text-gray-900">
                {getStepTitle()}
              </DialogTitle>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className={`w-6 h-1.5 rounded-full transition-colors ${
                      step <= currentStep ? 'bg-black' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          </DialogHeader>
          
          <div className="py-6">
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
