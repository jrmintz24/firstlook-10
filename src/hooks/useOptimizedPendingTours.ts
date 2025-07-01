
import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useOptimizedPendingTours = (userId: string | null) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  const processedRef = useRef(false);

  useEffect(() => {
    // Don't block initial render - process asynchronously
    if (!userId || processedRef.current) return;

    const processPendingTour = async () => {
      const pendingTour = searchParams.get('pendingTour');
      const propertyAddress = searchParams.get('propertyAddress');
      
      if (!pendingTour || !propertyAddress) return;

      try {
        processedRef.current = true;
        
        // Process in background without blocking UI
        setTimeout(async () => {
          const { error } = await supabase
            .from('showing_requests')
            .insert({
              user_id: userId,
              property_address: decodeURIComponent(propertyAddress),
              status: 'pending',
              message: 'Tour requested during signup process'
            });

          if (error) {
            console.error('Error creating pending tour:', error);
            return;
          }

          toast({
            title: "Tour Request Created",
            description: `Your tour request for ${decodeURIComponent(propertyAddress)} has been submitted.`,
          });

          // Clean up URL params
          const newParams = new URLSearchParams(searchParams);
          newParams.delete('pendingTour');
          newParams.delete('propertyAddress');
          setSearchParams(newParams, { replace: true });
        }, 1000); // Delay to not interfere with initial load

      } catch (error) {
        console.error('Error processing pending tour:', error);
      }
    };

    processPendingTour();
  }, [userId, searchParams, setSearchParams, toast]);

  return { processingComplete: processedRef.current };
};
