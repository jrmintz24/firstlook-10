
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { useAuth } from "@/contexts/Auth0AuthContext";

interface RedesignedDashboardHeaderProps {
  displayName: string;
  unreadCount?: number;
}

const RedesignedDashboardHeader = ({ displayName, unreadCount = 0 }: RedesignedDashboardHeaderProps) => {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm shadow-sm border-b border-gray-200/50">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Greeting */}
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
              Hello, {displayName}! 👋
            </h1>
          </div>

          {/* Center: Logo (optional) */}
          <div className="hidden md:block">
            <Link to="/" className="text-xl font-light bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              FirstLook
            </Link>
          </div>

          {/* Right: Notifications & Sign Out */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-medium px-1.5 py-0.5 rounded-full min-w-[1.2rem] h-5 flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Button>
            </div>
            
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RedesignedDashboardHeader;
