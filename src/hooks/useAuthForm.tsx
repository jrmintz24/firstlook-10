
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import * as authService from "@/services/authService";

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
  const { toast } = useToast();
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSocialLogin = async (
    provider: 'google' | 'facebook'
  ) => {
    setIsLoading(true);
    try {
      await authService.signInWithProvider(provider, userType);
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
          
          // Wait a bit for auth state to update
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const { data } = await supabase.auth.getUser();
          if (data.user) {
            const type = (data.user.user_metadata?.user_type as string) ?? userType;
            const redirectPath = getDashboardRedirect(type);
            
            console.log('useAuthForm - Login successful, redirecting to:', redirectPath);
            
            toast({
              title: "Success!",
              description: "Welcome back!"
            });
            
            onSuccess();
            
            // Use React Router navigate with replace to prevent back navigation issues
            navigate(redirectPath, { replace: true });
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
          // Prepare metadata for signup
          const metadata: Record<string, unknown> & { user_type?: string } = {
            user_type: userType,
            first_name: formData.firstName,
            phone: formData.phone
          };

          // Add license number for agents
          if (userType === 'agent' && formData.licenseNumber) {
            metadata.license_number = formData.licenseNumber;
          }

          console.log('useAuthForm - Signing up with metadata:', metadata);

          await authService.signUp(formData.email, formData.password, metadata);
          
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
