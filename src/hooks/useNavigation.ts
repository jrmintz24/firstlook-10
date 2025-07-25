
import { useState } from "react";
import { useAuth } from "@/contexts/SimpleAuth0Context";
import { useNavigate } from "react-router-dom";

export const useNavigation = () => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await logout();
      // Auth0 logout will handle the redirect
    } catch (error) {
      console.error("Error signing out:", error);
      // If there's an error, still try to navigate
      navigate("/", { replace: true });
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return {
    user,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    handleSignOut,
    closeMobileMenu
  };
};
