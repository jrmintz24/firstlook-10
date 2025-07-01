
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
  Calendar,
  Zap
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
    } else if (type === 'make_offer') {
      // Navigate to the comprehensive offer questionnaire
      const params = new URLSearchParams({
        property: propertyAddress
      });
      
      // Only add agent if one is provided
      if (agentId) {
        params.append('agent', agentId);
      }
      
      // Close the modal and navigate
      onClose();
      window.location.href = `/offer-questionnaire?${params.toString()}`;
    }
  };

  const handleConsultationComplete = async (data: any) => {
    if (!buyerId) {
      toast({
        title: "Error",
        description: "Buyer information is required",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Create offer intent record - use system agent ID or buyerId if no agent assigned
      const effectiveAgentId = agentId || buyerId; // Use buyer as placeholder if no agent
      
      const { data: offerIntent, error } = await supabase
        .from('offer_intents')
        .insert({
          buyer_id: buyerId,
          agent_id: effectiveAgentId,
          showing_request_id: showingRequestId,
          property_address: propertyAddress,
          offer_type: agentId ? 'work_with_agent' : 'admin_assign_agent',
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
            availabilityPreference: data.availabilityPreference,
            needsAgentAssignment: !agentId // Flag for admin to know agent assignment is needed
          }
        })
        .select()
        .single();

      if (error) throw error;

      setOfferIntentId(offerIntent.id);
      setConsultationData(data);
      
      // If no agent assigned, show confirmation that admin will assign
      if (!agentId) {
        setCurrentStep('confirmation');
      } else {
        setCurrentStep('scheduling');
      }
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
                className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-green-200 bg-gradient-to-r from-green-50 to-emerald-50"
                onClick={() => handleOfferTypeSelection('make_offer')}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Zap className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        Make an Offer
                        <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">Self-Service</Badge>
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Ready to make an offer? Use our comprehensive DC/Baltimore offer questionnaire to create compliant contract documents.
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="outline" className="text-xs border-green-200">GCAAR/MAR Forms</Badge>
                        <Badge variant="outline" className="text-xs border-green-200">Contract Generation</Badge>
                        <Badge variant="outline" className="text-xs border-green-200">~15 minutes</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Always show agent option - either with specific agent or admin assignment */}
              <Card 
                className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50"
                onClick={() => handleOfferTypeSelection('work_with_agent')}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        {agentName ? `Work with ${agentName}` : 'Work with Agent'}
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                          {agentName ? 'Guided' : 'Agent Assignment'}
                        </Badge>
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {agentName 
                          ? 'Want expert guidance? Schedule a consultation to discuss this property and develop your offer strategy together.'
                          : 'Want expert guidance? We\'ll connect you with a qualified agent to discuss this property and develop your offer strategy.'
                        }
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="outline" className="text-xs border-blue-200">30-min consultation</Badge>
                        <Badge variant="outline" className="text-xs border-blue-200">Expert strategy</Badge>
                        <Badge variant="outline" className="text-xs border-blue-200">~3 minutes setup</Badge>
                        {!agentName && (
                          <Badge variant="outline" className="text-xs border-orange-200">Agent will be assigned</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Which path is right for you?</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Choose "Make an Offer"</strong> if you're ready to submit an offer and want to handle the process yourself.</p>
                <p><strong>Choose "Work with Agent"</strong> if you want professional guidance on strategy, pricing, or contract terms{!agentName && ' - we\'ll assign you a qualified agent'}.</p>
              </div>
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
        if (!agentId) {
          // Confirmation for admin assignment case
          return (
            <div className="text-center space-y-4">
              <div className="p-4 bg-blue-100 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold">Request Submitted!</h3>
              <p className="text-gray-600">
                We've received your request to work with an agent for {propertyAddress}. Our team will assign a qualified agent and they'll reach out to you within 24 hours.
              </p>
              <div className="p-4 bg-gray-50 rounded-lg text-left">
                <h4 className="font-medium mb-2">What's Next:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• We'll review your information and match you with a qualified agent</li>
                  <li>• The assigned agent will contact you within 24 hours</li>
                  <li>• You'll schedule a consultation to discuss your offer strategy</li>
                  <li>• The agent will guide you through the entire offer process</li>
                </ul>
              </div>
              <Button onClick={onClose} className="w-full">
                Got it
              </Button>
            </div>
          );
        } else {
          // Confirmation for direct agent scheduling
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
        }

      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 'selection':
        return 'Choose Your Offer Strategy';
      case 'consultation_questions':
        return 'Agent Consultation Setup';
      case 'scheduling':
        return 'Schedule Your Consultation';
      case 'confirmation':
        return !agentId ? 'Request Submitted!' : 'All Set!';
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
