
import { useState } from "react";
import { useToastHelper } from "@/utils/toastUtils";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface AuthFormData {
  email: string;
  password: string;
  firstName: string;
  phone: string;
  licenseNumber: string;
}

export const useAuthForm = (
  userType: 'buyer' | 'agent' | 'admin',
  onSuccess: () => void
) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    password: '',
    firstName: '',
    phone: '',
    licenseNumber: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const toastHelper = useToastHelper();
  const { signUp, signIn, signInWithProvider } = useAuth();

  const handleSocialLogin = async (
    provider: 'google' | 'github' | 'discord' | 'facebook'
  ) => {
    setIsLoading(true);
    try {
      await signInWithProvider(provider);
      toastHelper.success(
        "Success!",
        `Signed in with ${provider === 'google' ? 'Google' : 'Facebook'}!`
      );
      onSuccess();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong with social login";
      toastHelper.error("Error", message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (
    e: React.FormEvent,
    loginMode?: boolean
  ) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const isLoginMode = loginMode ?? isLogin;
      if (isLoginMode) {
        try {
          await signIn(formData.email, formData.password);
          toastHelper.success("Success!", "Welcome back!");
          const { data } = await supabase.auth.getUser();
          const type =
            (data.user?.user_metadata?.user_type as string | undefined) ??
            userType;
          onSuccess();
          const redirect =
            type === "agent"
              ? "/agent-dashboard"
              : type === "admin"
              ? "/admin-dashboard"
              : "/buyer-dashboard";
          window.location.href = redirect;
        } catch (error) {
          const message = error instanceof Error ? error.message : "Unknown error";
          toastHelper.error("Error", message);
        }
      } else {
        // Use the password from the form instead of generating one
        const password = formData.password;

        try {
          await signUp(formData.email, password);
          toastHelper.success(
            "Success!",
            "Account created successfully! Please check your email to verify your account."
          );
          setIsLogin(true);
        } catch (error) {
          const message = error instanceof Error ? error.message : "Unknown error";
          toastHelper.error("Error", message);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLogin,
    setIsLogin,
    formData,
    isLoading,
    handleInputChange,
    handleSubmit,
    handleSocialLogin
  };
};
