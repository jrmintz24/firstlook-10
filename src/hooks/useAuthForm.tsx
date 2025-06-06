
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

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    setIsLoading(true);
    try {
      const { error } = await signInWithProvider(provider, userType);
      if (error) {
        toastHelper.error("Social Login Error", error.message);
      } else {
        toastHelper.success(
          "Success!",
          `Signed in with ${provider === 'google' ? 'Google' : 'Facebook'}!`
        );
        onSuccess();
      }
    } catch (error) {
      toastHelper.error("Error", "Something went wrong with social login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(formData.email, formData.password);
        if (error) {
          toastHelper.error("Error", error.message);
        } else {
          toastHelper.success("Success!", "Welcome back!");
          // Fetch the authenticated user to determine their role
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
        }
      } else {
        // Use the password from the form instead of generating one
        const password = formData.password;

        const metadata = {
          first_name: formData.firstName,
          last_name: '',
          phone: formData.phone,
          user_type: userType,
          ...(userType === 'agent' && { license_number: formData.licenseNumber })
        };

        const { error } = await signUp(formData.email, password, metadata);
        if (error) {
          toastHelper.error("Error", error.message);
        } else {
          toastHelper.success(
            "Success!",
            "Account created successfully! Please check your email to verify your account."
          );
          // Switch to login mode after successful signup
          setIsLogin(true);
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
