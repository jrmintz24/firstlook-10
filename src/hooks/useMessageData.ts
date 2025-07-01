
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MessageWithShowing } from "@/types/message";

interface UseMessageDataReturn {
  messages: MessageWithShowing[];
  loading: boolean;
  fetchMessages: () => Promise<void>;
}

export const useMessageData = (userId: string | null): UseMessageDataReturn => {
  const [messages, setMessages] = useState<MessageWithShowing[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
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

      if (error) throw error;

      // Filter out expired messages
      const currentTime = new Date();
      const activeMessages = (data || []).filter(msg => {
        if (!msg.access_expires_at) return true;
        return new Date(msg.access_expires_at) > currentTime;
      });

      console.log('Active property messages:', activeMessages.length);
      setMessages(activeMessages);
      
    } catch (error) {
      console.error('Error fetching property messages:', error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [userId]);

  return {
    messages,
    loading,
    fetchMessages
  };
};
