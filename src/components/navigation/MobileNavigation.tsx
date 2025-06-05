import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";

interface MobileNavigationProps {
  isOpen: boolean;
  user: any;
  onSignOut: () => void;
  onMenuItemClick: () => void;
}

const MobileNavigation = ({ 
  isOpen, 
  user, 
  onSignOut, 
  onMenuItemClick 
}: MobileNavigationProps) => {
  if (!isOpen) return null;

  return (
    <div className="md:hidden bg-white border-t border-purple-100 py-4">
      <div className="flex flex-col space-y-2">
        <Link to="/faq" onClick={onMenuItemClick}>
          <Button 
            variant="ghost" 
            className="text-gray-700 hover:text-purple-600 hover:bg-purple-50 font-medium px-4 py-2 transition-colors justify-start w-full"
          >
            FAQs
          </Button>
        </Link>
        <Link to="/subscriptions" onClick={onMenuItemClick}>
          <Button 
            variant="ghost" 
            className="text-gray-700 hover:text-purple-600 hover:bg-purple-50 font-medium px-4 py-2 transition-colors justify-start w-full"
          >
            Pricing
          </Button>
        </Link>
        <Link to="/blog" onClick={onMenuItemClick}>
          <Button 
            variant="ghost" 
            className="text-gray-700 hover:text-purple-600 hover:bg-purple-50 font-medium px-4 py-2 transition-colors justify-start w-full"
          >
            Blog
          </Button>
        </Link>
        <Link to="/agents" onClick={onMenuItemClick}>
          <Button 
            variant="ghost" 
            className="text-gray-700 hover:text-purple-600 hover:bg-purple-50 font-medium px-4 py-2 transition-colors justify-start w-full"
          >
            For Agents
          </Button>
        </Link>
        <Link to="/agent-auth?tab=login" onClick={onMenuItemClick}>
          <Button 
            variant="ghost" 
            className="text-gray-500 hover:text-purple-600 hover:bg-purple-50 px-4 py-2 transition-colors justify-start w-full"
          >
            Agent Login
          </Button>
        </Link>
        
        {/* Mobile Auth Section */}
        <div className="border-t border-purple-100 pt-4 mt-4">
          {user ? (
            <div className="flex flex-col space-y-2">
              <Link to="/buyer-dashboard" onClick={onMenuItemClick}>
                <Button 
                  variant="ghost" 
                  className="flex items-center gap-2 text-purple-600 hover:bg-purple-50 justify-start w-full"
                >
                  <User className="w-4 h-4" />
                  Dashboard
                </Button>
              </Link>
              <Button 
                variant="outline" 
                onClick={() => {
                  onSignOut();
                  onMenuItemClick();
                }}
                className="flex items-center gap-2 border-purple-200 text-purple-600 hover:bg-purple-50 justify-start w-full"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex flex-col space-y-2">
              <Link to="/buyer-auth?tab=login" onClick={onMenuItemClick}>
                <Button 
                  variant="ghost" 
                  className="text-purple-600 hover:bg-purple-50 justify-start w-full"
                >
                  Login
                </Button>
              </Link>
              <Link to="/buyer-auth" onClick={onMenuItemClick}>
                <Button 
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white justify-start w-full"
                >
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileNavigation;
