
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthForm } from "@/hooks/useAuthForm";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  userType: 'buyer' | 'agent';
}

const AuthModal = ({ isOpen, onClose, userType }: AuthModalProps) => {
  const {
    isLogin,
    setIsLogin,
    formData,
    isLoading,
    handleInputChange,
    handleSubmit,
    handleSocialLogin
  } = useAuthForm(userType, onClose);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 border border-purple-200">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-slate-800 via-purple-700 to-blue-600 bg-clip-text text-transparent">
            {userType === 'buyer' ? '🏠' : '🏢'} 
            {userType === 'buyer' ? 'Homebuyer' : 'Showing Partner'} Account
          </DialogTitle>
          <DialogDescription className="text-lg text-gray-600">
            {userType === 'buyer' 
              ? 'Sign in to continue with your tour request'
              : 'Join our network of licensed showing partners'
            }
          </DialogDescription>
        </DialogHeader>

        <Tabs value={isLogin ? "login" : "signup"} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/60 backdrop-blur-sm">
            <TabsTrigger 
              value="login" 
              onClick={() => setIsLogin(true)}
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white"
            >
              Sign In
            </TabsTrigger>
            <TabsTrigger 
              value="signup" 
              onClick={() => setIsLogin(false)}
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white"
            >
              Sign Up
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <LoginForm
              email={formData.email}
              password={formData.password}
              isLoading={isLoading}
              onInputChange={handleInputChange}
              onSubmit={handleSubmit}
              onSocialLogin={handleSocialLogin}
            />
          </TabsContent>

          <TabsContent value="signup">
            <SignupForm
              userType={userType}
              firstName={formData.firstName}
              email={formData.email}
              phone={formData.phone}
              licenseNumber={formData.licenseNumber}
              isLoading={isLoading}
              onInputChange={handleInputChange}
              onSubmit={handleSubmit}
              onSocialLogin={handleSocialLogin}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
