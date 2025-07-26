
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { usePostShowingWorkflow, type BuyerFeedback } from "@/hooks/usePostShowingWorkflow";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import CombinedFeedbackForm from "./CombinedFeedbackForm";

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

  const handleCombinedSubmit = async (data: {
    propertyRating: number;
    agentRating: number;
    insightData?: {
      insightText: string;
      category: string;
      buyerName: string;
    };
  }) => {
    console.log('Submitting combined feedback with buyerId:', buyerId);
    
    if (!buyerId || buyerId.trim() === '') {
      console.error('Invalid buyerId:', buyerId);
      toast({
        title: "Error",
        description: "User information is missing. Please refresh the page and try again.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Submit star ratings if agent is assigned
      if (showing.assigned_agent_id) {
        const feedback: BuyerFeedback = {
          buyer_id: buyerId,
          agent_id: showing.assigned_agent_id,
          property_rating: data.propertyRating > 0 ? data.propertyRating : undefined,
          agent_rating: data.agentRating > 0 ? data.agentRating : undefined,
          property_comments: undefined,
          agent_comments: undefined
        };

        console.log('Submitting star ratings:', feedback);
        await submitBuyerFeedback(showing.id, feedback);
      }

      // Submit buyer insight if provided
      if (data.insightData) {
        console.log('Submitting buyer insight:', data.insightData);
        const { error: insertError } = await supabase
          .from('buyer_insights')
          .insert({
            property_address: showing.property_address,
            insight_text: data.insightData.insightText.trim(),
            category: data.insightData.category,
            buyer_name: data.insightData.buyerName.trim(),
            buyer_id: buyerId,
            showing_request_id: showing.id,
            tour_date: new Date().toISOString().split('T')[0],
            is_approved: false
          });

        if (insertError) {
          throw insertError;
        }
      }
      
      // Update showing status to completed
      await updateShowingToCompleted();
      
      toast({
        title: "Thank you!",
        description: data.insightData ? "Your ratings and insights have been submitted!" : "Your ratings have been submitted!",
      });
      
      onComplete?.();
      
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
    }
  };


  const handleSkipAll = async () => {
    await updateShowingToCompleted();
    toast({
      title: "Feedback Skipped",
      description: "You can always provide feedback later.",
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

        {step === 'feedback' && (
          <CombinedFeedbackForm
            propertyAddress={showing.property_address}
            showingRequestId={showing.id}
            agentName={showing.assigned_agent_name}
            onSubmit={handleCombinedSubmit}
            onSkip={handleSkipAll}
            loading={loading}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BuyerFeedbackModal;
