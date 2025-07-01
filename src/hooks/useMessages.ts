
import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Message, MessageWithShowing } from "@/types/message";
import { useMessageOperations } from "./useMessageOperations";
import { useMessageSubscription } from "./useMessageSubscription";
import { useConversations } from "./useConversations";

export const useMessages = (userId: string | null) => {
  const [messages, setMessages] = useState<MessageWithShowing[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const { toast } = useToast();
  const fetchTimeoutRef = useRef<NodeJS.Timeout>();

  // Debounced fetch function to prevent excessive API calls
  const debouncedFetchMessages = useCallback(() => {
    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current);
    }
    
    fetchTimeoutRef.current = setTimeout(() => {
      fetchMessages();
    }, 300); // 300ms debounce
  }, []);

  const fetchMessages = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching property messages for user:', userId);
      
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          showing_request:showing_requests(property_address, status),
          sender_profile:profiles!sender_id(first_name, last_name, user_type)
        `)
        .eq('conversation_type', 'property')
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .order('created_at', { ascending: false });

      console.log('Property messages fetch result:', { data, error });

      if (error) throw error;

      // Filter out expired messages
      const now = new Date();
      const activeMessages = (data || []).filter(msg => {
        if (!msg.access_expires_at) return true;
        return new Date(msg.access_expires_at) > now;
      });

      console.log('Active property messages:', activeMessages);
      setMessages(activeMessages);
      
      // Count unread messages (received messages that haven't been read)
      const unread = activeMessages?.filter(msg => 
        msg.receiver_id === userId && !msg.read_at
      ).length || 0;
      setUnreadCount(unread);
      
    } catch (error) {
      console.error('Error fetching property messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [userId, toast]);

  const { markMessagesAsRead, sendMessage } = useMessageOperations(userId, debouncedFetchMessages, toast);
  const { getMessagesForShowing, getConversations } = useConversations(messages, userId);
  
  useMessageSubscription(userId, debouncedFetchMessages);

  useEffect(() => {
    fetchMessages();
    
    // Cleanup timeout on unmount
    return () => {
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
    };
  }, [fetchMessages]);

  return {
    messages,
    loading,
    unreadCount,
    fetchMessages: debouncedFetchMessages,
    sendMessage,
    getMessagesForShowing,
    getConversations,
    markMessagesAsRead
  };
};
