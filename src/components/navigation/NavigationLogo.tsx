
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface NavigationLogoProps {
  onLogoClick: () => void;
}

const NavigationLogo = ({ onLogoClick }: NavigationLogoProps) => {
  const { user } = useAuth();

  // Determine the correct dashboard link based on user type
  const getDashboardLink = () => {
    if (!user) return "/";
    
    const userType = user.user_metadata?.user_type;
    console.log('NavigationLogo user type:', userType);
    
    // Default to buyer dashboard for undefined user types (new users)
    switch (userType) {
      case 'agent':
        return '/agent-dashboard';
      case 'admin':
        return '/admin-dashboard';
      case 'buyer':
      default:
        return '/buyer-dashboard';
    }
  };

  return (
    <Link to={getDashboardLink()} className="flex items-center space-x-2" onClick={onLogoClick}>
      <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
        <span className="text-white font-bold text-lg">F</span>
      </div>
      <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
        FirstLook
      </span>
    </Link>
  );
};

export default NavigationLogo;
