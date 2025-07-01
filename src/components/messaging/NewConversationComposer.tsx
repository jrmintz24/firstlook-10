
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, User, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ShowingData {
  id: string;
  property_address: string;
  assigned_agent_id?: string;
  assigned_agent_name?: string;
}

interface NewConversationComposerProps {
  showingData: ShowingData;
  onSendMessage: (showingId: string, receiverId: string, content: string) => Promise<boolean>;
  onSuccess: () => void;
  userId: string;
}

const NewConversationComposer = ({ showingData, onSendMessage, onSuccess, userId }: NewConversationComposerProps) => {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  const handleSend = async () => {
    if (!message.trim() || !showingData.assigned_agent_id) return;

    setSending(true);
    try {
      const success = await onSendMessage(showingData.id, showingData.assigned_agent_id, message.trim());
      
      if (success) {
        toast({
          title: "Message Sent",
          description: "Your message has been sent to the agent.",
        });
        setMessage('');
        onSuccess();
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Property Info Header */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <MapPin className="h-4 w-4 text-blue-600" />
            New Message
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">Property:</span>
              <span className="text-gray-600">{showingData.property_address}</span>
            </div>
            {showingData.assigned_agent_name && (
              <div className="flex items-center gap-2 text-sm">
                <User className="h-3 w-3" />
                <span className="font-medium">Agent:</span>
                <span className="text-gray-600">{showingData.assigned_agent_name}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Message Composer */}
      <div className="flex flex-col flex-1">
        <div className="flex-1 mb-4">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Hi! I have some questions about the property showing..."
            className="min-h-[120px] resize-none border-gray-200 focus:border-blue-300 focus:ring-blue-200"
            disabled={sending}
          />
        </div>
        
        <div className="flex justify-end">
          <Button
            onClick={handleSend}
            disabled={sending || !message.trim() || !showingData.assigned_agent_id}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6"
          >
            <Send className="h-4 w-4 mr-2" />
            {sending ? "Sending..." : "Send Message"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewConversationComposer;
