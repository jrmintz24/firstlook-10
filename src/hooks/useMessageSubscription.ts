
import { useEffect, useRef } from 'react';
import { supabase } from "@/integrations/supabase/client";

export const useMessageSubscription = (userId: string | null, fetchMessages: () => void) => {
  const channelRef = useRef<any>(null);

  useEffect(() => {
    if (!userId) return;

    // Clean up existing channel first
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    console.log('Setting up message subscription for user:', userId);

    // Create a more specific channel name
    const channelName = `messages-user-${userId}`;
    
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `or(sender_id.eq.${userId},receiver_id.eq.${userId})`
        },
        (payload) => {
          console.log('Message subscription event:', payload);
          fetchMessages();
        }
      )
      .subscribe((status) => {
        console.log('Message subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to message updates');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('Message subscription error, retrying...');
          // Retry after a delay
          setTimeout(() => {
            if (channelRef.current) {
              channelRef.current.unsubscribe();
              channelRef.current = null;
            }
            // The effect will re-run and create a new subscription
          }, 2000);
        }
      });

    channelRef.current = channel;

    return () => {
      console.log('Cleaning up message subscription');
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [userId, fetchMessages]);
};
