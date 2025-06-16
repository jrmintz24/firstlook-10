
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface User {
  id: string;
  email?: string;
  user_metadata?: { user_type?: string };
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

    return (
      <div className="flex items-center space-x-3">
        <Link to={dashboardLink}>
          <Button variant="ghost" className="flex items-center gap-2 text-purple-600 hover:bg-purple-50">
            <User className="w-4 h-4" />
            Dashboard
          </Button>
        </Link>
        <Button 
          variant="outline" 
          onClick={onSignOut}
          className="flex items-center gap-2 border-purple-200 text-purple-600 hover:bg-purple-50"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="text-purple-600 hover:bg-purple-50">
            Login
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem asChild>
            <Link to="/buyer-auth?tab=login" className="w-full">
              Buyer Login
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/agent-auth?tab=login" className="w-full">
              Agent Login
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/admin-auth?tab=login" className="w-full">
              Admin Login
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Link to="/buyer-auth">
        <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
          Get Started
        </Button>
      </Link>
    </div>
  );
};

export default NavigationAuth;
