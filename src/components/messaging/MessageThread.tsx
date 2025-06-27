
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Send, MapPin, Clock } from "lucide-react";
import { format } from "date-fns";
import { MessageWithShowing } from "@/types/message";

interface MessageThreadProps {
  messages: MessageWithShowing[];
  currentUserId: string;
  onSendMessage: (content: string) => Promise<boolean>;
  propertyAddress?: string;
  showingStatus?: string;
}

const MessageThread = ({
  messages,
  currentUserId,
  onSendMessage,
  propertyAddress,
  showingStatus
}: MessageThreadProps) => {
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || sending) return;

    console.log('MessageThread: Attempting to send message:', {
      messageContent: newMessage.trim(),
      messagesCount: messages.length,
      currentUserId,
      hasOnSendMessage: typeof onSendMessage === 'function'
    });

    setSending(true);
    try {
      const success = await onSendMessage(newMessage.trim());
      console.log('MessageThread: Send result:', success);
      
      if (success) {
        setNewMessage("");
      }
    } catch (error) {
      console.error('MessageThread: Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'confirmed':
      case 'agent_confirmed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const canSendMessages = showingStatus !== 'cancelled';

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5 text-purple-500" />
              {propertyAddress || 'Property Discussion'}
            </CardTitle>
            {showingStatus && (
              <Badge className={`mt-2 ${getStatusColor(showingStatus)}`}>
                {showingStatus.charAt(0).toUpperCase() + showingStatus.slice(1).replace('_', ' ')}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col min-h-0">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-3 min-h-0">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <div className="text-sm">No messages yet</div>
              <div className="text-xs mt-1">Start the conversation!</div>
            </div>
          ) : (
            messages.map((message) => {
              const isOwnMessage = message.sender_id === currentUserId;
              return (
                <div
                  key={message.id}
                  className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      isOwnMessage
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <div className="text-sm whitespace-pre-wrap break-words">
                      {message.content}
                    </div>
                    <div
                      className={`text-xs mt-1 ${
                        isOwnMessage ? 'text-purple-100' : 'text-gray-500'
                      }`}
                    >
                      {format(new Date(message.created_at), 'MMM d, h:mm a')}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message input */}
        {canSendMessages ? (
          <div className="flex gap-2">
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 resize-none"
              rows={2}
              disabled={sending}
            />
            <Button
              onClick={handleSend}
              disabled={!newMessage.trim() || sending}
              size="sm"
              className="bg-purple-600 hover:bg-purple-700 self-end"
            >
              {sending ? (
                <Clock className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        ) : (
          <div className="text-center text-gray-500 py-4">
            <div className="text-sm">Messaging is no longer available for this showing</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MessageThread;
