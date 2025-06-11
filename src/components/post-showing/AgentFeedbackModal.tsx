
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Star } from "lucide-react";
import { usePostShowingWorkflow, type AgentFeedback } from "@/hooks/usePostShowingWorkflow";

interface AgentFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  showing: {
    id: string;
    property_address: string;
    user_id?: string;
  };
  agentId: string;
}

const AgentFeedbackModal = ({ isOpen, onClose, showing, agentId }: AgentFeedbackModalProps) => {
  const [attended, setAttended] = useState<boolean | null>(null);
  const [buyerInterestLevel, setBuyerInterestLevel] = useState(0);
  const [buyerSeriousnessRating, setBuyerSeriousnessRating] = useState(0);
  const [notes, setNotes] = useState("");
  const [recommendBuyer, setRecommendBuyer] = useState(true);
  
  const { loading, checkAttendance, submitAgentFeedback } = usePostShowingWorkflow();

  const handleSubmit = async () => {
    if (attended === null) return;

    // Record attendance
    await checkAttendance(showing.id, {
      user_type: 'agent',
      attended,
      checked_out: true
    });

    if (attended && showing.user_id) {
      // Submit feedback if attended
      const feedback: AgentFeedback = {
        agent_id: agentId,
        buyer_id: showing.user_id,
        buyer_interest_level: buyerInterestLevel || undefined,
        buyer_seriousness_rating: buyerSeriousnessRating || undefined,
        notes: notes || undefined,
        recommend_buyer
      };

      await submitAgentFeedback(showing.id, feedback);
    }

    onClose();
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Post-Showing Feedback</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-medium mb-2">How was the showing at:</h3>
            <p className="text-gray-600">{showing.property_address}</p>
          </div>
          
          <div className="flex justify-center gap-4">
            <Button
              variant={attended === true ? "default" : "outline"}
              onClick={() => setAttended(true)}
              className="px-8"
            >
              I attended
            </Button>
            <Button
              variant={attended === false ? "default" : "outline"}
              onClick={() => setAttended(false)}
              className="px-8"
            >
              I didn't attend
            </Button>
          </div>

          {attended && (
            <div className="space-y-6 border-t pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StarRating
                  rating={buyerInterestLevel}
                  onRatingChange={setBuyerInterestLevel}
                  label="Buyer's interest level in this property"
                />
                
                <StarRating
                  rating={buyerSeriousnessRating}
                  onRatingChange={setBuyerSeriousnessRating}
                  label="Buyer's overall seriousness as a client"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Additional notes</label>
                <Textarea
                  placeholder="Notes about the showing, buyer feedback, next steps, etc."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Would you recommend this buyer to other agents?</h4>
                  <p className="text-sm text-gray-600">Based on their seriousness and engagement</p>
                </div>
                <Switch
                  checked={recommendBuyer}
                  onCheckedChange={setRecommendBuyer}
                />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={attended === null || loading}
            >
              Submit Feedback
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AgentFeedbackModal;
