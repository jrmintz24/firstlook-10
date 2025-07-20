
import { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import { useOfferQuestionnaire } from '@/hooks/useOfferQuestionnaire';

// Step components
import AppointmentSchedulingStep from './steps/AppointmentSchedulingStep';
import BuyerQualificationStep from './steps/BuyerQualificationStep';
import PropertyAnalysisStep from './steps/PropertyAnalysisStep';
import OfferTermsStep from './steps/OfferTermsStep';
import FinancingStep from './steps/FinancingStep';
import ContingenciesStep from './steps/ContingenciesStep';
import AdditionalTermsStep from './steps/AdditionalTermsStep';
import AgentSummaryStep from './steps/AgentSummaryStep';

interface OfferQuestionnaireWizardProps {
  isOpen: boolean;
  onClose: () => void;
  offerIntentId: string;
  propertyAddress: string;
  buyerId: string;
  agentId?: string;
}

const OfferQuestionnaireWizard = ({
  isOpen,
  onClose,
  offerIntentId,
  propertyAddress,
  buyerId,
  agentId
}: OfferQuestionnaireWizardProps) => {
  const {
    currentStep,
    steps,
    loading,
    saveStepData,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    generateAgentSummary,
    loadExistingData
  } = useOfferQuestionnaire(offerIntentId);

  useEffect(() => {
    if (isOpen) {
      loadExistingData();
    }
  }, [isOpen, loadExistingData]);

  const currentStepData = steps.find(s => s.stepNumber === currentStep);
  const progress = (steps.filter(s => s.isComplete).length / steps.length) * 100;
  const isLastStep = currentStep === steps.length;
  const allStepsComplete = steps.every(s => s.isComplete);

  const handleStepComplete = async (data: any) => {
    await saveStepData(currentStep, data);
    if (!isLastStep) {
      goToNextStep();
    } else if (allStepsComplete) {
      // Move to summary step
      const summary = await generateAgentSummary();
      if (summary) {
        // Show summary step (step 8)
        goToStep(8);
      }
    }
  };

  const handleSummaryComplete = () => {
    onClose();
  };

  const renderCurrentStep = () => {
    if (!currentStepData && currentStep !== 8) return null;

    const stepProps = {
      data: currentStepData?.data || {},
      onComplete: handleStepComplete,
      loading,
      propertyAddress,
      buyerId
    };

    switch (currentStep) {
      case 1:
        return <AppointmentSchedulingStep {...stepProps} />;
      case 2:
        return <BuyerQualificationStep {...stepProps} />;
      case 3:
        return <PropertyAnalysisStep {...stepProps} />;
      case 4:
        return <OfferTermsStep {...stepProps} />;
      case 5:
        return <FinancingStep {...stepProps} />;
      case 6:
        return <ContingenciesStep {...stepProps} />;
      case 7:
        return <AdditionalTermsStep {...stepProps} />;
      case 8:
        return (
          <AgentSummaryStep
            offerIntentId={offerIntentId}
            onComplete={handleSummaryComplete}
            loading={loading}
          />
        );
      default:
        return null;
    }
  };

  const getStepTitle = () => {
    if (currentStep === 8) return "Agent Summary";
    return currentStepData?.title || "";
  };

  const getStepDescription = () => {
    if (currentStep === 8) return "Your comprehensive offer preparation is complete";
    return currentStepData?.description || "";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            DC/Baltimore Offer Preparation Wizard
          </DialogTitle>
          <p className="text-sm text-gray-600">
            Property: {propertyAddress}
          </p>
        </DialogHeader>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Progress: {Math.round(progress)}% Complete</span>
            <span>Step {currentStep} of {currentStep === 8 ? 8 : steps.length}</span>
          </div>
          <Progress value={currentStep === 8 ? 100 : progress} className="w-full" />
        </div>

        {/* Step navigation */}
        <div className="flex flex-wrap gap-2 py-2 border-b">
          {steps.map((step) => (
            <Button
              key={step.stepNumber}
              variant={currentStep === step.stepNumber ? "default" : "outline"}
              size="sm"
              onClick={() => goToStep(step.stepNumber)}
              className="flex items-center gap-2"
              disabled={loading}
            >
              {step.isComplete && <CheckCircle className="w-3 h-3" />}
              <span className="hidden sm:inline">{step.stepNumber}.</span>
              <span className="truncate max-w-32">{step.title}</span>
            </Button>
          ))}
          {(allStepsComplete || currentStep === 8) && (
            <Button
              variant={currentStep === 8 ? "default" : "outline"}
              size="sm"
              onClick={() => goToStep(8)}
              className="flex items-center gap-2"
              disabled={loading}
            >
              <CheckCircle className="w-3 h-3" />
              <span className="hidden sm:inline">8.</span>
              <span className="truncate max-w-32">Summary</span>
            </Button>
          )}
        </div>

        {/* Current step content */}
        <div className="flex-1 overflow-y-auto py-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">{getStepTitle()}</h3>
              <p className="text-sm text-gray-600">{getStepDescription()}</p>
            </div>
            {renderCurrentStep()}
          </div>
        </div>

        {/* Navigation buttons */}
        {currentStep !== 8 && (
          <div className="flex justify-between items-center pt-4 border-t">
            <Button
              variant="outline"
              onClick={goToPreviousStep}
              disabled={currentStep === 1 || loading}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <div className="flex gap-2">
              {allStepsComplete && currentStep === steps.length && (
                <Button
                  onClick={async () => {
                    await generateAgentSummary();
                    goToStep(8);
                  }}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Generate Summary
                </Button>
              )}
              
              {!isLastStep && (
                <Button
                  onClick={goToNextStep}
                  disabled={loading}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default OfferQuestionnaireWizard;
