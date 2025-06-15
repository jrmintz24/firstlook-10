
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, Heart, Calendar, User, FileText, MessageSquare, Home } from "lucide-react";
import { usePostShowingWorkflow, type BuyerFeedback } from "@/hooks/usePostShowingWorkflow";

interface BuyerFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
  showing: {
    id: string;
    property_address: string;
    assigned_agent_name?: string;
    assigned_agent_id?: string;
  };
  buyerId: string;
}

const BuyerFeedbackModal = ({ isOpen, onClose, onComplete, showing, buyerId }: BuyerFeedbackModalProps) => {
  const [step, setStep] = useState<'attendance' | 'feedback' | 'actions'>('attendance');
  const [attended, setAttended] = useState<boolean | null>(null);
  const [propertyRating, setPropertyRating] = useState(0);
  const [agentRating, setAgentRating] = useState(0);
  const [propertyComments, setPropertyComments] = useState("");
  const [agentComments, setAgentComments] = useState("");
  const [followUpQuestion, setFollowUpQuestion] = useState("");
  
  const { 
    loading, 
    checkAttendance, 
    submitBuyerFeedback, 
    recordAction, 
    favoriteProperty, 
    askFollowUpQuestion 
  } = usePostShowingWorkflow();

  const handleAttendanceSubmit = async () => {
    if (attended === null) return;
    
    await checkAttendance(showing.id, {
      user_type: 'buyer',
      attended,
      checked_out: true
    });
    
    if (attended) {
      setStep('feedback');
    } else {
      // If didn't attend, skip to actions for rescheduling
      setStep('actions');
    }
  };

  const handleFeedbackSubmit = async () => {
    const feedback: BuyerFeedback = {
      buyer_id: buyerId,
      agent_id: showing.assigned_agent_id || "",
      property_rating: propertyRating || undefined,
      agent_rating: agentRating || undefined,
      property_comments: propertyComments || undefined,
      agent_comments: agentComments || undefined
    };

    await submitBuyerFeedback(showing.id, feedback);
    setStep('actions');
  };

  const handleAction = async (actionType: string, details?: any) => {
    await recordAction(showing.id, {
      buyer_id: buyerId,
      action_type: actionType as any,
      action_details: details
    });

    // Handle specific actions
    if (actionType === 'favorite_property') {
      await favoriteProperty(showing.property_address, showing.id);
    } else if (actionType === 'ask_question' && followUpQuestion.trim()) {
      await askFollowUpQuestion(showing.id, followUpQuestion);
    }

    onClose();
    onComplete?.();
  };

  const StarRating = ({ rating, onRatingChange, label }: { rating: number, onRatingChange: (rating: number) => void, label: string }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-6 w-6 cursor-pointer transition-colors ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
            onClick={() => onRatingChange(star)}
          />
        ))}
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {step === 'attendance' && 'How was your showing?'}
            {step === 'feedback' && 'Share your feedback'}
            {step === 'actions' && 'What would you like to do next?'}
          </DialogTitle>
        </DialogHeader>

        {step === 'attendance' && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">Did you attend the showing at:</h3>
              <p className="text-gray-600">{showing.property_address}</p>
            </div>
            
            <div className="flex justify-center gap-4">
              <Button
                variant={attended === true ? "default" : "outline"}
                onClick={() => setAttended(true)}
                className="px-8"
              >
                Yes, I attended
              </Button>
              <Button
                variant={attended === false ? "default" : "outline"}
                onClick={() => setAttended(false)}
                className="px-8"
              >
                No, I didn't attend
              </Button>
            </div>

            <div className="flex justify-end">
              <Button 
                onClick={handleAttendanceSubmit} 
                disabled={attended === null || loading}
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === 'feedback' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <StarRating
                rating={propertyRating}
                onRatingChange={setPropertyRating}
                label="How would you rate this property?"
              />
              
              {showing.assigned_agent_name && (
                <StarRating
                  rating={agentRating}
                  onRatingChange={setAgentRating}
                  label={`How would you rate ${showing.assigned_agent_name}?`}
                />
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Property feedback (optional)</label>
                <Textarea
                  placeholder="What did you think about the property? Any specific likes or concerns?"
                  value={propertyComments}
                  onChange={(e) => setPropertyComments(e.target.value)}
                  rows={3}
                />
              </div>

              {showing.assigned_agent_name && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Agent feedback (optional)</label>
                  <Textarea
                    placeholder={`How was your experience with ${showing.assigned_agent_name}?`}
                    value={agentComments}
                    onChange={(e) => setAgentComments(e.target.value)}
                    rows={3}
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setStep('actions')}>
                Skip Feedback
              </Button>
              <Button onClick={handleFeedbackSubmit} disabled={loading}>
                Submit Feedback
              </Button>
            </div>
          </div>
        )}

        {step === 'actions' && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-medium">What would you like to do next?</h3>
              <p className="text-gray-600">Choose any actions that interest you</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col gap-2"
                onClick={() => handleAction('schedule_same_agent')}
              >
                <Calendar className="h-6 w-6" />
                <span className="font-medium">Schedule Another Showing</span>
                <span className="text-sm text-gray-600">With {showing.assigned_agent_name}</span>
              </Button>

              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col gap-2"
                onClick={() => handleAction('schedule_different_agent')}
              >
                <User className="h-6 w-6" />
                <span className="font-medium">Try Different Agent</span>
                <span className="text-sm text-gray-600">Schedule with someone new</span>
              </Button>

              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col gap-2"
                onClick={() => handleAction('work_with_agent')}
              >
                <Home className="h-6 w-6" />
                <span className="font-medium">Work with This Agent</span>
                <span className="text-sm text-gray-600">Start your home search together</span>
              </Button>

              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col gap-2"
                onClick={() => handleAction('request_offer_assistance')}
              >
                <FileText className="h-6 w-6" />
                <span className="font-medium">Get Offer Help</span>
                <span className="text-sm text-gray-600">FirstLook offer assistance</span>
              </Button>

              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col gap-2"
                onClick={() => handleAction('favorite_property')}
              >
                <Heart className="h-6 w-6" />
                <span className="font-medium">Favorite Property</span>
                <span className="text-sm text-gray-600">Save for later</span>
              </Button>

              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col gap-2"
                onClick={() => handleAction('request_disclosures')}
              >
                <FileText className="h-6 w-6" />
                <span className="font-medium">Request Documents</span>
                <span className="text-sm text-gray-600">Disclosures & property docs</span>
              </Button>
            </div>

            <div className="border-t pt-4">
              <label className="text-sm font-medium mb-2 block">Have a question for your agent?</label>
              <div className="flex gap-2">
                <Textarea
                  placeholder="Ask about the property, neighborhood, next steps..."
                  value={followUpQuestion}
                  onChange={(e) => setFollowUpQuestion(e.target.value)}
                  rows={2}
                  className="flex-1"
                />
                <Button
                  onClick={() => handleAction('ask_question', { question: followUpQuestion })}
                  disabled={!followUpQuestion.trim() || loading}
                  className="self-end"
                >
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                variant="ghost"
                onClick={() => handleAction('no_action')}
                className="text-gray-600"
              >
                I'll decide later
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BuyerFeedbackModal;
