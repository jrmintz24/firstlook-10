
import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMessageData } from "./useMessageData";
import { useMessageOperations } from "./useMessageOperations";
import { useMessageSubscription } from "./useMessageSubscription";

interface Conversation {
  showing_request_id: string;
  property_address: string;
  messages: any[];
  unread_count: number;
}

export const useMessages = (userId: string | null) => {
  const { toast } = useToast();
  const [unreadCount, setUnreadCount] = useState(0);

  // Get message data
  const { messages, loading, fetchMessages } = useMessageData(userId);

  // Get message operations
  const { markMessagesAsRead, sendMessage } = useMessageOperations(userId, fetchMessages, toast);

  // Set up real-time subscription
  useMessageSubscription(userId, fetchMessages);

  // Calculate unread count when messages change
  useState(() => {
    if (userId && messages.length > 0) {
      const unread = messages.filter(msg => 
        msg.receiver_id === userId && !msg.read_at
      ).length;
      setUnreadCount(unread);
    } else {
      setUnreadCount(0);
    }
  });

  // Memoized conversations getter
  const getConversations = useMemo((): Conversation[] => {
    const conversationMap = new Map();
    
    messages.forEach(message => {
      const showingId = message.showing_request_id;
      if (!showingId) return;
      
      if (!conversationMap.has(showingId)) {
        conversationMap.set(showingId, {
          showing_request_id: showingId,
          property_address: message.showing_request?.property_address || 'Unknown Property',
          messages: [],
          unread_count: 0
        });
      }
      
      const conversation = conversationMap.get(showingId);
      conversation.messages.push(message);
      
      if (message.receiver_id === userId && !message.read_at) {
        conversation.unread_count++;
      }
    });
    
    return Array.from(conversationMap.values());
  }, [messages, userId]);

  // Simple messages getter for showing
  const getMessagesForShowing = (showingId: string) => {
    return messages.filter(msg => msg.showing_request_id === showingId)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  };

  // Enhanced mark as read that updates local state
  const markMessagesAsReadEnhanced = async (showingRequestId: string) => {
    await markMessagesAsRead(showingRequestId);

    // Update unread count immediately for better UX
    const unreadForShowing = messages.filter(msg => 
      msg.showing_request_id === showingRequestId && 
      msg.receiver_id === userId && 
      !msg.read_at
    ).length;
    setUnreadCount(prev => Math.max(0, prev - unreadForShowing));
  };

  return {
    messages,
    loading,
    unreadCount,
    fetchMessages,
    sendMessage,
    getMessagesForShowing,
    getConversations,
    markMessagesAsRead: markMessagesAsReadEnhanced
  };
};
