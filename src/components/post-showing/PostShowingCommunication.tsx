
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Calendar, Heart, UserPlus, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PostShowingCommunicationProps {
  showingId: string;
  userType: 'buyer' | 'agent';
  showingStatus: string;
  agentName?: string;
  propertyAddress: string;
  onActionTaken?: () => void;
}

const PostShowingCommunication = ({
  showingId,
  userType,
  showingStatus,
  agentName,
  propertyAddress,
  onActionTaken
}: PostShowingCommunicationProps) => {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleAction = async (actionType: string, details?: any) => {
    if (!supabase.auth.getUser()) return;

    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase.functions.invoke('post-showing-workflow', {
        body: {
          action: 'record_action',
          showing_request_id: showingId,
          buyer_id: user?.id,
          action_type: actionType,
          action_details: details || {}
        }
      });

      if (error) throw error;

      toast({
        title: "Action Recorded",
        description: getActionSuccessMessage(actionType),
      });

      if (onActionTaken) onActionTaken();
    } catch (error) {
      console.error('Error recording action:', error);
      toast({
        title: "Error",
        description: "Failed to record your action. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getActionSuccessMessage = (actionType: string) => {
    switch (actionType) {
      case 'schedule_same_agent':
        return "Your request to schedule another showing with this agent has been sent.";
      case 'work_with_agent':
        return "Your interest in working with this agent has been noted.";
      case 'ask_question':
        return "Your question has been sent to the agent.";
      case 'schedule_different_property':
        return "Your request to see other properties has been noted.";
      default:
        return "Your action has been recorded.";
    }
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    await handleAction('ask_question', { message: message.trim() });
    setMessage("");
  };

  // Only show for completed showings
  if (showingStatus !== 'completed') {
    return null;
  }

  return (
    <Card className="mt-6 border-green-200 bg-green-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800">
          <MessageCircle className="h-5 w-5" />
          What's Next?
        </CardTitle>
        <p className="text-sm text-green-600">
          Thanks for touring {propertyAddress}! Let us know how we can help you next.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {userType === 'buyer' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Button
                onClick={() => handleAction('schedule_same_agent')}
                disabled={isSubmitting}
                variant="outline"
                className="border-green-300 text-green-700 hover:bg-green-100"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Another Showing
              </Button>
              
              <Button
                onClick={() => handleAction('work_with_agent')}
                disabled={isSubmitting}
                variant="outline"
                className="border-purple-300 text-purple-700 hover:bg-purple-100"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Work with {agentName || 'This Agent'}
              </Button>
              
              <Button
                onClick={() => handleAction('schedule_different_property')}
                disabled={isSubmitting}
                variant="outline"
                className="border-blue-300 text-blue-700 hover:bg-blue-100"
              >
                <Heart className="h-4 w-4 mr-2" />
                See Other Properties
              </Button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-green-800">
                Have a question for your agent?
              </label>
              <div className="flex gap-2">
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask about the property, neighborhood, or next steps..."
                  className="flex-1"
                  rows={3}
                />
                <Button
                  onClick={sendMessage}
                  disabled={isSubmitting || !message.trim()}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}

        {userType === 'agent' && (
          <div className="text-center p-4 bg-white rounded-lg border">
            <p className="text-sm text-gray-600 mb-2">
              Buyer actions and questions will appear here. You can respond directly to maintain engagement.
            </p>
            <Badge variant="outline" className="text-green-600 border-green-300">
              Monitoring buyer activity
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PostShowingCommunication;
