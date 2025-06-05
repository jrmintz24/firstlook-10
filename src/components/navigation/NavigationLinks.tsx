
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface NavigationLinksProps {
  onHowItWorksClick: (e: React.MouseEvent) => void;
}

const NavigationLinks = ({ onHowItWorksClick }: NavigationLinksProps) => {
  return (
    <div className="flex items-center space-x-4">
      <Button 
        variant="ghost" 
        className="text-gray-700 hover:text-purple-600 hover:bg-purple-50 font-medium px-4 py-2 transition-colors"
        onClick={onHowItWorksClick}
      >
        How It Works
      </Button>
      <Link to="/subscriptions">
        <Button variant="ghost" className="text-gray-700 hover:text-purple-600 hover:bg-purple-50 font-medium px-4 py-2 transition-colors">
          Pricing
        </Button>
      </Link>
      <Link to="/blog">
        <Button variant="ghost" className="text-gray-700 hover:text-purple-600 hover:bg-purple-50 font-medium px-4 py-2 transition-colors">
          Blog
        </Button>
      </Link>
      <Link to="/agents">
        <Button variant="ghost" className="text-gray-700 hover:text-purple-600 hover:bg-purple-50 font-medium px-4 py-2 transition-colors">
          For Agents
        </Button>
      </Link>
      <Link to="/agent-auth?tab=login">
        <Button variant="ghost" className="text-xs text-gray-500 hover:text-purple-600 hover:bg-purple-50 px-2 py-1 transition-colors">
          Agent Login
        </Button>
      </Link>
    </div>
  );
};

export default NavigationLinks;
