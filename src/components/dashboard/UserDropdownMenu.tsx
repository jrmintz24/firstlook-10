
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, FileText, Settings, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface UserDropdownMenuProps {
  displayName: string;
  onSignOut?: () => void; // Make optional for backward compatibility
  showProfileLink?: boolean;
  showOffersLink?: boolean;
}

const UserDropdownMenu = ({ 
  displayName, 
  onSignOut,
  showProfileLink = true,
  showOffersLink = true
}: UserDropdownMenuProps) => {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      if (onSignOut) {
        onSignOut();
      } else {
        await signOut();
      }
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 text-purple-600 hover:bg-purple-50">
          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-purple-600" />
          </div>
          <span className="hidden sm:block">{displayName}</span>
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {showProfileLink && (
          <DropdownMenuItem asChild>
            <Link to="/profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Profile & Settings
            </Link>
          </DropdownMenuItem>
        )}
        {showOffersLink && (
          <DropdownMenuItem asChild>
            <Link to="/my-offers" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              My Offers
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="flex items-center gap-2 text-red-600">
          <LogOut className="w-4 h-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdownMenu;
