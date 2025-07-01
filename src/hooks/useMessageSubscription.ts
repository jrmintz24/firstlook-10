
import { useEffect, useRef } from 'react';
import { useMessageSubscriptionManager } from './useMessageSubscriptionManager';

export const useMessageSubscription = (userId: string | null, fetchMessages: () => void) => {
  const { createSubscription, cleanupConnection, resetConnection } = useMessageSubscriptionManager();
  const hasSetupSubscription = useRef(false);

  useEffect(() => {
    if (!userId) {
      cleanupConnection();
      hasSetupSubscription.current = false;
      return;
    }

    // Prevent multiple subscriptions for the same user
    if (hasSetupSubscription.current) {
      console.log('Message subscription already set up for user:', userId);
      return;
    }

    console.log('Setting up message subscription for user:', userId);
    hasSetupSubscription.current = true;

    const channel = createSubscription(userId, fetchMessages);

    return () => {
      console.log('Cleaning up message subscription for user:', userId);
      cleanupConnection();
      hasSetupSubscription.current = false;
    };
  }, [userId, createSubscription, cleanupConnection, fetchMessages]);

  // Reset connection on user change
  useEffect(() => {
    resetConnection();
  }, [userId, resetConnection]);
};
