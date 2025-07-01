
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { usePropertyRequest } from "@/hooks/usePropertyRequest";
import PropertySelectionStep from "@/components/property-request/PropertySelectionStep";
import SchedulingStep from "@/components/property-request/SchedulingStep";
import SummaryStep from "@/components/property-request/SummaryStep";
import StreamlinedSignupModal from "@/components/property-request/StreamlinedSignupModal";
import FreeShowingLimitModal from "@/components/showing-limits/FreeShowingLimitModal";

interface PropertyRequestFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const PropertyRequestForm = ({ isOpen, onClose }: PropertyRequestFormProps) => {
  const {
    step,
    formData,
    showAuthModal,
    setShowAuthModal,
    showFreeShowingLimitModal,
    setShowFreeShowingLimitModal,
    pendingShowingAddress,
    isSubmitting,
    eligibility,
    handleInputChange,
    handleNext,
    handleBack,
    handleAddProperty,
    handleRemoveProperty,
    handleContinueToSubscriptions,
    handleCancelPendingShowing,
  } = usePropertyRequest();

  const handleSignupSuccess = () => {
    console.log('PropertyRequestForm: Signup successful, processing tour request');
    setShowAuthModal(false);
    handleContinueToSubscriptions();
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
            onContinueToSubscriptions={handleContinueToSubscriptions}
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
      <Dialog open={isOpen} onOpenChange={onClose}>
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

      {/* Streamlined Signup Modal */}
      {showAuthModal && (
        <StreamlinedSignupModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleSignupSuccess}
        />
      )}

      {/* Free Showing Limit Modal */}
      {showFreeShowingLimitModal && (
        <FreeShowingLimitModal
          isOpen={showFreeShowingLimitModal}
          onClose={() => setShowFreeShowingLimitModal(false)}
          onCancelPendingShowing={handleCancelPendingShowing}
          pendingShowingAddress={pendingShowingAddress}
          activeShowingCount={eligibility?.active_showing_count}
        />
      )}
    </>
  );
};

export default PropertyRequestForm;
