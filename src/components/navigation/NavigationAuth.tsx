
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import UserDropdownMenu from "@/components/dashboard/UserDropdownMenu";
import { useAuth } from "@/contexts/AuthContext";
import SupabaseSignInModal from "@/components/property-request/SupabaseSignInModal";

interface NavigationAuthProps {
  // Props are no longer needed since we get auth state from context
}

const NavigationAuth = () => {
  const { user, session, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  if (user) {
    const userType = user.user_metadata?.user_type;
    const dashboardLink = 
      userType === 'admin' 
        ? '/admin-dashboard'
        : userType === 'agent'
        ? '/agent-dashboard'
        : '/buyer-dashboard';

    // Get display name for the user - now with proper type handling
    const displayName = user.user_metadata?.first_name || 
                       user.email?.split('@')[0] || 
                       'User';

    return (
      <div className="flex items-center space-x-3">
        <Link to={dashboardLink}>
          <Button variant="ghost" className="text-purple-600 hover:bg-purple-50">
            Dashboard
          </Button>
        </Link>
        
        {/* User Dropdown Menu */}
        <UserDropdownMenu 
          displayName={displayName} 
          onSignOut={signOut}
          showProfileLink={true}
          showOffersLink={userType === 'buyer'}
        />
      </div>
    );
  }

  const handleLogin = () => {
    setShowAuthModal(true);
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    // Optionally navigate somewhere or refresh the page
  };

  return (
    <>
      <div className="flex items-center space-x-2">
        <Button 
          variant="ghost" 
          className="text-purple-600 hover:bg-purple-50"
          onClick={handleLogin}
        >
          Login
        </Button>
        <Button 
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
          onClick={handleLogin}
        >
          Get Started
        </Button>
      </div>
      
      {/* Supabase Auth Modal */}
      <SupabaseSignInModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
};

export default NavigationAuth;
