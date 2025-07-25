
import { useNavigation } from "@/hooks/useNavigation";
import NavigationLogo from "./navigation/NavigationLogo";
import NavigationLinks from "./navigation/NavigationLinks";
import NavigationAuth from "./navigation/NavigationAuth";
import MobileNavigation from "./navigation/MobileNavigation";
import MobileMenuButton from "./navigation/MobileMenuButton";

const Navigation = () => {
  const {
    user,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    handleSignOut,
    closeMobileMenu
  } = useNavigation();

  return (
    <nav className="bg-white/90 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavigationLogo onLogoClick={closeMobileMenu} />

          {/* Mobile menu button */}
          <MobileMenuButton 
            isOpen={isMobileMenuOpen} 
            onToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <NavigationLinks />

            {/* Auth Section */}
            <NavigationAuth />
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <MobileNavigation 
          isOpen={isMobileMenuOpen}
          onMenuItemClick={closeMobileMenu}
        />
      </div>
    </nav>
  );
};

export default Navigation;
