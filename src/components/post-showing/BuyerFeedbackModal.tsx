
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { usePostShowingWorkflow, type BuyerFeedback } from "@/hooks/usePostShowingWorkflow";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import BuyerInsightForm from "@/components/property/BuyerInsightForm";

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
  const [specialistRating, setSpecialistRating] = useState(0);
  const [showInsightForm, setShowInsightForm] = useState(false);
  
  const { loading, submitBuyerFeedback } = usePostShowingWorkflow();
  const { toast } = useToast();

  const handleAttendanceSubmit = async () => {
    if (attended === null) return;
    
    try {
      // Update showing attendance
      const { error: attendanceError } = await supabase
        .from('showing_attendance')
        .upsert({
          showing_request_id: showing.id,
          buyer_attended: attended,
          buyer_checked_out: true,
          buyer_checkout_time: new Date().toISOString()
        }, {
          onConflict: 'showing_request_id'
        });

      if (attendanceError) {
        console.error('Error updating attendance:', attendanceError);
      }

      if (attended) {
        // If attended, proceed to feedback
        setStep('feedback');
      } else {
        // If didn't attend, update showing status to completed and close
        await updateShowingToCompleted();
        toast({
          title: "Tour Status Updated",
          description: "Thank you for letting us know you didn't attend.",
        });
        onComplete?.();
      }
    } catch (error) {
      console.error('Error submitting attendance:', error);
      toast({
        title: "Error",
        description: "Failed to submit attendance. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateShowingToCompleted = async () => {
    try {
      const { error } = await supabase
        .from('showing_requests')
        .update({ 
          status: 'completed',
          status_updated_at: new Date().toISOString()
        })
        .eq('id', showing.id);

      if (error) {
        console.error('Error updating showing status:', error);
      }
    } catch (error) {
      console.error('Error updating showing status:', error);
    }
  };

  const handleFeedbackSubmit = async () => {
    console.log('Submitting feedback with buyerId:', buyerId);
    
    if (!buyerId || buyerId.trim() === '') {
      console.error('Invalid buyerId:', buyerId);
      toast({
        title: "Error",
        description: "User information is missing. Please refresh the page and try again.",
        variant: "destructive",
      });
      return;
    }

    if (!showing.assigned_agent_id) {
      console.error('No assigned specialist ID:', showing);
      toast({
        title: "Error",
        description: "Showing specialist information is missing. Please contact support.",
        variant: "destructive",
      });
      return;
    }

    try {
      const feedback: BuyerFeedback = {
        buyer_id: buyerId,
        agent_id: showing.assigned_agent_id,
        property_rating: propertyRating > 0 ? propertyRating : undefined,
        agent_rating: specialistRating > 0 ? specialistRating : undefined,
        property_comments: undefined, // Removed - using insights instead
        agent_comments: undefined     // Removed - using insights instead
      };

      console.log('Submitting feedback:', feedback);
      
      // Submit feedback using the optimized direct database insertion
      await submitBuyerFeedback(showing.id, feedback);
      
      // Update showing status to completed after feedback is submitted
      await updateShowingToCompleted();
      
      toast({
        title: "Ratings Submitted",
        description: "Thank you for your ratings!",
      });
      
      // Show insight form after ratings
      setShowInsightForm(true);
      
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleInsightSuccess = () => {
    setShowInsightForm(false);
    toast({
      title: "Insights Shared!",
      description: "Thank you for helping future buyers!",
    });
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

  const handleSkipFeedback = async () => {
    // Update showing status to completed even if skipping feedback
    await updateShowingToCompleted();
    
    toast({
      title: "Feedback Skipped",
      description: "You can always provide feedback later.",
    });
    onComplete?.();
  };

  const handleSkipInsights = () => {
    setShowInsightForm(false);
    toast({
      title: "Insights Skipped",
      description: "You can always share insights later from your dashboard.",
    });
    onComplete?.();
  };

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
                {loading ? 'Submitting...' : 'Continue'}
              </Button>
            </div>
          </div>
        )}

        {step === 'feedback' && !showInsightForm && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <StarRating
                rating={propertyRating}
                onRatingChange={setPropertyRating}
                label="How would you rate this property?"
              />
              
              {showing.assigned_agent_name && (
                <StarRating
                  rating={specialistRating}
                  onRatingChange={setSpecialistRating}
                  label={`How would you rate ${showing.assigned_agent_name}?`}
                />
              )}
            </div>

            <div className="text-center text-sm text-gray-600">
              <p>After submitting your ratings, you'll be able to share detailed insights to help future buyers.</p>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={handleSkipFeedback} disabled={loading}>
                Skip All
              </Button>
              <Button onClick={handleFeedbackSubmit} disabled={loading}>
                {loading ? 'Submitting...' : 'Continue'}
              </Button>
            </div>
          </div>
        )}

        {step === 'feedback' && showInsightForm && (
          <div className="space-y-4">
            <BuyerInsightForm
              propertyAddress={showing.property_address}
              showingRequestId={showing.id}
              onClose={handleSkipInsights}
              onSuccess={handleInsightSuccess}
              className="border-0 shadow-none"
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BuyerFeedbackModal;
