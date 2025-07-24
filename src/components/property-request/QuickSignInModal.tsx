
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth0 } from "@auth0/auth0-react";
import { useToast } from "@/hooks/use-toast";

interface QuickSignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  propertyAddress?: string;
}

const QuickSignInModal = ({ isOpen, onClose, onSuccess, propertyAddress }: QuickSignInModalProps) => {
  const { loginWithRedirect, isLoading } = useAuth0();
  const { toast } = useToast();

  const handleAuth0Login = async () => {
    try {
      // Store tour request data before Auth0 redirect
      localStorage.setItem('newUserFromPropertyRequest', 'true');
      
      // Close modal before redirect
      onClose();
      
      await loginWithRedirect({
        appState: {
          returnTo: '/buyer-dashboard',
          tourBooking: true
        }
      });
    } catch (error: any) {
      console.error('Auth0 login error:', error);
      
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
            You'll be redirected to our secure login page to complete your tour request
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

        <div className="space-y-4">
          <Button 
            onClick={handleAuth0Login}
            disabled={isLoading}
            className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 mr-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Redirecting...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm1 1v12h12V5H4z" clipRule="evenodd" />
                  <path fillRule="evenodd" d="M10 7a3 3 0 100 6 3 3 0 000-6zM5 10a5 5 0 1110 0 5 5 0 01-10 0z" clipRule="evenodd" />
                </svg>
                Continue to Secure Login
              </>
            )}
          </Button>
          
          <p className="text-xs text-center text-gray-500">
            Secure authentication powered by Auth0 • Supports Google, email, and more
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuickSignInModal;
