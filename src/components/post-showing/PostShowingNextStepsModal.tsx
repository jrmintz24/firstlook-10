
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X, MessageSquare } from "lucide-react";
import PostShowingActionsPanel from "./PostShowingActionsPanel";

interface PostShowingNextStepsModalProps {
  isOpen: boolean;
  onClose: () => void;
  showing: {
    id: string;
    property_address: string;
    assigned_agent_name?: string;
    assigned_agent_id?: string;
    assigned_agent_email?: string;
    assigned_agent_phone?: string;
  };
  buyerId: string;
}

const PostShowingNextStepsModal = ({
  isOpen,
  onClose,
  showing,
  buyerId
}: PostShowingNextStepsModalProps) => {
  const [question, setQuestion] = useState("");
  const [showQuestionForm, setShowQuestionForm] = useState(false);

  const handleSubmitQuestion = async () => {
    if (!question.trim()) return;

    try {
      // Submit the question to the follow_up_questions table
      const { supabase } = await import("@/integrations/supabase/client");
      
      await supabase
        .from('follow_up_questions')
        .insert({
          showing_request_id: showing.id,
          buyer_id: buyerId,
          question: question.trim()
        });

      setQuestion("");
      setShowQuestionForm(false);
      
      // Show success message or toast
      console.log('Question submitted successfully');
    } catch (error) {
      console.error('Error submitting question:', error);
    }
  };

  const handleActionCompleted = (actionType: string) => {
    console.log('Action completed:', actionType);
    // Could show a success message or update UI
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="relative">
          <DialogTitle className="text-xl font-bold text-center pr-8">
            What's Next?
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute right-0 top-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-6">
          {/* Thank you message */}
          <div className="text-center">
            <p className="text-lg font-medium">
              Thanks for touring {showing.property_address}! Choose your next step:
            </p>
          </div>

          {/* Post-showing actions panel */}
          <PostShowingActionsPanel
            showingId={showing.id}
            buyerId={buyerId}
            agentId={showing.assigned_agent_id}
            agentName={showing.assigned_agent_name}
            agentEmail={showing.assigned_agent_email}
            agentPhone={showing.assigned_agent_phone}
            propertyAddress={showing.property_address}
            onActionCompleted={handleActionCompleted}
          />

          {/* Question for agent section */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Have a question for your agent?
            </h3>
            
            {!showQuestionForm ? (
              <Button 
                variant="outline" 
                onClick={() => setShowQuestionForm(true)}
                className="w-full"
              >
                Ask about the property, neighborhood, next steps...
              </Button>
            ) : (
              <div className="space-y-3">
                <Textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ask about the property, neighborhood, next steps..."
                  rows={3}
                  className="resize-none"
                />
                <div className="flex gap-2 justify-end">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowQuestionForm(false);
                      setQuestion("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSubmitQuestion} disabled={!question.trim()}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Send Question
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* I'll decide later button */}
          <div className="text-center border-t pt-4">
            <Button variant="ghost" onClick={onClose} className="text-gray-600">
              I'll decide later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostShowingNextStepsModal;
