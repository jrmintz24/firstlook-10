
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Bell, Settings, User } from "lucide-react";

interface ModernHeaderProps {
  title: string;
  subtitle?: string;
  displayName: string;
  onPrimaryAction?: () => void;
  primaryActionText?: string;
  userType?: 'buyer' | 'agent' | 'admin';
  notificationCount?: number;
}

const ModernHeader = ({ 
  title, 
  subtitle,
  displayName, 
  onPrimaryAction, 
  primaryActionText,
  userType = 'buyer',
  notificationCount = 0
}: ModernHeaderProps) => {
  const getUserTypeColor = () => {
    switch (userType) {
      case 'agent': return 'bg-white text-gray-700 border-gray-300';
      case 'admin': return 'bg-white text-gray-700 border-gray-300';
      default: return 'bg-white text-gray-700 border-gray-300';
    }
  };

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-6">
          <div className="flex items-center space-x-6">
            <Link to="/" className="text-2xl font-semibold text-black">
              FirstLook
            </Link>
            <div>
              <h1 className="text-xl font-medium text-gray-900">{title}</h1>
              {subtitle && (
                <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* User Type Badge */}
            <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getUserTypeColor()}`}>
              {userType.charAt(0).toUpperCase() + userType.slice(1)}
            </div>
            
            {/* Notifications */}
            <div className="relative">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-4 h-4" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </span>
                )}
              </Button>
            </div>
            
            {/* User Info */}
            <div className="flex items-center space-x-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{displayName}</p>
                <p className="text-xs text-gray-500">Welcome back!</p>
              </div>
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-gray-600" />
              </div>
            </div>
            
            {/* Primary Action */}
            {onPrimaryAction && primaryActionText && (
              <Button onClick={onPrimaryAction} className="bg-black hover:bg-gray-800 text-white">
                {primaryActionText}
              </Button>
            )}
            
            {/* Settings */}
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernHeader;
