
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import QuickSignInModal from "@/components/property-request/QuickSignInModal";
import { User, LogOut } from "lucide-react";

const Navigation = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [modalDefaultTab, setModalDefaultTab] = useState<'login' | 'signup'>('signup');
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignInClick = () => {
    setModalDefaultTab('login');
    setShowAuthModal(true);
  };

  const handleGetStartedClick = () => {
    setModalDefaultTab('signup');
    setShowAuthModal(true);
  };

  const handleHowItWorksClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (location.pathname === '/') {
      // If on homepage, scroll to section
      const element = document.getElementById('how-it-works');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If on different page, navigate to homepage and then scroll
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById('how-it-works');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
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

          {/* Right Side Navigation */}
          <div className="flex items-center space-x-4">
            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-4">
              <Button 
                variant="ghost" 
                className="text-gray-700 hover:text-purple-600 hover:bg-purple-50 font-medium px-4 py-2 transition-colors"
                onClick={handleHowItWorksClick}
              >
                How It Works
              </Button>
              <Link to="/subscriptions">
                <Button 
                  variant="ghost" 
                  className="text-gray-700 hover:text-purple-600 hover:bg-purple-50 font-medium px-4 py-2 transition-colors"
                >
                  Pricing
                </Button>
              </Link>
              <Link to="/blog">
                <Button 
                  variant="ghost" 
                  className="text-gray-700 hover:text-purple-600 hover:bg-purple-50 font-medium px-4 py-2 transition-colors"
                >
                  Blog
                </Button>
              </Link>
              <Link to="/agents">
                <Button 
                  variant="ghost" 
                  className="text-gray-700 hover:text-purple-600 hover:bg-purple-50 font-medium px-4 py-2 transition-colors"
                >
                  Join as Showing Partner
                </Button>
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
                    onClick={handleSignInClick}
                    className="text-purple-600 hover:bg-purple-50"
                  >
                    Login
                  </Button>
                  <Button 
                    onClick={handleGetStartedClick}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                  >
                    Get Started
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Sign-In Modal */}
      <QuickSignInModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
        defaultTab={modalDefaultTab}
      />
    </nav>
  );
};

export default Navigation;
