
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import PropertyRequestForm from "@/components/PropertyRequestForm";
import { User, LogOut } from "lucide-react";

const Navigation = () => {
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const { user, signOut } = useAuth();

  const handleAuthClick = () => {
    setShowPropertyForm(true);
  };

  const handleSignOut = async () => {
    await signOut();
  };

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
