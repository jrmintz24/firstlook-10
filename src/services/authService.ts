
import { supabase } from "@/integrations/supabase/client";
import type { AuthError } from "@supabase/auth-js";

export const signUp = async (
  email: string,
  password: string,
  metadata: Record<string, unknown> & { user_type?: string }
): Promise<{ error: AuthError | null }> => {
  const userType = metadata.user_type || 'buyer';
  const redirectPath = userType === 'agent'
    ? 'agent-dashboard'
    : userType === 'admin'
    ? 'admin-dashboard'
    : 'buyer-dashboard';

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/${redirectPath}`,
      data: metadata
    }
  });

  return { error };
};

export const signIn = async (
  email: string,
  password: string
): Promise<{ error: AuthError | null }> => {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return { error };
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
      redirectTo: `${window.location.origin}/${redirectPath}`,
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
