
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { signInWithProvider } from "@/services/authService";
import { Separator } from "@/components/ui/separator";
import { Auth0GoogleButton } from "@/components/Auth0GoogleButton";

interface QuickSignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  propertyAddress?: string;
}

const QuickSignInModal = ({ isOpen, onClose, onSuccess, propertyAddress }: QuickSignInModalProps) => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);
  const { signUp, signIn, user } = useAuth();
  const { toast } = useToast();

  // Watch for user authentication after signup
  useEffect(() => {
    if (user && loading && isSignUp) {
      console.log('User authenticated after signup');
      setLoading(false);
      
      toast({
        title: "Account Created!",
        description: "Welcome to FirstLook! Processing your tour request...",
      });
      
      onClose();
      setTimeout(() => {
        console.log('Calling onSuccess callback after signup');
        onSuccess();
      }, 500);
    }
  }, [user, loading, isSignUp, onClose, onSuccess, toast]);

  const handleGoogleLogin = async () => {
    setSocialLoading(true);
    
    try {
      console.log('Starting Google OAuth for tour booking');
      
      // Store tour request data before OAuth redirect
      localStorage.setItem('newUserFromPropertyRequest', 'true');
      
      const { error } = await signInWithProvider('google', 'buyer');
      
      if (error) {
        throw error;
      }
      
      // OAuth will redirect, so we don't reach this point unless there's an error
    } catch (error: any) {
      console.error('Google OAuth error:', error);
      setSocialLoading(false);
      
      toast({
        title: "Sign-in Error",
        description: "Failed to sign in with Google. Please try again or use email.",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        console.log('Quick sign up attempt for:', email);
        
        // Store flag to indicate this is a new user from property request
        localStorage.setItem('newUserFromPropertyRequest', 'true');
        
        const result = await signUp(email, password);
        
        if (result.error) {
          throw result.error;
        }
        
        console.log('Sign up successful, waiting for auth state update...');
        // The useEffect above will handle the success case when user becomes authenticated
        
      } else {
        console.log('Quick sign in attempt for:', email);
        const result = await signIn(email, password);
        
        if (result.error) {
          throw result.error;
        }
        
        console.log('Sign in successful');
        setLoading(false);
        
        toast({
          title: "Welcome Back!",
          description: "Processing your tour request...",
        });
        
        onClose();
        setTimeout(() => {
          console.log('Calling onSuccess callback after sign in');
          onSuccess();
        }, 500);
      }
      
    } catch (error: any) {
      console.error('Auth error:', error);
      setLoading(false);
      
      let errorMessage = error.message || "Failed to authenticate. Please try again.";
      
      // Handle specific error cases
      if (error.message?.includes('User already registered')) {
        errorMessage = "An account with this email already exists. Try signing in instead.";
        setIsSignUp(false);
      } else if (error.message?.includes('Invalid login credentials')) {
        errorMessage = "Invalid email or password. Please check your credentials.";
      }
      
      toast({
        title: "Authentication Error",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isSignUp ? "Create Account to Continue" : "Welcome Back!"}
          </DialogTitle>
          <DialogDescription>
            {isSignUp 
              ? "Get started in seconds to complete your tour request" 
              : "Sign in to continue with your tour booking"
            }
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

        {/* Auth0 Google Sign-In */}
        <Auth0GoogleButton 
          onSuccess={onSuccess}
          propertyAddress={propertyAddress}
        />

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with email
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={loading}
              minLength={6}
            />
          </div>

          <div className="flex flex-col gap-3">
            <Button 
              type="submit" 
              disabled={loading || socialLoading}
              className="w-full h-11 bg-black hover:bg-gray-800 text-white"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-gray-300 border-t-white" />
                  Processing...
                </>
              ) : (
                isSignUp ? 'Create Account & Book Tour' : 'Sign In & Book Tour'
              )}
            </Button>
            
            <div className="text-center">
              <Button 
                type="button" 
                variant="link" 
                onClick={() => setIsSignUp(!isSignUp)}
                disabled={loading || socialLoading}
                className="text-sm text-muted-foreground hover:text-foreground p-0 h-auto"
              >
                {isSignUp ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default QuickSignInModal;
