
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
    <div className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-3 sm:px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <Link to="/" className="text-xl sm:text-2xl font-semibold text-black">
              FirstLook
            </Link>
            <p className="text-gray-600 mt-1 font-medium text-sm sm:text-base">
              {userType === 'agent' ? 'Agent Dashboard' : 'Dashboard'}
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium border ${
              userType === 'agent' ? 'bg-white border-gray-300 text-gray-700' : 'bg-white border-gray-300 text-gray-700'
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
                className="bg-black hover:bg-gray-800 text-white font-medium"
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
