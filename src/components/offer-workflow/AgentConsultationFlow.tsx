
import { useState } from "react";
import AgentConsultationQuestionnaire from "./AgentConsultationQuestionnaire";
import AgentConsultationScheduler from "./AgentConsultationScheduler";

interface AgentConsultationData {
  offerReadiness: string;
  offerPrice: string;
  preApprovalStatus: string;
  closingTimeline: string;
  contingencies: string[];
  otherContingency: string;
  callType: string;
  additionalContext: string;
}

interface AgentConsultationFlowProps {
  propertyAddress: string;
  onComplete: (data: { consultationData: AgentConsultationData; bookingId: string }) => void;
  onBack: () => void;
  isSubmitting?: boolean;
}

const AgentConsultationFlow = ({
  propertyAddress,
  onComplete,
  onBack,
  isSubmitting = false
}: AgentConsultationFlowProps) => {
  const [currentStep, setCurrentStep] = useState<'questionnaire' | 'scheduling'>('questionnaire');
  const [consultationData, setConsultationData] = useState<AgentConsultationData | null>(null);

  const handleQuestionnaireComplete = (data: AgentConsultationData) => {
    setConsultationData(data);
    setCurrentStep('scheduling');
  };

  const handleSchedulingComplete = (bookingId: string) => {
    if (consultationData) {
      onComplete({ consultationData, bookingId });
    }
  };

  const handleBackToQuestionnaire = () => {
    setCurrentStep('questionnaire');
  };

  if (currentStep === 'questionnaire') {
    return (
      <AgentConsultationQuestionnaire
        propertyAddress={propertyAddress}
        onComplete={handleQuestionnaireComplete}
        onBack={onBack}
        isSubmitting={isSubmitting}
      />
    );
  }

  return (
    <AgentConsultationScheduler
      propertyAddress={propertyAddress}
      consultationType={consultationData?.callType as 'phone' | 'video' || 'phone'}
      onScheduled={handleSchedulingComplete}
      onBack={handleBackToQuestionnaire}
    />
  );
};

export default AgentConsultationFlow;
