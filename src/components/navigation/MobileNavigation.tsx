
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import SupabaseSignInModal from "@/components/property-request/SupabaseSignInModal";

interface MobileNavigationProps {
  isOpen: boolean;
  user?: any; // Not used anymore, kept for compatibility
  onSignOut?: () => void; // Not used anymore, kept for compatibility
  onMenuItemClick: () => void;
}

const MobileNavigation = ({ 
  isOpen, 
  onMenuItemClick 
}: MobileNavigationProps) => {
  const { user, session, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  if (!isOpen) return null;
  
  const handleLogin = () => {
    onMenuItemClick();
    setShowAuthModal(true);
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
  };

  return (
    <div className="md:hidden bg-white border-t border-purple-100 py-4 shadow-lg">
      <div className="flex flex-col space-y-2">
        <Link to="/homebuying-guide" onClick={onMenuItemClick}>
          <Button 
            variant="ghost" 
            className="text-gray-700 hover:text-purple-600 hover:bg-purple-50 font-medium px-4 py-3 transition-colors justify-start w-full text-left"
          >
            No Agent Buyer Guide
          </Button>
        </Link>
        <Link to="/listings" onClick={onMenuItemClick}>
          <Button 
            variant="ghost" 
            className="text-gray-700 hover:text-purple-600 hover:bg-purple-50 font-medium px-4 py-3 transition-colors justify-start w-full text-left"
          >
            Search
          </Button>
        </Link>
        <Link to="/faq" onClick={onMenuItemClick}>
          <Button 
            variant="ghost" 
            className="text-gray-700 hover:text-purple-600 hover:bg-purple-50 font-medium px-4 py-3 transition-colors justify-start w-full text-left"
          >
            FAQs
          </Button>
        </Link>
        <Link to="/subscriptions" onClick={onMenuItemClick}>
          <Button 
            variant="ghost" 
            className="text-gray-700 hover:text-purple-600 hover:bg-purple-50 font-medium px-4 py-3 transition-colors justify-start w-full text-left"
          >
            Plans
          </Button>
        </Link>
        
        {/* Mobile Auth Section - Enhanced touch targets */}
        <div className="border-t border-purple-100 pt-4 mt-4">
          {user ? (
            <div className="flex flex-col space-y-2">
              <Link
                to={
                  user.user_metadata?.user_type === 'agent'
                    ? '/agent-dashboard'
                    : user.user_metadata?.user_type === 'admin'
                    ? '/admin-dashboard'
                    : '/buyer-dashboard'
                }
                onClick={onMenuItemClick}
              >
                <Button
                  variant="ghost"
                  className="flex items-center gap-3 text-purple-600 hover:bg-purple-50 justify-start w-full py-3 px-4"
                >
                  <User className="w-5 h-5" />
                  Dashboard
                </Button>
              </Link>
              <Button 
                variant="outline" 
                onClick={() => {
                  signOut();
                  onMenuItemClick();
                }}
                className="flex items-center gap-3 border-purple-200 text-purple-600 hover:bg-purple-50 justify-start w-full py-3 px-4"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex flex-col space-y-2">
              <Button 
                variant="ghost" 
                className="text-purple-600 hover:bg-purple-50 justify-start w-full py-3 px-4"
                onClick={handleLogin}
              >
                Login
              </Button>
              <Button 
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white justify-start w-full py-3 px-4"
                onClick={handleLogin}
              >
                Get Started
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {/* Supabase Auth Modal */}
      <SupabaseSignInModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default MobileNavigation;
