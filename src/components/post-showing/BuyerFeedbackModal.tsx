import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, Heart, Calendar, User, FileText, MessageSquare } from "lucide-react";
import { usePostShowingWorkflow, type BuyerFeedback } from "@/hooks/usePostShowingWorkflow";
import { useEnhancedPostShowingActions } from "@/hooks/useEnhancedPostShowingActions";

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
  const [showNotesInput, setShowNotesInput] = useState(false);
  const [favoriteNotes, setFavoriteNotes] = useState("");
  
  const { 
    loading, 
    checkAttendance, 
    submitBuyerFeedback, 
    askFollowUpQuestion 
  } = usePostShowingWorkflow();

  const {
    isSubmitting,
    scheduleAnotherTour,
    hireAgent,
    makeOfferAgentAssisted,
    makeOfferFirstLook,
    favoriteProperty
  } = useEnhancedPostShowingActions();

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

  const handleScheduleAnotherTour = async () => {
    await scheduleAnotherTour(buyerId);
    onClose();
    onComplete?.();
  };

  const handleHireAgent = async () => {
    if (!showing.assigned_agent_id) return;
    
    await hireAgent({
      showingId: showing.id,
      buyerId,
      agentId: showing.assigned_agent_id,
      propertyAddress: showing.property_address,
      agentName: showing.assigned_agent_name
    });
    onClose();
    onComplete?.();
  };

  const handleMakeOffer = async () => {
    if (!showing.assigned_agent_id) {
      // Use FirstLook generator if no agent
      await makeOfferFirstLook({
        showingId: showing.id,
        buyerId,
        propertyAddress: showing.property_address,
        agentName: showing.assigned_agent_name
      });
    } else {
      // Use agent-assisted if agent is available
      await makeOfferAgentAssisted({
        showingId: showing.id,
        buyerId,
        agentId: showing.assigned_agent_id,
        propertyAddress: showing.property_address,
        agentName: showing.assigned_agent_name
      });
    }
    onClose();
    onComplete?.();
  };

  const handleFavoriteProperty = async () => {
    if (showNotesInput) {
      await favoriteProperty({
        showingId: showing.id,
        buyerId,
        propertyAddress: showing.property_address,
        agentName: showing.assigned_agent_name
      }, favoriteNotes);
      
      setShowNotesInput(false);
      setFavoriteNotes("");
      onClose();
      onComplete?.();
    } else {
      setShowNotesInput(true);
    }
  };

  const handleAskQuestion = async () => {
    if (followUpQuestion.trim()) {
      await askFollowUpQuestion(showing.id, followUpQuestion);
      setFollowUpQuestion("");
      onClose();
      onComplete?.();
    }
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
            {step === 'actions' && "What's Next?"}
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
              <h3 className="text-lg font-medium">Thanks for touring {showing.property_address}! Choose your next step:</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Button
                onClick={handleScheduleAnotherTour}
                disabled={isSubmitting}
                variant="outline"
                className="h-auto p-4 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all"
              >
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">Schedule Another Tour</div>
                    <div className="text-xs text-gray-600">Find more properties</div>
                  </div>
                </div>
              </Button>
              
              {showing.assigned_agent_name && (
                <Button
                  onClick={handleHireAgent}
                  disabled={isSubmitting}
                  variant="outline"
                  className="h-auto p-4 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5" />
                    <div className="text-left">
                      <div className="font-semibold text-gray-900">Hire {showing.assigned_agent_name}</div>
                      <div className="text-xs text-gray-600">Work together long-term</div>
                    </div>
                  </div>
                </Button>
              )}
              
              <Button
                onClick={handleMakeOffer}
                disabled={isSubmitting}
                variant="outline"
                className="h-auto p-4 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">Make an Offer</div>
                    <div className="text-xs text-gray-600">Ready to buy this one</div>
                  </div>
                </div>
              </Button>
              
              <Button
                onClick={handleFavoriteProperty}
                disabled={isSubmitting}
                variant="outline"
                className="h-auto p-4 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all"
              >
                <div className="flex items-center gap-3">
                  <Heart className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">Favorite Property</div>
                    <div className="text-xs text-gray-600">Save for later</div>
                  </div>
                </div>
              </Button>
            </div>

            {showNotesInput && (
              <div className="space-y-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <label className="text-sm font-medium text-gray-700">
                  Add a note about what you liked (optional):
                </label>
                <Textarea
                  value={favoriteNotes}
                  onChange={(e) => setFavoriteNotes(e.target.value)}
                  placeholder="Great location, loved the kitchen, needs some updates..."
                  rows={2}
                />
                <div className="flex gap-2">
                  <Button 
                    onClick={handleFavoriteProperty}
                    size="sm"
                    disabled={isSubmitting}
                  >
                    Save to Favorites
                  </Button>
                  <Button 
                    onClick={() => {
                      setShowNotesInput(false);
                      setFavoriteNotes("");
                    }}
                    variant="outline"
                    size="sm"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

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
                  onClick={handleAskQuestion}
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
                onClick={onClose}
                className="text-gray-600 hover:text-gray-800"
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
