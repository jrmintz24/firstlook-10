
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
          <div className="space-y-6">
            <p className="text-gray-600 mb-6">
              How would you like to proceed with {propertyAddress}?
            </p>

            <div className="space-y-4">
              {/* Make an Offer - Free with Membership */}
              <Card 
                className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-green-300 bg-gradient-to-r from-green-50 to-emerald-50"
                onClick={() => handleOfferTypeSelection('make_offer')}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <Zap className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">
                          ⚡ Make an Offer
                        </h3>
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          Free with Membership
                        </Badge>
                      </div>
                      
                      <p className="text-gray-700 font-medium mb-2">
                        Confident and ready to go?
                      </p>
                      <p className="text-gray-600 text-sm mb-4">
                        Use our guided offer builder to generate professional, compliant contracts — no agent required.
                      </p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Step-by-step questionnaire</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Auto-filled contract docs</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Designed for DC/Baltimore standards</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span>~15 minutes</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm font-medium text-green-700">
                          <span>💰 Free with your FirstLook membership</span>
                        </div>
                      </div>
                      
                      <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                        Start Offer
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Work with a Licensed Agent */}
              <Card 
                className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-purple-300 bg-gradient-to-r from-purple-50 to-indigo-50"
                onClick={() => handleOfferTypeSelection('work_with_agent')}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <Brain className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">
                          🧠 Work with a Licensed Agent
                        </h3>
                        <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                          Best for confident buyers
                        </Badge>
                      </div>
                      
                      <p className="text-lg font-medium text-purple-700 mb-2">
                        $699 + optional $399
                      </p>
                      
                      <p className="text-gray-700 font-medium mb-2">
                        Want expert guidance?
                      </p>
                      <p className="text-gray-600 text-sm mb-4">
                        Get coaching from a top local agent to develop your strategy, evaluate pricing, and write a winning offer.
                      </p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <User className="h-4 w-4 text-purple-600" />
                          <span>30-min Strategy Consultation</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <CheckCircle className="h-4 w-4 text-purple-600" />
                          <span>Pricing advice & offer coaching</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <FileText className="h-4 w-4 text-purple-600" />
                          <span>Offer document review</span>
                        </div>
                        
                        {/* Expandable coordination details */}
                        <div className="border-t pt-2 mt-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowCoordinationDetails(!showCoordinationDetails);
                            }}
                            className="flex items-center gap-2 text-sm text-purple-700 hover:text-purple-800 w-full text-left"
                          >
                            {showCoordinationDetails ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                            <span className="font-medium">
                              ➕ Add transaction coordination for $399
                            </span>
                            <Badge variant="outline" className="ml-auto text-xs">
                              Optional Add-On Available
                            </Badge>
                          </button>
                          
                          {showCoordinationDetails && (
                            <div className="mt-2 pl-6 space-y-1 text-sm text-gray-600">
                              <p>We'll manage paperwork, deadlines, and follow-through</p>
                              <ul className="list-disc list-inside space-y-1 ml-2">
                                <li>Contract management & deadline tracking</li>
                                <li>Coordination with title company & lender</li>
                                <li>Inspection & appraisal scheduling</li>
                                <li>Closing preparation & document review</li>
                              </ul>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-700 pt-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span>~3 minutes to schedule</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm font-medium text-purple-700">
                          <span>💰 $699 coaching | + $399 optional add-on</span>
                        </div>
                      </div>
                      
                      <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                        Book Expert Help
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Help Section */}
            <div className="mt-8 p-6 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                ❓ Which path is right for you?
              </h4>
              <div className="text-sm text-gray-700 space-y-2">
                <p>
                  <strong>Choose "Make an Offer"</strong> if you're confident writing an offer and want to move quickly.
                </p>
                <p>
                  <strong>Choose "Work with Agent"</strong> if you want pricing guidance, offer review, or full support from contract to close.
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
