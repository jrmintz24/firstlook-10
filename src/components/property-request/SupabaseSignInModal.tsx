import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

interface SupabaseSignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  propertyAddress?: string;
}

const SupabaseSignInModal = ({ isOpen, onClose, onSuccess, propertyAddress }: SupabaseSignInModalProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("signin");
  
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        let errorDescription = "Please check your credentials and try again.";
        
        if (error.message?.includes('Invalid login credentials')) {
          errorDescription = "Invalid email or password. Please check your credentials.";
        } else if (error.message?.includes('Email not confirmed')) {
          errorDescription = "Please check your email and click the confirmation link first.";
        }
        
        toast({
          title: "Sign In Failed",
          description: errorDescription,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Welcome back!",
        description: "You've been signed in successfully.",
      });
      
      onSuccess();
      // Don't call onClose() here - let onSuccess() handle modal state
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast({
        title: "Sign In Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error, data } = await signUp(email, password, {
        user_type: 'buyer',
        first_name: firstName,
        last_name: lastName
      });
      
      if (error) {
        // Check if this is a "user already exists" error
        if (error.message?.includes('already registered') || error.message?.includes('already exists')) {
          toast({
            title: "Account Already Exists",
            description: "This email is already registered. Please sign in instead.",
          });
          setActiveTab("signin");
          return;
        }
        
        // Check if user was actually created despite the error
        if (data?.user) {
          console.log('User was created despite error:', data.user);
          toast({
            title: "Welcome!",
            description: "Your account has been created successfully!",
          });
          onSuccess();
          // Don't call onClose() here - let onSuccess() handle modal state
          return;
        }

        // Only show error if user wasn't created
        toast({
          title: "Sign Up Failed",
          description: error.message || "Please try again with different credentials.",
          variant: "destructive"
        });
        return;
      }

      // Successful signup without errors
      if (data?.user) {
        toast({
          title: "Welcome!",
          description: "Your account has been created and you're now signed in.",
        });
        onSuccess();
        // Don't call onClose() here - let onSuccess() handle modal state
      } else {
        // Fallback case
        toast({
          title: "Account Created!",
          description: "Your account has been created. You can now sign in.",
        });
        setActiveTab("signin");
        setPassword("");
      }
    } catch (error: any) {
      console.error('Sign up error:', error);
      
      // Check if this is a "user already exists" error in the catch block too
      if (error.message?.includes('already registered') || error.message?.includes('already exists')) {
        toast({
          title: "Account Already Exists",
          description: "This email is already registered. Please sign in instead.",
        });
        setActiveTab("signin");
        return;
      }
      
      toast({
        title: "Sign Up Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setFirstName("");
    setLastName("");
    setShowPassword(false);
    setIsLoading(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Sign In to Continue
          </DialogTitle>
          <DialogDescription>
            Sign in to your account to book your tour
          </DialogDescription>
          {propertyAddress && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg border">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">You're booking a tour for:</span>
              </div>
              <p className="text-sm font-medium text-gray-900 mt-1">{propertyAddress}</p>
            </div>
          )}
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin" className="space-y-4">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="signin-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="signin-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
              
              <p className="text-xs text-center text-gray-500 mt-2">
                Don't have an account? <button type="button" onClick={() => setActiveTab("signup")} className="text-blue-600 hover:underline">Sign up here</button>
              </p>
            </form>
          </TabsContent>
          
          <TabsContent value="signup" className="space-y-4">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-firstname">First Name</Label>
                  <Input
                    id="signup-firstname"
                    type="text"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-lastname">Last Name</Label>
                  <Input
                    id="signup-lastname"
                    type="text"
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
              
              <p className="text-xs text-center text-gray-500 mt-2">
                Already have an account? <button type="button" onClick={() => setActiveTab("signin")} className="text-blue-600 hover:underline">Sign in here</button>
              </p>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default SupabaseSignInModal;