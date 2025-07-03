
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
        
        // Wait a bit for auth state to update
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const { data } = await supabase.auth.getUser();
        if (data.user) {
          const actualUserType = data.user.user_metadata?.user_type || userType;
          const redirectPath = getDashboardRedirect(actualUserType);
          
          console.log('useAuthForm: Login successful, user type:', actualUserType, 'redirecting to:', redirectPath);
          
          toast({
            title: "Success!",
            description: "Welcome back!"
          });
          
          onSuccess();
          
          // Use React Router navigate with replace to prevent back navigation issues
          navigate(redirectPath, { replace: true });
        }
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
        
        // Check if user is now authenticated (due to our improved signUp flow)
        const { data } = await supabase.auth.getUser();
        if (data.user) {
          const actualUserType = data.user.user_metadata?.user_type || userType;
          const redirectPath = getDashboardRedirect(actualUserType);
          
          console.log('useAuthForm: User authenticated after signup, redirecting to:', redirectPath);
          
          toast({
            title: "Welcome to FirstLook!",
            description: "Account created successfully! Redirecting to your dashboard..."
          });
          
          onSuccess();
          
          // Navigate to dashboard
          navigate(redirectPath, { replace: true });
        } else {
          // Fallback if immediate authentication didn't work
          toast({
            title: "Account Created!",
            description: userType === 'agent' 
              ? "Agent account created! You can now sign in."
              : "Account created successfully! You can now sign in."
          });
          
          // Switch to login mode for manual sign in
          setIsLogin(true);
        }
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
