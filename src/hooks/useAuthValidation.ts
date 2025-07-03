
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useAuthValidation = () => {
  const validateAuthSession = useCallback(async (): Promise<{ isValid: boolean; userId: string | null }> => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.warn('Auth session error:', error.message);
        return { isValid: false, userId: null };
      }
      
      const userId = session?.user?.id;
      const isValid = !!(session && userId);
      
      if (!isValid) {
        console.warn('No valid user session found. User ID:', userId);
      }
      
      return { isValid, userId };
    } catch (error) {
      console.error('Failed to validate auth session:', error);
      return { isValid: false, userId: null };
    }
  }, []);

  return { validateAuthSession };
};
