
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
  Zap,
  Brain,
  ChevronDown,
  ChevronUp
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
  const [showCoordinationDetails, setShowCoordinationDetails] = useState(false);
  const { toast } = useToast();

  const handleOfferTypeSelection = async (type: string) => {
    setSelectedOfferType(type);
    
    if (type === 'work_with_agent') {
      // Navigate directly to the offer questionnaire with appointment scheduling first
      const params = new URLSearchParams({
        property: propertyAddress
      });
      
      // Add agent if one is provided
      if (agentId) {
        params.append('agent', agentId);
      }
      
      // Close the modal and navigate to appointment-first workflow
      onClose();
      window.location.href = `/offer-questionnaire?${params.toString()}`;
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
            <div className="text-center space-y-2">
              <p className="text-gray-600">
                How would you like to move forward with
              </p>
              <p className="font-medium text-gray-900">
                {propertyAddress}?
              </p>
            </div>

            <div className="space-y-3">
              {/* Work with Agent - Premium Option */}
              <Card 
                className="cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.01] border border-gray-200 bg-white"
                onClick={() => handleOfferTypeSelection('work_with_agent')}
              >
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                          <Brain className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            Work with a Licensed Agent
                          </h3>
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-gray-900">$699</span>
                            <Badge className="bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-100 text-xs">
                              Rebate Qualified*
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600">
                      Get expert strategy, pricing advice, and contract review from a top local agent.
                    </p>
                    
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-2 text-gray-600">
                        <MessageCircle className="h-3 w-3 text-black" />
                        <span>30-minute Strategy Session</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <CheckCircle className="h-3 w-3 text-black" />
                        <span>Pricing + offer guidance</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <FileText className="h-3 w-3 text-black" />
                        <span>Contract review before you submit</span>
                      </div>
                      
                      {/* Expandable coordination details */}
                      <div className="border-t pt-2 mt-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowCoordinationDetails(!showCoordinationDetails);
                          }}
                          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 w-full text-left transition-colors text-xs"
                        >
                          {showCoordinationDetails ? (
                            <ChevronUp className="h-3 w-3" />
                          ) : (
                            <ChevronDown className="h-3 w-3" />
                          )}
                          <span className="font-medium">
                            Add-on: Complete Transaction Coordination ($399)
                          </span>
                        </button>
                        
                        {showCoordinationDetails && (
                          <div className="mt-2 pl-5 space-y-1 text-gray-600 bg-gray-50 rounded-lg p-2">
                            <p className="font-medium text-gray-900 text-xs">Full transaction support:</p>
                            <ul className="space-y-0.5 text-xs">
                              <li>• Contract management & deadline tracking</li>
                              <li>• Coordination with title company & lender</li>
                              <li>• Inspection & appraisal scheduling</li>
                              <li>• Closing preparation & document review</li>
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => handleOfferTypeSelection('work_with_agent')}
                      className="w-full bg-black hover:bg-gray-800 text-white py-2 rounded-lg transition-all duration-200 hover:scale-[1.02]"
                    >
                      Book Expert Help
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Make an Offer - Coming Soon */}
              <Card 
                className="border border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed"
              >
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-400 rounded-lg flex items-center justify-center">
                          <Zap className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-700">
                            Make an Offer
                          </h3>
                          <Badge className="bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-50 text-xs">
                            Coming Soon
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-500">
                      Create a professional, fully compliant contract using our guided questionnaire.
                    </p>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-2 text-gray-500">
                        <CheckCircle className="h-3 w-3 text-gray-400" />
                        <span>Guided questionnaire</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500">
                        <CheckCircle className="h-3 w-3 text-gray-400" />
                        <span>Auto-filled documents</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500">
                        <CheckCircle className="h-3 w-3 text-gray-400" />
                        <span>Local contract standards</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span>Takes ~15 minutes</span>
                      </div>
                    </div>
                    
                    <Button 
                      disabled 
                      className="w-full bg-gray-300 text-gray-500 py-2 rounded-lg cursor-not-allowed"
                    >
                      Coming Soon
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Help Section */}
            <div className="bg-gray-50 rounded-lg p-3">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2 text-sm">
                <MessageCircle className="h-4 w-4" />
                Need help choosing?
              </h4>
              <div className="space-y-1 text-gray-700 text-xs">
                <p>
                  <span className="font-medium">Work with an Agent:</span> You want personalized strategy and expert support.
                </p>
                <p>
                  <span className="font-medium">Make an Offer:</span> You're comfortable moving fast and want control (coming soon).
                </p>
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
              <div className="w-12 h-12 mx-auto bg-blue-50 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-900">Request Submitted!</h3>
                <p className="text-gray-600">
                  We've received your request for {propertyAddress}. A qualified agent will reach out within 24 hours.
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-left">
                <h4 className="font-semibold text-gray-900 mb-2 text-sm">What's Next:</h4>
                <ul className="space-y-1 text-gray-700 text-xs">
                  <li>• We'll match you with a qualified agent</li>
                  <li>• The agent will contact you within 24 hours</li>
                  <li>• You'll schedule a consultation to discuss strategy</li>
                  <li>• The agent will guide you through the offer process</li>
                </ul>
              </div>
              <Button onClick={onClose} className="w-full bg-black hover:bg-gray-800 text-white py-2 rounded-lg">
                Got it
              </Button>
            </div>
          );
        } else {
          // Confirmation for direct agent scheduling
          return (
            <div className="text-center space-y-4">
              <div className="w-12 h-12 mx-auto bg-green-50 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-900">Consultation Scheduled!</h3>
                <p className="text-gray-600">
                  Your consultation with {agentName} has been scheduled. You'll receive a confirmation email.
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-left">
                <h4 className="font-semibold text-gray-900 mb-2 text-sm">What's Next:</h4>
                <ul className="space-y-1 text-gray-700 text-xs">
                  <li>• You'll receive a calendar invite</li>
                  <li>• The agent will review your information beforehand</li>
                  <li>• Come prepared with any additional questions</li>
                  <li>• After the call, you can decide on next steps</li>
                </ul>
              </div>
              <Button onClick={onClose} className="w-full bg-black hover:bg-gray-800 text-white py-2 rounded-lg">
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
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-white rounded-2xl border-0 shadow-2xl">
        <DialogHeader className="pb-3">
          <DialogTitle className="text-2xl font-semibold text-gray-900 text-center">
            {getStepTitle()}
          </DialogTitle>
        </DialogHeader>
        
        {renderStepContent()}
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedOfferTypeDialog;
