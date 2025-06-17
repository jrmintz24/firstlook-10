
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
  access_expires_at?: string | null;
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
      console.log('Fetching messages for user:', userId);
      
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          showing_request:showing_requests(property_address, status),
          sender_profile:profiles!sender_id(first_name, last_name, user_type)
        `)
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .order('created_at', { ascending: false });

      console.log('Messages fetch result:', { data, error });

      if (error) throw error;

      // Filter out expired messages
      const now = new Date();
      const activeMessages = (data || []).filter(msg => {
        if (!msg.access_expires_at) return true;
        return new Date(msg.access_expires_at) > now;
      });

      console.log('Active messages:', activeMessages);
      setMessages(activeMessages);
      
      // Count unread messages (for now, consider all received messages as potentially unread)
      const unread = activeMessages?.filter(msg => msg.receiver_id === userId).length || 0;
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
    console.log('sendMessage called with:', {
      showingRequestId,
      receiverId,
      content,
      userId
    });

    if (!userId) {
      toast({
        title: "Error",
        description: "You must be logged in to send messages.",
        variant: "destructive"
      });
      return false;
    }

    try {
      // Check if the showing allows messaging
      const { data: showingData, error: showingError } = await supabase
        .from('showing_requests')
        .select('status, status_updated_at')
        .eq('id', showingRequestId)
        .single();

      console.log('Showing data:', { showingData, showingError });

      if (showingError) {
        console.error('Error fetching showing data:', showingError);
        throw showingError;
      }

      if (showingData?.status === 'cancelled') {
        toast({
          title: "Error",
          description: "Cannot send messages for cancelled showings.",
          variant: "destructive"
        });
        return false;
      }

      // Check if messaging has expired (1 week after completion)
      if (showingData?.status === 'completed' && showingData.status_updated_at) {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        if (new Date(showingData.status_updated_at) < weekAgo) {
          toast({
            title: "Error",
            description: "Message access has expired.",
            variant: "destructive"
          });
          return false;
        }
      }

      console.log('Inserting message:', {
        showing_request_id: showingRequestId,
        sender_id: userId,
        receiver_id: receiverId,
        content: content
      });

      const { data: messageData, error } = await supabase
        .from('messages')
        .insert({
          showing_request_id: showingRequestId,
          sender_id: userId,
          receiver_id: receiverId,
          content: content
        })
        .select()
        .single();

      console.log('Message insert result:', { messageData, error });

      if (error) throw error;

      // Send email notification
      try {
        console.log('Sending email notification...');
        await supabase.functions.invoke('send-message-notification', {
          body: {
            messageId: messageData.id,
            senderId: userId,
            receiverId: receiverId,
            showingRequestId: showingRequestId,
            content: content
          }
        });
        console.log('Email notification sent successfully');
      } catch (notificationError) {
        console.error('Failed to send email notification:', notificationError);
        // Don't fail the whole message send if notification fails
      }

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
