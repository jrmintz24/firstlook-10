
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

interface DashboardHeaderProps {
  displayName: string;
  onRequestShowing: () => void;
  userType?: 'buyer' | 'agent';
}

const DashboardHeader = ({ displayName, onRequestShowing, userType = 'buyer' }: DashboardHeaderProps) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200/50">
      <div className="container mx-auto px-3 sm:px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <Link to="/" className="text-xl sm:text-2xl font-light bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              FirstLook
            </Link>
            <p className="text-gray-600 mt-1 font-medium text-sm sm:text-base">
              {userType === 'agent' ? 'Agent Dashboard' : 'Dashboard'}
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
              userType === 'agent' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'
            }`}>
              {userType === 'agent' ? 'Agent' : 'Buyer'}
            </div>
            <div className="hidden sm:flex items-center gap-2 text-gray-600">
              <User className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="font-medium text-sm sm:text-base">Welcome, {displayName}!</span>
            </div>
            {userType === 'buyer' && (
              <Button 
                onClick={onRequestShowing}
                size="sm"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium"
              >
                New Tour
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
