
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { usePropertyRequest } from "@/hooks/usePropertyRequest";
import PropertySelectionStep from "@/components/property-request/PropertySelectionStep";
import SchedulingStep from "@/components/property-request/SchedulingStep";
import SummaryStep from "@/components/property-request/SummaryStep";
import QuickSignInModal from "@/components/property-request/QuickSignInModal";

interface PropertyRequestFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void; // Add callback for successful submission
}

const PropertyRequestForm = ({ isOpen, onClose, onSuccess }: PropertyRequestFormProps) => {
  const {
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
  } = usePropertyRequest();

  const handleClose = () => {
    onClose();
    // Call onSuccess callback if provided to refresh parent data
    if (onSuccess) {
      onSuccess();
    }
  };

  const handleSuccessfulSubmission = async () => {
    await handleContinueToSubscriptions();
    // Close the form and trigger refresh after successful submission
    handleClose();
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <PropertySelectionStep
            formData={formData}
            onInputChange={handleInputChange}
            onAddProperty={handleAddProperty}
            onRemoveProperty={handleRemoveProperty}
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
            onContinueToSubscriptions={handleSuccessfulSubmission}
            onBack={handleBack}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              🏠 Request Your Tour
            </DialogTitle>
            <DialogDescription>
              Step {step} of 3 - Let's get you set up for your tour session
            </DialogDescription>
          </DialogHeader>

          {renderStepContent()}
        </DialogContent>
      </Dialog>

      {/* Quick Sign-In Modal */}
      {showAuthModal && (
        <QuickSignInModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleSuccessfulSubmission}
        />
      )}
    </>
  );
};

export default PropertyRequestForm;
