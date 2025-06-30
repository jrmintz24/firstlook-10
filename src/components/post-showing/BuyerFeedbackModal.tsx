
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
  const [step, setStep] = useState<'attendance' | 'feedback'>('attendance');
  const [attended, setAttended] = useState<boolean | null>(null);
  const [propertyRating, setPropertyRating] = useState(0);
  const [agentRating, setAgentRating] = useState(0);
  const [propertyComments, setPropertyComments] = useState("");
  const [agentComments, setAgentComments] = useState("");
  
  const { 
    loading, 
    checkAttendance, 
    submitBuyerFeedback
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
      // If didn't attend, skip to completion
      onComplete?.();
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
              <Button variant="outline" onClick={onComplete}>
                Skip Feedback
              </Button>
              <Button onClick={handleFeedbackSubmit} disabled={loading}>
                Submit Feedback
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BuyerFeedbackModal;
