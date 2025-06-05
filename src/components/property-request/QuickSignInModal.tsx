
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import { useAuthForm } from "@/hooks/useAuthForm";

interface QuickSignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  defaultTab?: 'signin' | 'signup';
}

const QuickSignInModal = ({ isOpen, onClose, onSuccess, defaultTab = 'signup' }: QuickSignInModalProps) => {
  const handleAuthSuccess = () => {
    onClose();
    if (onSuccess) {
      onSuccess();
    }
  };

  const loginFormHook = useAuthForm('buyer', handleAuthSuccess);
  const signupFormHook = useAuthForm('buyer', handleAuthSuccess);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Welcome to FirstLook</DialogTitle>
          <DialogDescription>
            Sign in to your account or create a new one to get started
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin" className="space-y-4">
            <LoginForm
              email={loginFormHook.formData.email}
              password={loginFormHook.formData.password}
              isLoading={loginFormHook.isLoading}
              onInputChange={loginFormHook.handleInputChange}
              onSubmit={loginFormHook.handleSubmit}
              onSocialLogin={loginFormHook.handleSocialLogin}
            />
          </TabsContent>
          
          <TabsContent value="signup" className="space-y-4">
            <SignupForm
              userType="buyer"
              firstName={signupFormHook.formData.firstName}
              email={signupFormHook.formData.email}
              phone={signupFormHook.formData.phone}
              password={signupFormHook.formData.password}
              licenseNumber={signupFormHook.formData.licenseNumber}
              isLoading={signupFormHook.isLoading}
              onInputChange={signupFormHook.handleInputChange}
              onSubmit={signupFormHook.handleSubmit}
              onSocialLogin={signupFormHook.handleSocialLogin}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default QuickSignInModal;
