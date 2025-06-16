
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  showing_request_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
}

interface MessageWithShowing extends Message {
  showing_request?: {
    property_address: string;
    status: string;
  };
  sender_profile?: {
    first_name: string;
    last_name: string;
    user_type: string;
  };
}

export const useMessages = (userId: string | null) => {
  const [messages, setMessages] = useState<MessageWithShowing[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const { toast } = useToast();

  const fetchMessages = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          showing_request:showing_requests(property_address, status),
          sender_profile:profiles!sender_id(first_name, last_name, user_type)
        `)
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setMessages(data || []);
      
      // Count unread messages (for now, consider all received messages as potentially unread)
      const unread = data?.filter(msg => msg.receiver_id === userId).length || 0;
      setUnreadCount(unread);
      
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (
    showingRequestId: string,
    receiverId: string,
    content: string
  ) => {
    if (!userId) {
      toast({
        title: "Error",
        description: "You must be logged in to send messages.",
        variant: "destructive"
      });
      return false;
    }

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          showing_request_id: showingRequestId,
          sender_id: userId,
          receiver_id: receiverId,
          content: content
        });

      if (error) throw error;

      toast({
        title: "Message Sent",
        description: "Your message has been sent successfully.",
      });

      fetchMessages(); // Refresh messages
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

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
      
      // Count unread (messages received by current user)
      if (message.receiver_id === userId) {
        conversation.unread_count++;
      }
    });

    return Array.from(conversations.values()).sort((a, b) => 
      new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime()
    );
  };

  useEffect(() => {
    fetchMessages();
  }, [userId]);

  // Set up real-time subscription
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel('messages-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `or(sender_id.eq.${userId},receiver_id.eq.${userId})`
        },
        () => {
          fetchMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return {
    messages,
    loading,
    unreadCount,
    fetchMessages,
    sendMessage,
    getMessagesForShowing,
    getConversations
  };
};
