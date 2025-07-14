
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NavigationLinks = () => {
  return (
    <div className="flex items-center space-x-4">
      <Link to="/homebuying-guide">
        <Button variant="ghost" className="text-gray-700 hover:text-purple-600 hover:bg-purple-50 font-medium px-4 py-2 transition-colors">
          No Agent Buyer Guide
        </Button>
      </Link>
      <Link to="/search">
        <Button variant="ghost" className="text-gray-700 hover:text-purple-600 hover:bg-purple-50 font-medium px-4 py-2 transition-colors">
          Search
        </Button>
      </Link>
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
          Plans
        </Button>
      </Link>
    </div>
  );
};

export default NavigationLinks;
