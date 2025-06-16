
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface AuthFormData {
  email: string;
  password: string;
  firstName: string;
  phone: string;
  licenseNumber: string;
}

const getRedirectUrl = () => {
  return window.location.origin;
};

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
  const { toast } = useToast();
  const { signUp, signIn, signInWithProvider } = useAuth();

  const handleSocialLogin = async (
    provider: 'google' | 'github' | 'discord' | 'facebook'
  ) => {
    setIsLoading(true);
    try {
      await signInWithProvider(provider);
      toast({
        title: "Success!",
        description: `Signed in with ${provider === 'google' ? 'Google' : 'Facebook'}!`
      });
      onSuccess();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong with social login";
      toast({
        title: "Error",
        description: message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getDashboardRedirect = (userType: string) => {
    switch (userType) {
      case 'agent':
        return '/agent-dashboard';
      case 'admin':
        return '/admin-dashboard';
      default:
        return '/buyer-dashboard';
    }
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
          
          // Wait a moment for the session to be established
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const { data } = await supabase.auth.getUser();
          if (data.user) {
            const type = (data.user.user_metadata?.user_type as string) ?? userType;
            const redirectPath = getDashboardRedirect(type);
            
            toast({
              title: "Success!",
              description: "Welcome back!"
            });
            
            onSuccess();
            
            // Use window.location.href for reliable redirect
            setTimeout(() => {
              window.location.href = `${getRedirectUrl()}${redirectPath}`;
            }, 100);
          }
        } catch (error) {
          const message = error instanceof Error ? error.message : "Unknown error";
          toast({
            title: "Error",
            description: message,
            variant: "destructive"
          });
        }
      } else {
        try {
          await signUp(formData.email, formData.password);
          toast({
            title: "Success!",
            description: "Account created successfully! Please check your email to verify your account."
          });
          setIsLogin(true);
        } catch (error) {
          const message = error instanceof Error ? error.message : "Unknown error";
          toast({
            title: "Error",
            description: message,
            variant: "destructive"
          });
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
