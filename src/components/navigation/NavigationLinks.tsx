
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NavigationLinks = () => {
  return (
    <div className="flex items-center space-x-4">
      <Link to="/faq">
        <Button 
          variant="ghost" 
          className="text-gray-700 hover:text-purple-600 hover:bg-purple-50 font-medium px-4 py-2 transition-colors"
        >
          FAQs
        </Button>
      </Link>
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
      <Link to="/admin-auth?tab=login">
        <Button variant="ghost" className="text-xs text-gray-500 hover:text-purple-600 hover:bg-purple-50 px-2 py-1 transition-colors">
          Admin Login
        </Button>
      </Link>
    </div>
  );
};

export default NavigationLinks;
