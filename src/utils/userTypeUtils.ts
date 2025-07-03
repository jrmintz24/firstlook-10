
import { supabase } from "@/integrations/supabase/client";

export const getUserTypeFromProfile = async (userId: string): Promise<string | null> => {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('user_type')
      .eq('id', userId)
      .single();

    if (error || !profile) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    return profile.user_type || 'buyer'; // Default to buyer if not set
  } catch (error) {
    console.error('Error in getUserTypeFromProfile:', error);
    return null;
  }
};

export const getUserRedirectPath = (userType: string): string => {
  switch (userType) {
    case 'agent':
      return '/agent-dashboard';
    case 'admin':
      return '/admin-dashboard';
    default:
      return '/buyer-dashboard';
  }
};
