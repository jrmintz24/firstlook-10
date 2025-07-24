
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

  // Simplified approach - let Supabase handle the redirect to its default site URL
  // We'll detect the tour booking context in the auth state change listener
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      queryParams: { user_type: userType }
    }
  });

  if (data?.url) {
    window.location.href = data.url;
  }

  return { error };
};

export const signOut = async () => {
  await supabase.auth.signOut();
};
