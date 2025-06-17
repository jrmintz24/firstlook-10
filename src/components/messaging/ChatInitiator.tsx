
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Send, X, User } from "lucide-react";
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg shadow-2xl border-0 bg-white">
        <CardHeader className="pb-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-t-lg">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900">Message Agent</div>
                <div className="text-sm text-gray-600 font-normal">Start a conversation about your showing</div>
              </div>
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 hover:bg-white/50 rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-3 p-3 bg-white/70 rounded-lg border border-purple-100">
            <p className="text-sm text-gray-700 font-medium truncate flex items-center gap-2">
              <User className="h-4 w-4 text-purple-500" />
              {propertyAddress}
            </p>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6 p-6">
          <div>
            <label className="text-sm font-semibold text-gray-800 mb-3 block">
              Your Message
            </label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Hi! I have some questions about the property showing..."
              className="min-h-[120px] border-gray-200 focus:border-purple-300 focus:ring-purple-200 resize-none"
              disabled={sending}
            />
            <p className="text-xs text-gray-500 mt-2">
              Your agent will receive this message and can respond directly.
            </p>
          </div>
          
          <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
            <Button 
              variant="outline" 
              onClick={onClose} 
              disabled={sending}
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendMessage}
              disabled={sending || !message.trim()}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 shadow-md"
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
