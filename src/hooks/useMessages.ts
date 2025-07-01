
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
      const currentTime = new Date();
      const activeMessages = (data || []).filter(msg => {
        if (!msg.access_expires_at) return true;
        return new Date(msg.access_expires_at) > currentTime;
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

  // Enhanced sendMessage with better receiver detection
  const sendMessage = useCallback(async (showingRequestId: string, receiverId: string | null, content: string) => {
    if (!userId || !content.trim()) {
      console.log('SendMessage failed: Missing userId or content');
      return false;
    }

    // If no receiver ID provided, try to find it from existing messages
    let actualReceiverId = receiverId;
    if (!actualReceiverId) {
      const conversationMessages = messages.filter(msg => msg.showing_request_id === showingRequestId);
      
      // Find someone who is not the current user
      for (const message of conversationMessages) {
        if (message.sender_id !== userId) {
          actualReceiverId = message.sender_id;
          break;
        }
        if (message.receiver_id !== userId) {
          actualReceiverId = message.receiver_id;
          break;
        }
      }
    }

    if (!actualReceiverId) {
      // Try to get agent from showing request
      try {
        const { data: showingData } = await supabase
          .from('showing_requests')
          .select('assigned_agent_id, assigned_agent_email')
          .eq('id', showingRequestId)
          .maybeSingle();

        if (showingData?.assigned_agent_id) {
          actualReceiverId = showingData.assigned_agent_id;
        } else if (showingData?.assigned_agent_email) {
          // Try to find agent by email
          const { data: agentProfile } = await supabase
            .from('profiles')
            .select('id')
            .eq('email', showingData.assigned_agent_email)
            .maybeSingle();
          
          if (agentProfile) {
            actualReceiverId = agentProfile.id;
          }
        }
      } catch (error) {
        console.error('Error finding receiver:', error);
      }
    }

    if (!actualReceiverId) {
      console.log('SendMessage failed: Could not determine receiver');
      toast({
        title: "Error",
        description: "Unable to determine message recipient.",
        variant: "destructive"
      });
      return false;
    }

    try {
      console.log('Sending message:', { showingRequestId, receiverId: actualReceiverId, content: content.substring(0, 50) });
      
      const { error } = await supabase
        .from('messages')
        .insert({
          showing_request_id: showingRequestId,
          sender_id: userId,
          receiver_id: actualReceiverId,
          content: content.trim(),
          conversation_type: 'property'
        });

      if (error) {
        console.error('Error sending message:', error);
        toast({
          title: "Error",
          description: "Failed to send message.",
          variant: "destructive"
        });
        return false;
      }

      // Refresh messages after sending
      debouncedFetchMessages();
      return true;
    } catch (error) {
      console.error('Exception in sendMessage:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  }, [userId, messages, debouncedFetchMessages, toast]);

  // Get operations and conversations
  const { markMessagesAsRead } = useMessageOperations(userId, debouncedFetchMessages, toast);
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

  // Return simple object without memoization to avoid type issues
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
