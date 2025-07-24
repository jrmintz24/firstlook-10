
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import UserDropdownMenu from "@/components/dashboard/UserDropdownMenu";
import { useAuth0 } from "@auth0/auth0-react";

interface User {
  id: string;
  email?: string;
  user_metadata?: { 
    user_type?: string;
    first_name?: string;
    last_name?: string;
  };
}

interface NavigationAuthProps {
  user: User | null;
  onSignOut: () => void;
}

const NavigationAuth = ({ user, onSignOut }: NavigationAuthProps) => {
  const { loginWithRedirect } = useAuth0();
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
          onSignOut={onSignOut}
          showProfileLink={true}
          showOffersLink={userType === 'buyer'}
        />
      </div>
    );
  }

  const handleAuth0Login = () => {
    loginWithRedirect({
      appState: { returnTo: window.location.pathname }
    });
  };

  return (
    <div className="flex items-center space-x-2">
      <Button 
        variant="ghost" 
        className="text-purple-600 hover:bg-purple-50"
        onClick={handleAuth0Login}
      >
        Login
      </Button>
      <Button 
        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
        onClick={handleAuth0Login}
      >
        Get Started
      </Button>
    </div>
  );
};

export default NavigationAuth;
