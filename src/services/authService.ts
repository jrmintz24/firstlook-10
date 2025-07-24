
import { supabase } from "@/integrations/supabase/client";
import type { AuthError } from "@supabase/auth-js";

const getRedirectUrl = () => {
  // Use the current origin, which will be correct for both development and production
  return window.location.origin;
};

export const signUp = async (
  email: string,
  password: string,
  metadata: Record<string, unknown> & { user_type?: string }
): Promise<{ error: AuthError | null; data?: any }> => {
  console.log('authService.signUp - User type:', metadata.user_type, 'Metadata:', metadata);

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata
    }
  });

  return { error, data };
};

export const signIn = async (
  email: string,
  password: string
): Promise<{ error: AuthError | null; data?: any }> => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { error, data };
};

export const signInWithProvider = async (
  provider: 'google',
  userType: 'buyer' | 'agent' | 'admin'
): Promise<{ error: AuthError | null }> => {
  console.log('authService.signInWithProvider - User type:', userType);

  try {
    // Direct approach - manually construct the OAuth URL to bypass Supabase's redirect issues
    const supabaseUrl = 'https://uugchegukcccuqpcsqhl.supabase.co';
    const redirectTo = encodeURIComponent(`${getRedirectUrl()}/buyer-dashboard`);
    
    const oauthUrl = `${supabaseUrl}/auth/v1/authorize?provider=${provider}&redirect_to=${redirectTo}&user_type=${userType}`;
    
    console.log('Direct OAuth URL:', oauthUrl);
    
    // Redirect directly
    window.location.href = oauthUrl;
    
    return { error: null };
  } catch (error) {
    console.error('OAuth redirect error:', error);
    return { error: error as AuthError };
  }
};

export const signOut = async () => {
  await supabase.auth.signOut();
};
