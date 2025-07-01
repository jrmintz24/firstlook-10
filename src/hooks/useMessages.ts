
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
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
  const lastFetchRef = useRef<number>(0);
  const cacheRef = useRef<{ messages: MessageWithShowing[]; timestamp: number } | null>(null);

  // Cache duration: 30 seconds
  const CACHE_DURATION = 30000;

  // Optimized debounced fetch function
  const debouncedFetchMessages = useCallback(() => {
    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current);
    }
    
    fetchTimeoutRef.current = setTimeout(() => {
      fetchMessages();
    }, 200); // Reduced debounce time
  }, []);

  const fetchMessages = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    // Check cache first
    const now = Date.now();
    if (cacheRef.current && (now - cacheRef.current.timestamp) < CACHE_DURATION) {
      console.log('Using cached messages');
      setMessages(cacheRef.current.messages);
      setLoading(false);
      return;
    }

    // Prevent too frequent fetches
    if (now - lastFetchRef.current < 1000) {
      console.log('Skipping fetch - too frequent');
      return;
    }

    try {
      console.log('Fetching property messages for user:', userId);
      lastFetchRef.current = now;
      
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

      if (error) throw error;

      // Filter out expired messages and cache result
      const now = new Date();
      const activeMessages = (data || []).filter(msg => {
        if (!msg.access_expires_at) return true;
        return new Date(msg.access_expires_at) > now;
      });

      // Update cache
      cacheRef.current = {
        messages: activeMessages,
        timestamp: Date.now()
      };

      console.log('Active property messages:', activeMessages.length);
      setMessages(activeMessages);
      
      // Count unread messages efficiently
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

  // Memoize expensive operations
  const { markMessagesAsRead, sendMessage } = useMessageOperations(userId, debouncedFetchMessages, toast);
  const { getMessagesForShowing, getConversations } = useConversations(messages, userId);
  
  // Clear cache when user changes
  useEffect(() => {
    cacheRef.current = null;
  }, [userId]);

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

  // Memoize return object to prevent unnecessary re-renders
  return useMemo(() => ({
    messages,
    loading,
    unreadCount,
    fetchMessages: debouncedFetchMessages,
    sendMessage,
    getMessagesForShowing,
    getConversations,
    markMessagesAsRead
  }), [messages, loading, unreadCount, debouncedFetchMessages, sendMessage, getMessagesForShowing, getConversations, markMessagesAsRead]);
};
