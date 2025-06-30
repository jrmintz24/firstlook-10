
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  User, 
  Clock, 
  CheckCircle, 
  MessageCircle,
  Calendar
} from "lucide-react";
import AgentConsultationQuestionnaire from "../offer-workflow/AgentConsultationQuestionnaire";
import ConsultationScheduler from "../offer-workflow/ConsultationScheduler";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type WorkflowStep = 'selection' | 'consultation_questions' | 'scheduling' | 'confirmation';

interface EnhancedOfferTypeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  propertyAddress: string;
  agentId?: string;
  agentName?: string;
  buyerId?: string;
  showingRequestId?: string;
}

const EnhancedOfferTypeDialog = ({
  isOpen,
  onClose,
  propertyAddress,
  agentId,
  agentName,
  buyerId,
  showingRequestId
}: EnhancedOfferTypeDialogProps) => {
  const [currentStep, setCurrentStep] = useState<WorkflowStep>('selection');
  const [selectedOfferType, setSelectedOfferType] = useState<string | null>(null);
  const [consultationData, setConsultationData] = useState<any>(null);
  const [offerIntentId, setOfferIntentId] = useState<string | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleOfferTypeSelection = async (type: string) => {
    setSelectedOfferType(type);
    
    if (type === 'work_with_agent') {
      setCurrentStep('consultation_questions');
    } else {
      // For "make_offer", redirect to full questionnaire (existing flow)
      window.location.href = `/offer-questionnaire?property=${encodeURIComponent(propertyAddress)}&agent=${agentId}`;
    }
  };

  const handleConsultationComplete = async (data: any) => {
    if (!agentId || !buyerId) {
      toast({
        title: "Error",
        description: "Missing agent or buyer information",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Create offer intent record
      const { data: offerIntent, error } = await supabase
        .from('offer_intents')
        .insert({
          buyer_id: buyerId,
          agent_id: agentId,
          showing_request_id: showingRequestId,
          property_address: propertyAddress,
          offer_type: 'work_with_agent',
          consultation_type: 'property_specific',
          buyer_qualification: {
            propertyInterestLevel: data.propertyInterestLevel,
            preApprovalStatus: data.preApprovalStatus,
            budgetRange: data.budgetRange,
            timeline: data.timeline,
            specificQuestions: data.specificQuestions,
            ongoingRepresentation: data.ongoingRepresentation,
            additionalComments: data.additionalComments,
            preferredCommunication: data.preferredCommunication,
            availabilityPreference: data.availabilityPreference
          }
        })
        .select()
        .single();

      if (error) throw error;

      setOfferIntentId(offerIntent.id);
      setConsultationData(data);
      setCurrentStep('scheduling');
    } catch (error) {
      console.error('Error creating offer intent:', error);
      toast({
        title: "Error",
        description: "Failed to save consultation information",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSchedulingComplete = (bookingId: string) => {
    setBookingId(bookingId);
    setCurrentStep('confirmation');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'selection':
        return (
          <div className="space-y-4">
            <p className="text-gray-600 mb-6">
              How would you like to proceed with {propertyAddress}?
            </p>

            <div className="space-y-3">
              <Card 
                className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-blue-200"
                onClick={() => handleOfferTypeSelection('make_offer')}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <FileText className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">Make an Offer</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Ready to make an offer? Complete our detailed questionnaire and we'll help prepare your offer documents.
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="secondary" className="text-xs">Full questionnaire</Badge>
                        <Badge variant="secondary" className="text-xs">Contract preparation</Badge>
                        <Badge variant="secondary" className="text-xs">~15 minutes</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card 
                className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-blue-200"
                onClick={() => handleOfferTypeSelection('work_with_agent')}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">Work with Agent</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Want guidance? Schedule a consultation to discuss this property and get expert advice on your offer strategy.
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="secondary" className="text-xs">30-min consultation</Badge>
                        <Badge variant="secondary" className="text-xs">Expert guidance</Badge>
                        <Badge variant="secondary" className="text-xs">~3 minutes setup</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'consultation_questions':
        return (
          <AgentConsultationQuestionnaire
            propertyAddress={propertyAddress}
            onComplete={handleConsultationComplete}
            onBack={() => setCurrentStep('selection')}
            isSubmitting={loading}
          />
        );

      case 'scheduling':
        return offerIntentId && agentId && agentName && buyerId ? (
          <ConsultationScheduler
            agentId={agentId}
            agentName={agentName}
            offerIntentId={offerIntentId}
            buyerId={buyerId}
            onScheduled={handleSchedulingComplete}
            onBack={() => setCurrentStep('consultation_questions')}
          />
        ) : null;

      case 'confirmation':
        return (
          <div className="text-center space-y-4">
            <div className="p-4 bg-green-100 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold">Consultation Scheduled!</h3>
            <p className="text-gray-600">
              Your consultation with {agentName} has been scheduled. You'll receive a confirmation email with the meeting details.
            </p>
            <div className="p-4 bg-gray-50 rounded-lg text-left">
              <h4 className="font-medium mb-2">What's Next:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• You'll receive a calendar invite</li>
                <li>• The agent will review your information beforehand</li>
                <li>• Come prepared with any additional questions</li>
                <li>• After the call, you can decide on next steps</li>
              </ul>
            </div>
            <Button onClick={onClose} className="w-full">
              Got it
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 'selection':
        return 'Choose Your Next Step';
      case 'consultation_questions':
        return 'Agent Consultation Setup';
      case 'scheduling':
        return 'Schedule Your Consultation';
      case 'confirmation':
        return 'All Set!';
      default:
        return '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {currentStep === 'selection' && <MessageCircle className="h-5 w-5" />}
            {currentStep === 'consultation_questions' && <User className="h-5 w-5" />}
            {currentStep === 'scheduling' && <Calendar className="h-5 w-5" />}
            {currentStep === 'confirmation' && <CheckCircle className="h-5 w-5" />}
            {getStepTitle()}
          </DialogTitle>
        </DialogHeader>
        
        {renderStepContent()}
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedOfferTypeDialog;
