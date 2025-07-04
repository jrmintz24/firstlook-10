
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface QuickSignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const QuickSignInModal = ({ isOpen, onClose, onSuccess }: QuickSignInModalProps) => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp, signIn, user } = useAuth();
  const { toast } = useToast();

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
        
        console.log('Sign up successful, checking if user is immediately authenticated...');
        
        // Wait a moment for auth state to potentially update
        setTimeout(() => {
          if (user) {
            // User is authenticated immediately (email confirmation disabled)
            console.log('User authenticated after signup');
            toast({
              title: "Account Created!",
              description: "Welcome to FirstLook! Processing your tour request...",
            });
            
            onClose();
            setTimeout(() => {
              console.log('Calling onSuccess callback after signup');
              onSuccess();
            }, 500);
          } else {
            // User needs to confirm email
            console.log('Signup successful but email confirmation required');
            toast({
              title: "Account Created!",
              description: "Please check your email to confirm your account, then sign in below.",
            });
            
            // Switch to sign in mode
            setIsSignUp(false);
            setPassword(''); // Clear password for security
          }
          setLoading(false);
        }, 1000);
        
      } else {
        console.log('Quick sign in attempt for:', email);
        const result = await signIn(email, password);
        
        if (result.error) {
          throw result.error;
        }
        
        console.log('Sign in successful');
        
        toast({
          title: "Welcome Back!",
          description: "Processing your tour request...",
        });
        
        // Close modal immediately for sign in
        onClose();
        
        // Small delay to allow auth state to settle, then call success callback
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
      } else if (error.message?.includes('Email not confirmed')) {
        errorMessage = "Please check your email and click the confirmation link, then try signing in again.";
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
            {isSignUp ? "Create Account to Continue" : "Sign In to Continue"}
          </DialogTitle>
          <DialogDescription>
            {isSignUp 
              ? "Create an account to complete your tour request" 
              : "Sign in to your existing account to continue"
            }
          </DialogDescription>
        </DialogHeader>

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
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Processing...' : (isSignUp ? 'Create Account & Book Tour' : 'Sign In & Book Tour')}
            </Button>
            
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => setIsSignUp(!isSignUp)}
              disabled={loading}
              className="w-full"
            >
              {isSignUp ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default QuickSignInModal;
