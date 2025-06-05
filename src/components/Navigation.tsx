import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, LogOut, Menu, X } from "lucide-react";
import { useNavigation } from "@/hooks/useNavigation";

const Navigation = () => {
  const {
    user,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    handleHowItWorksClick,
    handleSignOut,
    closeMobileMenu
  } = useNavigation();

  return (
    <nav className="bg-white/90 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2" onClick={closeMobileMenu}>
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              FirstLook
            </span>
          </Link>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                className="text-gray-700 hover:text-purple-600 hover:bg-purple-50 font-medium px-4 py-2 transition-colors"
                onClick={handleHowItWorksClick}
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

            {/* Auth Section */}
            <div className="flex items-center space-x-3">
              {user ? (
                <div className="flex items-center space-x-3">
                  <Link to="/buyer-dashboard">
                    <Button variant="ghost" className="flex items-center gap-2 text-purple-600 hover:bg-purple-50">
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
                  <Link to="/buyer-auth?tab=login">
                    <Button variant="ghost" className="text-purple-600 hover:bg-purple-50">
                      Login
                    </Button>
                  </Link>
                  <Link to="/buyer-auth">
                    <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-purple-100 py-4">
            <div className="flex flex-col space-y-2">
              <Button 
                variant="ghost" 
                className="text-gray-700 hover:text-purple-600 hover:bg-purple-50 font-medium px-4 py-2 transition-colors justify-start"
                onClick={handleHowItWorksClick}
              >
                How It Works
              </Button>
              <Link to="/subscriptions" onClick={closeMobileMenu}>
                <Button 
                  variant="ghost" 
                  className="text-gray-700 hover:text-purple-600 hover:bg-purple-50 font-medium px-4 py-2 transition-colors justify-start w-full"
                >
                  Pricing
                </Button>
              </Link>
              <Link to="/blog" onClick={closeMobileMenu}>
                <Button 
                  variant="ghost" 
                  className="text-gray-700 hover:text-purple-600 hover:bg-purple-50 font-medium px-4 py-2 transition-colors justify-start w-full"
                >
                  Blog
                </Button>
              </Link>
              <Link to="/agents" onClick={closeMobileMenu}>
                <Button 
                  variant="ghost" 
                  className="text-gray-700 hover:text-purple-600 hover:bg-purple-50 font-medium px-4 py-2 transition-colors justify-start w-full"
                >
                  For Agents
                </Button>
              </Link>
              <Link to="/agent-auth?tab=login" onClick={closeMobileMenu}>
                <Button 
                  variant="ghost" 
                  className="text-gray-500 hover:text-purple-600 hover:bg-purple-50 px-4 py-2 transition-colors justify-start w-full"
                >
                  Agent Login
                </Button>
              </Link>
              
              {/* Mobile Auth Section */}
              <div className="border-t border-purple-100 pt-4 mt-4">
                {user ? (
                  <div className="flex flex-col space-y-2">
                    <Link to="/buyer-dashboard" onClick={closeMobileMenu}>
                      <Button 
                        variant="ghost" 
                        className="flex items-center gap-2 text-purple-600 hover:bg-purple-50 justify-start w-full"
                      >
                        <User className="w-4 h-4" />
                        Dashboard
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        handleSignOut();
                        closeMobileMenu();
                      }}
                      className="flex items-center gap-2 border-purple-200 text-purple-600 hover:bg-purple-50 justify-start w-full"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <Link to="/buyer-auth?tab=login" onClick={closeMobileMenu}>
                      <Button 
                        variant="ghost" 
                        className="text-purple-600 hover:bg-purple-50 justify-start w-full"
                      >
                        Login
                      </Button>
                    </Link>
                    <Link to="/buyer-auth" onClick={closeMobileMenu}>
                      <Button 
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white justify-start w-full"
                      >
                        Get Started
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
