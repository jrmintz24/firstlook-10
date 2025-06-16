
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle, Send } from "lucide-react";
import { useMessages } from "@/hooks/useMessages";

interface MessageIndicatorProps {
  showingRequestId: string;
  userId: string;
  onSendMessage?: () => void;
  compact?: boolean;
}

const MessageIndicator = ({ 
  showingRequestId, 
  userId, 
  onSendMessage,
  compact = false 
}: MessageIndicatorProps) => {
  const { getMessagesForShowing } = useMessages(userId);
  const messages = getMessagesForShowing(showingRequestId);
  const messageCount = messages.length;
  const unreadCount = messages.filter(msg => msg.receiver_id === userId).length;

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {messageCount > 0 && (
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <MessageCircle className="h-4 w-4" />
            <span>{messageCount}</span>
            {unreadCount > 0 && (
              <Badge className="bg-red-500 text-white text-xs ml-1">
                {unreadCount}
              </Badge>
            )}
          </div>
        )}
        {onSendMessage && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onSendMessage}
            className="border-purple-200 text-purple-700 hover:bg-purple-50"
          >
            <Send className="h-3 w-3 mr-1" />
            Message
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-blue-50 p-3 rounded-lg mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-800">
            {messageCount === 0 ? 'No messages yet' : `${messageCount} message${messageCount !== 1 ? 's' : ''}`}
          </span>
          {unreadCount > 0 && (
            <Badge className="bg-red-500 text-white text-xs">
              {unreadCount} unread
            </Badge>
          )}
        </div>
        {onSendMessage && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onSendMessage}
            className="border-blue-200 text-blue-700 hover:bg-blue-100"
          >
            <Send className="h-3 w-3 mr-1" />
            Send Message
          </Button>
        )}
      </div>
    </div>
  );
};

export default MessageIndicator;
