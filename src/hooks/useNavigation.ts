
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
      // Explicitly navigate to home page after sign out
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Error signing out:", error);
      // Even if there's an error, redirect to home
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
