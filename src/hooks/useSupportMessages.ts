
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SupportConversation {
  id: string;
  subject: string | null;
  status: string;
  priority: string;
  messages: any[];
  last_message_at: string;
  unread_count: number;
  admin_id: string | null;
}

export const useSupportMessages = (userId: string | null) => {
  const [conversations, setConversations] = useState<SupportConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const { toast } = useToast();

  const fetchSupportConversations = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching support conversations for user:', userId);
      
      // Get support conversations
      const { data: conversationsData, error: conversationsError } = await supabase
        .from('support_conversations')
        .select('*')
        .eq('buyer_id', userId)
        .order('last_message_at', { ascending: false });

      if (conversationsError) throw conversationsError;

      // Get messages for each conversation
      const conversationsWithMessages = await Promise.all(
        (conversationsData || []).map(async (conversation) => {
          const { data: messages, error: messagesError } = await supabase
            .from('messages')
            .select(`
              *,
              sender_profile:profiles!sender_id(first_name, last_name, user_type)
            `)
            .eq('support_conversation_id', conversation.id)
            .eq('conversation_type', 'support')
            .order('created_at', { ascending: true });

          if (messagesError) {
            console.error('Error fetching messages for conversation:', messagesError);
            return {
              ...conversation,
              messages: [],
              unread_count: 0
            };
          }

          // Count unread messages (received by current user)
          const unread = messages?.filter(msg => 
            msg.receiver_id === userId && !msg.read_at
          ).length || 0;

          return {
            ...conversation,
            messages: messages || [],
            unread_count: unread
          };
        })
      );

      console.log('Support conversations:', conversationsWithMessages);
      setConversations(conversationsWithMessages);
      
      // Calculate total unread count
      const totalUnread = conversationsWithMessages.reduce((sum, conv) => sum + conv.unread_count, 0);
      setUnreadCount(totalUnread);
      
    } catch (error) {
      console.error('Error fetching support conversations:', error);
      toast({
        title: "Error",
        description: "Failed to load support conversations.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (conversationId: string, content: string, subject?: string) => {
    if (!userId) {
      toast({
        title: "Error",
        description: "You must be logged in to send messages.",
        variant: "destructive"
      });
      return false;
    }

    if (!content || content.trim().length === 0) {
      toast({
        title: "Error",
        description: "Message cannot be empty.",
        variant: "destructive"
      });
      return false;
    }

    try {
      let actualConversationId = conversationId;

      // If this is a new conversation, create it first
      if (conversationId === 'new') {
        const { data: newConversation, error: conversationError } = await supabase
          .from('support_conversations')
          .insert({
            buyer_id: userId,
            subject: subject || 'Support Request',
            status: 'open',
            priority: 'normal'
          })
          .select()
          .single();

        if (conversationError) {
          console.error('Error creating support conversation:', conversationError);
          toast({
            title: "Error",
            description: "Failed to create support conversation.",
            variant: "destructive"
          });
          return false;
        }

        actualConversationId = newConversation.id;
      }

      // Send the message
      const { error: messageError } = await supabase
        .from('messages')
        .insert({
          support_conversation_id: actualConversationId,
          sender_id: userId,
          receiver_id: null, // Will be assigned to an admin
          content: content.trim(),
          conversation_type: 'support'
        });

      if (messageError) {
        console.error('Error sending support message:', messageError);
        toast({
          title: "Error",
          description: "Failed to send message.",
          variant: "destructive"
        });
        return false;
      }

      toast({
        title: "Message Sent",
        description: "Your support message has been sent successfully.",
      });

      fetchSupportConversations();
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
  };

  const markMessagesAsRead = async (conversationId: string) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('messages')
        .update({ read_at: new Date().toISOString() })
        .eq('support_conversation_id', conversationId)
        .eq('receiver_id', userId)
        .is('read_at', null);

      if (error) {
        console.error('Error marking support messages as read:', error);
        return;
      }

      fetchSupportConversations();
    } catch (error) {
      console.error('Error marking support messages as read:', error);
    }
  };

  // Subscribe to real-time updates
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel('support-messages-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `conversation_type=eq.support`
        },
        () => {
          fetchSupportConversations();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'support_conversations',
          filter: `buyer_id=eq.${userId}`
        },
        () => {
          fetchSupportConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  useEffect(() => {
    fetchSupportConversations();
  }, [userId]);

  return {
    conversations,
    loading,
    unreadCount,
    sendMessage,
    markMessagesAsRead,
    fetchSupportConversations
  };
};
