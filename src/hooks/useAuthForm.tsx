
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/Auth0AuthContext";
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
  const { signIn, signUp } = useAuth();
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
        console.log('useAuthForm: Attempting login for:', formData.email);
        
        const result = await signIn(formData.email, formData.password);
        
        if (result.error) {
          throw result.error;
        }
        
        console.log('useAuthForm: Login successful');
        
        toast({
          title: "Success!",
          description: "Welcome back!"
        });
        
        // Call success callback - this will let natural auth flow handle navigation
        onSuccess();
        
      } else {
        console.log('useAuthForm: Attempting signup for user type:', userType);
        
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

        console.log('useAuthForm: Signing up with metadata:', metadata);

        const result = await signUp(formData.email, formData.password, metadata);
        
        if (result.error) {
          throw result.error;
        }
        
        console.log('useAuthForm: Signup successful for user type:', userType);
        
        toast({
          title: "Welcome to FirstLook!",
          description: "Account created successfully! Setting up your dashboard..."
        });
        
        // Call success callback - this will let natural auth flow handle navigation
        onSuccess();
      }
    } catch (error: any) {
      console.error('useAuthForm: Auth error:', error);
      
      let message = error.message || "Unknown error";
      
      // Handle specific error cases
      if (message.includes('User already registered')) {
        message = "An account with this email already exists. Try signing in instead.";
        setIsLogin(true);
      } else if (message.includes('Invalid login credentials')) {
        message = "Invalid email or password. Please check your credentials.";
      } else if (message.includes('Email not confirmed')) {
        message = "Please check your email and click the confirmation link before signing in.";
      }
      
      toast({
        title: "Error",
        description: message,
        variant: "destructive"
      });
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
