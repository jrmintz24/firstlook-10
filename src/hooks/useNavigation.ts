
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useMessages } from "@/hooks/useMessages";

export const useNavigation = () => {
  const { user, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  // Get unread count for notifications
  const { unreadCount } = useMessages(user?.id || null);

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
    closeMobileMenu,
    unreadCount
  };
};
