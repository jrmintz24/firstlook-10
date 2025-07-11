
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface MobileNavigationProps {
  isOpen: boolean;
  user: SupabaseUser | null;
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
        <Link to="/search" onClick={onMenuItemClick}>
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
                  onSignOut();
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
              <Link to="/buyer-auth?tab=login" onClick={onMenuItemClick}>
                <Button 
                  variant="ghost" 
                  className="text-purple-600 hover:bg-purple-50 justify-start w-full py-3 px-4"
                >
                  Login
                </Button>
              </Link>
              <Link to="/buyer-auth" onClick={onMenuItemClick}>
                <Button 
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white justify-start w-full py-3 px-4"
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
