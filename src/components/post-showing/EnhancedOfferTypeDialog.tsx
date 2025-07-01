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
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <p className="text-gray-600 text-lg">
                How would you like to move forward with
              </p>
              <p className="font-medium text-gray-900 text-lg">
                {propertyAddress}?
              </p>
            </div>

            <div className="space-y-6">
              {/* Make an Offer - Free Option */}
              <Card 
                className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-2 hover:border-gray-300 bg-white"
                onClick={() => handleOfferTypeSelection('make_offer')}
              >
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center">
                          <Zap className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-semibold text-gray-900">
                            Make an Offer
                          </h3>
                          <Badge className="mt-1 bg-green-50 text-green-700 border-green-200 hover:bg-green-50">
                            Included with Membership
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <p className="text-lg font-medium text-gray-900">
                        Confident and ready to go on your own?
                      </p>
                      <p className="text-gray-600">
                        Use our step-by-step offer builder to create a professional, fully compliant contract on your own.
                      </p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-4">
                        <div className="flex items-center gap-3 text-gray-700">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span>Guided questionnaire</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-700">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span>Auto-filled offer documents</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-700">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span>Tailored to local contract standards</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-700">
                          <Clock className="h-5 w-5 text-gray-500" />
                          <span>Takes ~15 minutes</span>
                        </div>
                      </div>
                      
                      <div className="bg-green-50 rounded-2xl p-4">
                        <p className="text-green-800 font-medium text-center">
                          💸 Free with your FirstLook membership
                        </p>
                      </div>
                    </div>
                    
                    <Button className="w-full bg-black hover:bg-gray-800 text-white text-lg py-6 rounded-2xl transition-all duration-200 hover:scale-[1.02]">
                      Start Offer
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Work with Agent - Premium Option */}
              <Card 
                className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-2 hover:border-gray-300 bg-white"
                onClick={() => handleOfferTypeSelection('work_with_agent')}
              >
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center">
                          <Brain className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-semibold text-gray-900">
                            Work with a Licensed Agent
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-2xl font-bold text-gray-900">$699</span>
                            <Badge className="bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-100">
                              Rebate Qualified*
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <p className="text-lg font-medium text-gray-900">
                        Want expert strategy and peace of mind?
                      </p>
                      <p className="text-gray-600">
                        Partner with a top local agent for coaching, pricing advice, and contract review — ideal if you want to maximize leverage or navigate a competitive market.
                      </p>
                      
                      <div className="grid grid-cols-1 gap-3 py-4">
                        <div className="flex items-center gap-3 text-gray-700">
                          <MessageCircle className="h-5 w-5 text-black" />
                          <span>30-minute Strategy Session</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-700">
                          <CheckCircle className="h-5 w-5 text-black" />
                          <span>Pricing + offer guidance</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-700">
                          <FileText className="h-5 w-5 text-black" />
                          <span>Contract review before you submit</span>
                        </div>
                        
                        {/* Expandable coordination details */}
                        <div className="border-t pt-4 mt-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowCoordinationDetails(!showCoordinationDetails);
                            }}
                            className="flex items-center gap-3 text-gray-700 hover:text-gray-900 w-full text-left transition-colors"
                          >
                            {showCoordinationDetails ? (
                              <ChevronUp className="h-5 w-5" />
                            ) : (
                              <ChevronDown className="h-5 w-5" />
                            )}
                            <span className="font-medium">
                              ➕ Add-on: Complete Transaction Coordination ($399)
                            </span>
                          </button>
                          
                          {showCoordinationDetails && (
                            <div className="mt-4 pl-8 space-y-2 text-gray-600 bg-gray-50 rounded-xl p-4">
                              <p className="font-medium text-gray-900">Full transaction support through closing:</p>
                              <ul className="space-y-1 text-sm">
                                <li>• Contract management & deadline tracking</li>
                                <li>• Coordination with title company & lender</li>
                                <li>• Inspection & appraisal scheduling</li>
                                <li>• Closing preparation & document review</li>
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
                        <div className="flex items-center gap-2 text-gray-700">
                          <Clock className="h-4 w-4" />
                          <span className="text-sm">Just 3 minutes to schedule</span>
                        </div>
                        <p className="text-gray-900 font-medium">
                          💰 Offer Coaching/Creation + Optional $399 Transaction Services
                        </p>
                      </div>
                    </div>
                    
                    <Button className="w-full bg-black hover:bg-gray-800 text-white text-lg py-6 rounded-2xl transition-all duration-200 hover:scale-[1.02]">
                      Book Expert Help
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Help Section */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                ❓ Need help choosing?
              </h4>
              <div className="space-y-3 text-gray-700">
                <p>
                  <span className="font-medium">Pick "Make an Offer"</span> if you're comfortable moving fast and want to take control.
                </p>
                <p>
                  <span className="font-medium">Pick "Work with an Agent"</span> if you'd like personalized strategy, support, or help writing a winning offer.
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
            <div className="text-center space-y-6">
              <div className="w-16 h-16 mx-auto bg-blue-50 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-blue-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-semibold text-gray-900">Request Submitted!</h3>
                <p className="text-gray-600 text-lg">
                  We've received your request to work with an agent for {propertyAddress}. Our team will assign a qualified agent and they'll reach out to you within 24 hours.
                </p>
              </div>
              <div className="bg-gray-50 rounded-2xl p-6 text-left">
                <h4 className="font-semibold text-gray-900 mb-3">What's Next:</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• We'll review your information and match you with a qualified agent</li>
                  <li>• The assigned agent will contact you within 24 hours</li>
                  <li>• You'll schedule a consultation to discuss your offer strategy</li>
                  <li>• The agent will guide you through the entire offer process</li>
                </ul>
              </div>
              <Button onClick={onClose} className="w-full bg-black hover:bg-gray-800 text-white py-6 rounded-2xl">
                Got it
              </Button>
            </div>
          );
        } else {
          // Confirmation for direct agent scheduling
          return (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 mx-auto bg-green-50 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-semibold text-gray-900">Consultation Scheduled!</h3>
                <p className="text-gray-600 text-lg">
                  Your consultation with {agentName} has been scheduled. You'll receive a confirmation email with the meeting details.
                </p>
              </div>
              <div className="bg-gray-50 rounded-2xl p-6 text-left">
                <h4 className="font-semibold text-gray-900 mb-3">What's Next:</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• You'll receive a calendar invite</li>
                  <li>• The agent will review your information beforehand</li>
                  <li>• Come prepared with any additional questions</li>
                  <li>• After the call, you can decide on next steps</li>
                </ul>
              </div>
              <Button onClick={onClose} className="w-full bg-black hover:bg-gray-800 text-white py-6 rounded-2xl">
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
        return '🧭 Choose Your Offer Strategy';
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl border-0 shadow-2xl">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-3xl font-semibold text-gray-900 text-center">
            {getStepTitle()}
          </DialogTitle>
        </DialogHeader>
        
        {renderStepContent()}
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedOfferTypeDialog;
