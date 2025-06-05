
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export const useNavigation = () => {
  const { user, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
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
