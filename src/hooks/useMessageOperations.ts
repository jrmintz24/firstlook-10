
import { supabase } from "@/integrations/supabase/client";

export const useMessageOperations = (userId: string | null, fetchMessages: () => void, toast: any) => {
  const markMessagesAsRead = async (showingRequestId: string) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('messages')
        .update({ read_at: new Date().toISOString() })
        .eq('showing_request_id', showingRequestId)
        .eq('receiver_id', userId)
        .is('read_at', null);

      if (error) {
        console.error('Error marking messages as read:', error);
        return;
      }

      fetchMessages();
    } catch (error) {
      console.error('Error marking messages as read:', error);
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
      userId,
      hasUserId: !!userId,
      hasReceiverId: !!receiverId,
      hasContent: !!content,
      contentLength: content?.length
    });

    if (!userId) {
      console.error('sendMessage: No userId available');
      toast({
        title: "Error",
        description: "You must be logged in to send messages.",
        variant: "destructive"
      });
      return false;
    }

    if (!receiverId) {
      console.error('sendMessage: No receiverId provided');
      toast({
        title: "Error", 
        description: "Unable to identify message recipient.",
        variant: "destructive"
      });
      return false;
    }

    if (!content || content.trim().length === 0) {
      console.error('sendMessage: No content provided');
      toast({
        title: "Error",
        description: "Message cannot be empty.",
        variant: "destructive"
      });
      return false;
    }

    try {
      // Check if the showing allows messaging
      console.log('Checking showing status for:', showingRequestId);
      const { data: showingData, error: showingError } = await supabase
        .from('showing_requests')
        .select('status, status_updated_at, user_id, assigned_agent_id')
        .eq('id', showingRequestId)
        .single();

      console.log('Showing data:', { showingData, showingError });

      if (showingError) {
        console.error('Error fetching showing data:', showingError);
        toast({
          title: "Error",
          description: "Unable to verify showing details.",
          variant: "destructive"
        });
        return false;
      }

      if (!showingData) {
        console.error('No showing data found for ID:', showingRequestId);
        toast({
          title: "Error",
          description: "Showing not found.",
          variant: "destructive"
        });
        return false;
      }

      if (showingData.status === 'cancelled') {
        toast({
          title: "Error",
          description: "Cannot send messages for cancelled showings.",
          variant: "destructive"
        });
        return false;
      }

      // Check if messaging has expired (1 week after completion)
      if (showingData.status === 'completed' && showingData.status_updated_at) {
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

      // Verify the user is authorized to send messages for this showing
      const isAuthorized = userId === showingData.user_id || userId === showingData.assigned_agent_id;
      if (!isAuthorized) {
        console.error('User not authorized to send messages for this showing:', {
          userId,
          showingUserId: showingData.user_id,
          assignedAgentId: showingData.assigned_agent_id
        });
        toast({
          title: "Error",
          description: "You are not authorized to send messages for this showing.",
          variant: "destructive"
        });
        return false;
      }

      console.log('Inserting message:', {
        showing_request_id: showingRequestId,
        sender_id: userId,
        receiver_id: receiverId,
        content: content.trim()
      });

      const { data: messageData, error } = await supabase
        .from('messages')
        .insert({
          showing_request_id: showingRequestId,
          sender_id: userId,
          receiver_id: receiverId,
          content: content.trim()
        })
        .select()
        .single();

      console.log('Message insert result:', { messageData, error });

      if (error) {
        console.error('Database error inserting message:', error);
        toast({
          title: "Error",
          description: "Failed to send message. Please try again.",
          variant: "destructive"
        });
        return false;
      }

      // Send email notification (non-blocking)
      try {
        console.log('Sending email notification...');
        const { error: notificationError } = await supabase.functions.invoke('send-message-notification', {
          body: {
            messageId: messageData.id,
            senderId: userId,
            receiverId: receiverId,
            showingRequestId: showingRequestId,
            content: content.trim()
          }
        });

        if (notificationError) {
          console.warn('Failed to send email notification:', notificationError);
          // Don't fail the whole message send if notification fails
        } else {
          console.log('Email notification sent successfully');
        }
      } catch (notificationError) {
        console.warn('Exception sending email notification:', notificationError);
        // Don't fail the whole message send if notification fails
      }

      toast({
        title: "Message Sent",
        description: "Your message has been sent successfully.",
      });

      fetchMessages();
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

  return {
    markMessagesAsRead,
    sendMessage
  };
};
