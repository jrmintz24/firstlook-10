
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, User } from "lucide-react";

interface DashboardHeaderProps {
  displayName: string;
  onRequestShowing: () => void;
}

const DashboardHeader = ({ displayName, onRequestShowing }: DashboardHeaderProps) => {
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              FirstLook
            </Link>
            <p className="text-gray-600 mt-1">Your Dashboard</p>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              onClick={onRequestShowing}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Request Showing
            </Button>
            <div className="flex items-center gap-2 text-gray-600">
              <User className="h-5 w-5" />
              <span>Welcome, {displayName}!</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
