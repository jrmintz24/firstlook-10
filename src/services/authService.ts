
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
  const userType = metadata.user_type || 'buyer';
  const redirectPath = userType === 'agent'
    ? 'agent-dashboard'
    : userType === 'admin'
    ? 'admin-dashboard'
    : 'buyer-dashboard';

  console.log('authService.signUp - User type:', userType, 'Metadata:', metadata);

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${getRedirectUrl()}/${redirectPath}`,
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
  provider: 'google' | 'facebook',
  userType: 'buyer' | 'agent' | 'admin'
): Promise<{ error: AuthError | null }> => {
  const redirectPath = userType === 'agent'
    ? 'agent-dashboard'
    : userType === 'admin'
    ? 'admin-dashboard'
    : 'buyer-dashboard';

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${getRedirectUrl()}/${redirectPath}`,
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
