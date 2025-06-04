
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";
import { Link } from "react-router-dom";

interface AgentDashboardHeaderProps {
  displayName: string;
}

const AgentDashboardHeader = ({ displayName }: AgentDashboardHeaderProps) => {
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              FirstLook
            </Link>
            <p className="text-gray-600 mt-1">Agent Dashboard</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge className="bg-purple-100 text-purple-800">Agent</Badge>
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

export default AgentDashboardHeader;
