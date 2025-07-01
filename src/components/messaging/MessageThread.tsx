
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string | null;
  created_at: string;
  read_at: string | null;
  sender_profile?: {
    first_name: string | null;
    last_name: string | null;
    user_type: string | null;
  };
}

interface MessageThreadProps {
  messages: Message[];
  onSendMessage: (content: string, receiverId?: string) => Promise<boolean>;
  onMarkAsRead?: () => void;
  conversationType?: 'property' | 'support';
  isNewConversation?: boolean;
  // Legacy props for backward compatibility
  currentUserId?: string;
  propertyAddress?: string;
  showingStatus?: string;
}

const MessageThread = ({ 
  messages, 
  onSendMessage, 
  onMarkAsRead, 
  conversationType = 'property',
  isNewConversation = false,
  currentUserId,
  propertyAddress,
  showingStatus
}: MessageThreadProps) => {
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Use currentUserId if provided (legacy), otherwise use auth user
  const userId = currentUserId || user?.id;

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Mark messages as read when opened
  useEffect(() => {
    if (onMarkAsRead && messages.length > 0) {
      const hasUnreadMessages = messages.some(msg => 
        msg.receiver_id === userId && !msg.read_at
      );
      if (hasUnreadMessages) {
        onMarkAsRead();
      }
    }
  }, [messages, onMarkAsRead, userId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      let success = false;
      
      if (conversationType === 'property') {
        // For property messages, we need to determine the receiver
        const otherParticipants = messages
          .map(msg => msg.sender_id === userId ? msg.receiver_id : msg.sender_id)
          .filter((id, index, arr) => id && id !== userId && arr.indexOf(id) === index);
        
        const receiverId = otherParticipants[0] || '';
        success = await onSendMessage(newMessage.trim(), receiverId);
      } else {
        // Support messages
        success = await onSendMessage(newMessage.trim());
      }

      if (success) {
        setNewMessage("");
      }
    } finally {
      setSending(false);
    }
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const getSenderName = (message: Message) => {
    if (message.sender_id === userId) {
      return 'You';
    }
    
    if (message.sender_profile) {
      const { first_name, last_name, user_type } = message.sender_profile;
      const name = [first_name, last_name].filter(Boolean).join(' ');
      return name || (user_type === 'admin' ? 'Support Team' : 'Agent');
    }
    
    return conversationType === 'support' ? 'Support Team' : 'Agent';
  };

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-3" ref={scrollAreaRef}>
        {isNewConversation && messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <p className="text-sm">Start the conversation by sending a message below.</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <p className="text-sm">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => {
              const isOwnMessage = message.sender_id === userId;
              return (
                <div
                  key={message.id}
                  className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 ${
                      isOwnMessage
                        ? 'bg-black text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs opacity-70">
                        {getSenderName(message)}
                      </span>
                      <span className="text-xs opacity-50">
                        {formatMessageTime(message.created_at)}
                      </span>
                    </div>
                    <p className="text-sm break-words">{message.content}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div ref={messagesEndRef} />
      </ScrollArea>

      <form onSubmit={handleSendMessage} className="p-3 border-t">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={
              conversationType === 'support'
                ? "Type your message..."
                : "Send a message..."
            }
            disabled={sending}
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="bg-black hover:bg-gray-800"
            size="sm"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MessageThread;
