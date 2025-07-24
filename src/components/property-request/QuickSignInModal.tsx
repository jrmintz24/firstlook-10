
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Auth0GoogleButton } from "@/components/Auth0GoogleButton";

interface QuickSignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  propertyAddress?: string;
}

const QuickSignInModal = ({ isOpen, onClose, onSuccess, propertyAddress }: QuickSignInModalProps) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginWithRedirect, isLoading } = useAuth0();
  const { toast } = useToast();

  const handleAuth0EmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Store tour request data before Auth0 redirect
      localStorage.setItem('newUserFromPropertyRequest', 'true');
      
      await loginWithRedirect({
        authorizationParams: {
          login_hint: email
        },
        appState: {
          returnTo: '/buyer-dashboard',
          tourBooking: true
        }
      });
    } catch (error: any) {
      console.error('Auth0 email auth error:', error);
      setLoading(false);
      
      toast({
        title: "Sign-in Error",
        description: "Failed to authenticate. Please try again.",
        variant: "destructive"
      });
    }
  };


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Sign In to Continue
          </DialogTitle>
          <DialogDescription>
            Choose your preferred sign-in method to complete your tour request
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

        <form onSubmit={handleAuth0EmailAuth} className="space-y-4">
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


          <div className="flex flex-col gap-3">
            <Button 
              type="submit" 
              disabled={loading || isLoading}
              className="w-full h-11 bg-black hover:bg-gray-800 text-white"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-gray-300 border-t-white" />
                  Redirecting...
                </>
              ) : (
                'Continue with Email'
              )}
            </Button>
            
            <p className="text-xs text-center text-gray-500">
              Auth0 will handle sign up or sign in for you
            </p>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default QuickSignInModal;
