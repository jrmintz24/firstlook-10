
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Send, MapPin, AlertCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { MessageWithShowing } from "@/types/message";

interface MessageThreadProps {
  messages: MessageWithShowing[];
  currentUserId: string;
  onSendMessage: (content: string) => Promise<boolean>;
  propertyAddress: string;
  showingStatus: string;
}

const MessageThread = ({
  messages,
  currentUserId,
  onSendMessage,
  propertyAddress,
  showingStatus
}: MessageThreadProps) => {
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    try {
      const success = await onSendMessage(newMessage.trim());
      if (success) {
        setNewMessage("");
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const sortedMessages = [...messages].sort((a, b) => 
    new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  const canSendMessages = showingStatus !== 'cancelled';

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3 border-b">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-purple-500 flex-shrink-0" />
            <div>
              <CardTitle className="text-lg">{propertyAddress}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {showingStatus}
                </Badge>
                <span className="text-xs text-gray-500">
                  {messages.length} message{messages.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
          {sortedMessages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <div className="text-sm">No messages yet</div>
                <div className="text-xs text-gray-400 mt-1">Start a conversation about this property</div>
              </div>
            </div>
          ) : (
            sortedMessages.map((message, index) => {
              const isFromCurrentUser = message.sender_id === currentUserId;
              const showTime = index === 0 || 
                new Date(message.created_at).getTime() - new Date(sortedMessages[index - 1].created_at).getTime() > 300000; // 5 minutes

              return (
                <div key={message.id} className="space-y-1">
                  {showTime && (
                    <div className="text-center text-xs text-gray-400">
                      {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                    </div>
                  )}
                  <div className={`flex ${isFromCurrentUser ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[80%] px-4 py-2 rounded-lg ${
                        isFromCurrentUser
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Message Input */}
        <div className="border-t p-4">
          {!canSendMessages ? (
            <div className="flex items-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-lg">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">This showing has been cancelled. Messages are no longer available.</span>
            </div>
          ) : (
            <div className="flex gap-3">
              <Textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 min-h-[50px] max-h-32 resize-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                disabled={isSending}
              />
              <Button
                size="sm"
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || isSending}
                className="bg-purple-600 hover:bg-purple-700 h-[50px] w-12 p-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MessageThread;
