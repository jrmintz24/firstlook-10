
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

      fetchMessages();
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

  return {
    markMessagesAsRead,
    sendMessage
  };
};
