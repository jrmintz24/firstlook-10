
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export const useNavigation = () => {
  const { user, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      // Use React Router navigate instead of window.location.href
      navigate("/", { replace: true });
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
