
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface AuthFormData {
  email: string;
  password: string;
  firstName: string;
  phone: string;
  licenseNumber: string;
}

export const useAuthForm = (userType: 'buyer' | 'agent', onSuccess: () => void) => {
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

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    setIsLoading(true);
    try {
      const { error } = await signInWithProvider(provider, userType);
      if (error) {
        toast({
          title: "Social Login Error",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Success!",
          description: `Signed in with ${provider === 'google' ? 'Google' : 'Facebook'}!`,
        });
        onSuccess();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong with social login",
        variant: "destructive"
      });
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
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive"
          });
        } else {
          toast({
            title: "Success!",
            description: "Welcome back!",
          });
          onSuccess();
          if (userType === 'buyer') {
            window.location.href = '/buyer-dashboard';
          }
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
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive"
          });
        } else {
          toast({
            title: "Success!",
            description: "Account created successfully! Please check your email to verify your account.",
          });
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
