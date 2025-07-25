
import { supabase } from "@/integrations/supabase/client";
import type { AuthError } from "@supabase/auth-js";

const getRedirectUrl = () => {
  // Use the current origin, which will be correct for both development and production
  const origin = window.location.origin;
  console.log('getRedirectUrl() returning:', origin);
  return origin;
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
      data: metadata,
      emailRedirectTo: undefined // Disable email confirmation redirect
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
    // Let's try without specifying redirectTo at all - let Supabase use its configured Site URL
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        queryParams: { 
          user_type: userType,
          // Add a flag so we know this came from tour booking
          source: 'property_request'
        }
      }
    });

    if (error) {
      console.error('OAuth error:', error);
      return { error };
    }

    if (data?.url) {
      console.log('OAuth URL (using default Site URL):', data.url);
      window.location.href = data.url;
    }
    
    return { error: null };
  } catch (error) {
    console.error('OAuth redirect error:', error);
    return { error: error as AuthError };
  }
};

export const signOut = async () => {
  await supabase.auth.signOut();
};
