
import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useMessageSubscription = (userId: string | null, fetchMessages: () => void) => {
  const subscriptionRef = useRef<any>(null);

  useEffect(() => {
    if (!userId) {
      // Clean up existing subscription
      if (subscriptionRef.current) {
        supabase.removeChannel(subscriptionRef.current);
        subscriptionRef.current = null;
      }
      return;
    }

    console.log('useMessageSubscription: Setting up subscription for user:', userId);

    // Create new subscription
    const channel = supabase
      .channel(`messages_${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `sender_id=eq.${userId},receiver_id=eq.${userId}`
        },
        (payload) => {
          console.log('useMessageSubscription: Message change:', payload);
          fetchMessages();
        }
      )
      .subscribe((status) => {
        console.log('useMessageSubscription: Subscription status:', status);
      });

    subscriptionRef.current = channel;

    return () => {
      if (subscriptionRef.current) {
        console.log('useMessageSubscription: Cleaning up subscription');
        supabase.removeChannel(subscriptionRef.current);
        subscriptionRef.current = null;
      }
    };
  }, [userId, fetchMessages]);

  return {
    cleanup: () => {
      if (subscriptionRef.current) {
        supabase.removeChannel(subscriptionRef.current);
        subscriptionRef.current = null;
      }
    }
  };
};
