
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import UserDropdownMenu from "@/components/dashboard/UserDropdownMenu";

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

  return (
    <div className="flex items-center space-x-2">
      <Link to="/buyer-auth?tab=login">
        <Button variant="ghost" className="text-purple-600 hover:bg-purple-50">
          Login
        </Button>
      </Link>
      <Link to="/buyer-auth">
        <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
          Get Started
        </Button>
      </Link>
    </div>
  );
};

export default NavigationAuth;
