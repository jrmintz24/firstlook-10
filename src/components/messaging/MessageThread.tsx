
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
  read_at?: string;
  sender_profile?: {
    first_name?: string;
    last_name?: string;
    user_type?: string;
  };
}

interface MessageThreadProps {
  messages: Message[];
  onSendMessage: (content: string, receiverId?: string) => Promise<boolean>;
  onMarkAsRead: () => void;
  conversationType: 'property' | 'support';
  currentUserId?: string;
  propertyAddress?: string;
  showingStatus?: string;
  isNewConversation?: boolean;
}

const MessageThread = ({ 
  messages, 
  onSendMessage, 
  onMarkAsRead, 
  conversationType,
  currentUserId,
  propertyAddress,
  showingStatus,
  isNewConversation = false
}: MessageThreadProps) => {
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const { user } = useAuth();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Use currentUserId prop if provided, otherwise use auth user
  const effectiveUserId = currentUserId || user?.id;

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mark messages as read when thread is viewed
  useEffect(() => {
    if (messages.length > 0 && effectiveUserId && !isNewConversation) {
      const hasUnreadMessages = messages.some(msg => 
        msg.receiver_id === effectiveUserId && !msg.read_at
      );
      if (hasUnreadMessages) {
        onMarkAsRead();
      }
    }
  }, [messages, effectiveUserId, onMarkAsRead, isNewConversation]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !effectiveUserId || sending) return;

    // Find the other participant (receiver)
    let receiverId: string | null = null;
    for (const message of messages) {
      if (message.sender_id !== effectiveUserId) {
        receiverId = message.sender_id;
        break;
      } else if (message.receiver_id !== effectiveUserId) {
        receiverId = message.receiver_id;
        break;
      }
    }

    setSending(true);
    try {
      const success = await onSendMessage(newMessage.trim(), receiverId || undefined);
      if (success) {
        setNewMessage('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString(undefined, { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    }
    
    return date.toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const sortedMessages = messages.sort((a, b) => 
    new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header if property info provided */}
      {propertyAddress && (
        <div className="p-3 border-b bg-gray-50">
          <p className="font-medium text-sm">{propertyAddress}</p>
          {showingStatus && (
            <p className="text-xs text-gray-500">Status: {showingStatus}</p>
          )}
        </div>
      )}

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {sortedMessages.length === 0 && !isNewConversation ? (
            <div className="text-center py-8 text-gray-500">
              <User className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No messages yet</p>
              <p className="text-xs text-gray-400 mt-1">Start the conversation below</p>
            </div>
          ) : (
            sortedMessages.map((message) => {
              const isOwnMessage = message.sender_id === effectiveUserId;
              const senderName = message.sender_profile 
                ? `${message.sender_profile.first_name || ''} ${message.sender_profile.last_name || ''}`.trim()
                : isOwnMessage ? 'You' : 'Agent';

              return (
                <div
                  key={message.id}
                  className={cn(
                    "flex",
                    isOwnMessage ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[80%] rounded-lg px-3 py-2 shadow-sm",
                      isOwnMessage
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-900 border"
                    )}
                  >
                    <div className="text-sm">{message.content}</div>
                    <div
                      className={cn(
                        "text-xs mt-1 flex items-center justify-between",
                        isOwnMessage ? "text-blue-100" : "text-gray-500"
                      )}
                    >
                      <span>{senderName}</span>
                      <span>{formatMessageTime(message.created_at)}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="border-t p-4">
        <div className="flex gap-3">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isNewConversation ? "Start your conversation..." : "Type your message..."}
            className="flex-1 min-h-[44px] max-h-24 resize-none text-sm border-gray-200 focus:border-blue-300 focus:ring-blue-200"
            disabled={sending}
          />
          <Button
            size="sm"
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || sending}
            className="bg-blue-600 hover:bg-blue-700 h-11 w-11 p-0 self-end flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MessageThread;
