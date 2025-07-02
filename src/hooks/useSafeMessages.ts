
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UseSafeMessagesReturn {
  unreadCount: number;
  loading: boolean;
  error: string | null;
}

export const useSafeMessages = (userId: string | null): UseSafeMessagesReturn => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUnreadCount = useCallback(async () => {
    if (!userId) {
      setUnreadCount(0);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('messages')
        .select('id')
        .eq('receiver_id', userId)
        .is('read_at', null);

      if (fetchError) {
        console.warn('Failed to fetch unread messages:', fetchError);
        setError(fetchError.message);
        setUnreadCount(0);
      } else {
        setUnreadCount(data?.length || 0);
      }
    } catch (err) {
      console.warn('Exception fetching unread messages:', err);
      setError('Failed to load messages');
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Initial fetch
  useEffect(() => {
    fetchUnreadCount();
  }, [fetchUnreadCount]);

  // Set up real-time subscription with error isolation
  useEffect(() => {
    if (!userId) return;

    let channel: any = null;
    let retryTimeout: NodeJS.Timeout;
    let retryCount = 0;
    const maxRetries = 3;

    const setupSubscription = () => {
      try {
        channel = supabase
          .channel(`safe_messages_${userId}`)
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'messages',
              filter: `receiver_id=eq.${userId}`
            },
            () => {
              // Refresh unread count when messages change
              fetchUnreadCount();
            }
          )
          .subscribe((status) => {
            if (status === 'SUBSCRIBED') {
              retryCount = 0;
              console.log('Safe messages subscription active');
            } else if (status === 'CHANNEL_ERROR') {
              console.warn('Safe messages subscription failed, will continue without real-time updates');
              
              // Don't retry infinitely - just fall back to polling
              if (retryCount < maxRetries) {
                retryCount++;
                retryTimeout = setTimeout(setupSubscription, 5000 * retryCount);
              } else {
                console.log('Safe messages: Max retries reached, continuing without real-time updates');
              }
            }
          });
      } catch (err) {
        console.warn('Failed to set up messages subscription:', err);
        // Continue without real-time updates
      }
    };

    setupSubscription();

    return () => {
      if (channel) {
        try {
          supabase.removeChannel(channel);
        } catch (err) {
          console.warn('Error cleaning up messages channel:', err);
        }
      }
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
    };
  }, [userId, fetchUnreadCount]);

  return {
    unreadCount,
    loading,
    error
  };
};
