
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { signInWithProvider } from "@/services/authService";
import { Separator } from "@/components/ui/separator";

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

        {/* Google Sign-In */}
        <Button
          type="button"
          variant="outline"
          className="w-full h-12 text-sm font-medium border-2 hover:bg-gray-50 transition-colors"
          onClick={handleGoogleLogin}
          disabled={loading || socialLoading}
        >
          {socialLoading ? (
            <div className="w-5 h-5 mr-3 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
          ) : (
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          )}
          Continue with Google
        </Button>

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
