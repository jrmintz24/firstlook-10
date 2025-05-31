
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import PropertyRequestForm from "@/components/PropertyRequestForm";
import { User, LogOut, Home, HelpCircle, Building } from "lucide-react";

const Navigation = () => {
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const { user, signOut } = useAuth();
  const location = useLocation();

  const handleAuthClick = () => {
    setShowPropertyForm(true);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white/90 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              FirstLook
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                isActive('/') 
                  ? 'text-purple-600 bg-purple-50' 
                  : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
              }`}
            >
              <Home className="w-4 h-4" />
              Home
            </Link>
            <Link 
              to="/dc-buyers" 
              className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                isActive('/dc-buyers') 
                  ? 'text-purple-600 bg-purple-50' 
                  : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
              }`}
            >
              🏛️ DC Buyers
            </Link>
            <Link 
              to="/agents" 
              className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                isActive('/agents') 
                  ? 'text-purple-600 bg-purple-50' 
                  : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
              }`}
            >
              <Building className="w-4 h-4" />
              Agents
            </Link>
            <Link 
              to="/faq" 
              className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                isActive('/faq') 
                  ? 'text-purple-600 bg-purple-50' 
                  : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              FAQ
            </Link>
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3">
                <Link to="/buyer-dashboard">
                  <Button 
                    variant="ghost" 
                    className="flex items-center gap-2 text-purple-600 hover:bg-purple-50"
                  >
                    <User className="w-4 h-4" />
                    Dashboard
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  onClick={handleSignOut}
                  className="flex items-center gap-2 border-purple-200 text-purple-600 hover:bg-purple-50"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  onClick={handleAuthClick}
                  className="text-purple-600 hover:bg-purple-50"
                >
                  Sign In
                </Button>
                <Button 
                  onClick={handleAuthClick}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                >
                  Get Started
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Property Request Form Modal */}
      <PropertyRequestForm 
        isOpen={showPropertyForm}
        onClose={() => setShowPropertyForm(false)}
      />
    </nav>
  );
};

export default Navigation;
