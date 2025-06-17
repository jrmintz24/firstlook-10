
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Send, X } from "lucide-react";
import { useMessages } from "@/hooks/useMessages";
import { useToast } from "@/hooks/use-toast";

interface ChatInitiatorProps {
  showingRequestId: string;
  agentId: string;
  buyerId: string;
  propertyAddress: string;
  isOpen: boolean;
  onClose: () => void;
}

const ChatInitiator = ({
  showingRequestId,
  agentId,
  buyerId,
  propertyAddress,
  isOpen,
  onClose
}: ChatInitiatorProps) => {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const { sendMessage } = useMessages(buyerId);
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    setSending(true);
    try {
      const success = await sendMessage(showingRequestId, agentId, message.trim());
      
      if (success) {
        toast({
          title: "Message Sent",
          description: "Your message has been sent to the agent.",
        });
        setMessage("");
        onClose();
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-purple-600" />
              Message Agent
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-gray-600 truncate">
            {propertyAddress}
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Your Message
            </label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message to the agent..."
              className="min-h-[120px]"
              disabled={sending}
            />
          </div>
          
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={onClose} disabled={sending}>
              Cancel
            </Button>
            <Button
              onClick={handleSendMessage}
              disabled={sending || !message.trim()}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Send className="h-4 w-4 mr-2" />
              {sending ? "Sending..." : "Send Message"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatInitiator;
