
import { MessageWithShowing } from "@/types/message";

export const useConversations = (messages: MessageWithShowing[], userId: string | null) => {
  const getMessagesForShowing = (showingRequestId: string) => {
    return messages.filter(msg => msg.showing_request_id === showingRequestId);
  };

  const getConversations = () => {
    const conversations = new Map();
    
    messages.forEach(message => {
      const key = message.showing_request_id;
      if (!conversations.has(key)) {
        conversations.set(key, {
          showing_request_id: key,
          property_address: message.showing_request?.property_address || 'Unknown Property',
          status: message.showing_request?.status || 'unknown',
          messages: [],
          last_message_at: message.created_at,
          unread_count: 0
        });
      }
      
      const conversation = conversations.get(key);
      conversation.messages.push(message);
      
      // Update last message time
      if (new Date(message.created_at) > new Date(conversation.last_message_at)) {
        conversation.last_message_at = message.created_at;
      }
      
      // Count unread (messages received by current user that haven't been read)
      if (message.receiver_id === userId && !message.read_at) {
        conversation.unread_count++;
      }
    });

    return Array.from(conversations.values()).sort((a, b) => 
      new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime()
    );
  };

  return {
    getMessagesForShowing,
    getConversations
  };
};
