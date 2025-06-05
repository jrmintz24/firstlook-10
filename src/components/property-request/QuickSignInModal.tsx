
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthForm } from "@/hooks/useAuthForm";
import SignupForm from "@/components/auth/SignupForm";
import LoginForm from "@/components/auth/LoginForm";

interface QuickSignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  defaultUserType?: 'buyer' | 'agent';
  defaultTab?: 'login' | 'signup';
}

const QuickSignInModal = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  defaultUserType = 'buyer',
  defaultTab = 'signup'
}: QuickSignInModalProps) => {
  const [userType, setUserType] = useState<'buyer' | 'agent'>(defaultUserType);
  const { toast } = useToast();
  const { user } = useAuth();

  const buyerAuth = useAuthForm('buyer', () => {
    onSuccess();
    onClose();
  });

  const agentAuth = useAuthForm('agent', () => {
    onSuccess();
    onClose();
  });

  const currentAuth = userType === 'buyer' ? buyerAuth : agentAuth;

  // Set the initial login state based on defaultTab
  if (currentAuth.isLogin !== (defaultTab === 'login')) {
    currentAuth.setIsLogin(defaultTab === 'login');
  }

  // Close modal if user is authenticated
  if (user) {
    onClose();
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-slate-50 to-purple-50">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Welcome to FirstLook
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* User Type Toggle */}
          <div className="flex justify-center">
            <div className="bg-white p-1 rounded-lg shadow-inner">
              <Button
                variant={userType === 'buyer' ? 'default' : 'ghost'}
                onClick={() => setUserType('buyer')}
                className={userType === 'buyer' ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' : 'text-gray-600'}
              >
                Home Buyer
              </Button>
              <Button
                variant={userType === 'agent' ? 'default' : 'ghost'}
                onClick={() => setUserType('agent')}
                className={userType === 'agent' ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' : 'text-gray-600'}
              >
                Real Estate Agent
              </Button>
            </div>
          </div>

          <Tabs value={currentAuth.isLogin ? "login" : "signup"} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger 
                value="login" 
                onClick={() => currentAuth.setIsLogin(true)}
              >
                Sign In
              </TabsTrigger>
              <TabsTrigger 
                value="signup" 
                onClick={() => currentAuth.setIsLogin(false)}
              >
                Sign Up
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <LoginForm
                email={currentAuth.formData.email}
                password={currentAuth.formData.password}
                isLoading={currentAuth.isLoading}
                onInputChange={currentAuth.handleInputChange}
                onSubmit={currentAuth.handleSubmit}
                onSocialLogin={currentAuth.handleSocialLogin}
              />
            </TabsContent>
            
            <TabsContent value="signup">
              <SignupForm
                userType={userType}
                firstName={currentAuth.formData.firstName}
                email={currentAuth.formData.email}
                phone={currentAuth.formData.phone}
                licenseNumber={currentAuth.formData.licenseNumber}
                isLoading={currentAuth.isLoading}
                onInputChange={currentAuth.handleInputChange}
                onSubmit={currentAuth.handleSubmit}
                onSocialLogin={currentAuth.handleSocialLogin}
              />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuickSignInModal;
