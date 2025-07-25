
import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LucideIcon, User, Settings, LogOut, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/Auth0AuthContext";

interface DashboardTab {
  id: string;
  title: string;
  icon: LucideIcon;
  content: ReactNode;
  count?: number;
  color?: string;
}

interface UnifiedDashboardLayoutProps {
  title: string;
  subtitle?: string;
  userType: 'buyer' | 'agent';
  displayName: string;
  tabs: DashboardTab[];
  sidebar?: ReactNode;
  defaultTab?: string;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
}

const UnifiedDashboardLayout = ({
  title,
  subtitle,
  userType,
  displayName,
  tabs,
  sidebar,
  defaultTab,
  activeTab,
  onTabChange,
  primaryAction
}: UnifiedDashboardLayoutProps) => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const getUserTypeStyles = () => {
    return userType === 'agent' 
      ? 'from-blue-50 via-indigo-50/30 to-white' 
      : 'from-gray-50 via-purple-50/30 to-white';
  };

  const getUserTypeBadge = () => {
    return userType === 'agent'
      ? 'bg-blue-50 text-blue-700 border-blue-200'
      : 'bg-purple-50 text-purple-700 border-purple-200';
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getUserTypeStyles()} transition-all duration-300`}>
      {/* Enhanced Header with Animation */}
      <div className="bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200/60 sticky top-0 z-40 transition-all duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-6">
              <div className="animate-fade-in">
                <h1 className="text-xl md:text-2xl font-bold text-gray-900 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-sm text-gray-600 hidden sm:block mt-1 animate-fade-in" style={{ animationDelay: '100ms' }}>
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-4 animate-fade-in" style={{ animationDelay: '200ms' }}>
              {/* Primary Action Button - Only show for buyers */}
              {userType === 'buyer' && primaryAction && (
                <Button 
                  onClick={primaryAction.onClick}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  {primaryAction.label}
                </Button>
              )}
              
              <div className={`flex items-center gap-2 text-sm text-gray-600 px-3 py-1.5 rounded-full border transition-all duration-200 hover:shadow-md ${getUserTypeBadge()}`}>
                <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
                <span className="capitalize font-medium">{userType}</span>
              </div>

              {/* User Dropdown Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 hover:bg-gray-100">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline font-medium text-gray-900">
                      {displayName}
                    </span>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <Settings className="h-4 w-4 mr-2" />
                    Profile & Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Enhanced Main Content */}
          <div className="lg:col-span-3">
            <Tabs 
              value={activeTab || defaultTab} 
              onValueChange={onTabChange} 
              className="space-y-6"
            >
              <TabsList 
                className="grid w-full bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-xl p-1.5 shadow-sm hover:shadow-md transition-all duration-200" 
                style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}
                role="tablist"
                aria-label="Dashboard navigation"
              >
                {tabs.map((tab, index) => (
                  <TabsTrigger 
                    key={tab.id}
                    value={tab.id} 
                    className="data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-50/80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    style={{ animationDelay: `${index * 50}ms` }}
                    role="tab"
                    aria-selected={activeTab === tab.id}
                  >
                    <div className="flex items-center gap-2">
                      <tab.icon className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                      <span className="hidden sm:inline">{tab.title}</span>
                      {tab.count !== undefined && tab.count > 0 && (
                        <Badge 
                          variant="secondary" 
                          className={`ml-1 text-xs px-1.5 py-0.5 transition-all duration-200 hover:scale-105 ${tab.color || 'bg-gray-100 text-gray-700'}`}
                          aria-label={`${tab.count} items`}
                        >
                          {tab.count}
                        </Badge>
                      )}
                    </div>
                  </TabsTrigger>
                ))}
              </TabsList>

              {tabs.map((tab) => (
                <TabsContent 
                  key={tab.id} 
                  value={tab.id} 
                  className="mt-6 animate-fade-in focus:outline-none"
                  role="tabpanel"
                  aria-labelledby={`tab-${tab.id}`}
                >
                  {tab.content}
                </TabsContent>
              ))}
            </Tabs>
          </div>

          {/* Enhanced Sidebar */}
          {sidebar && (
            <div className="lg:col-span-1 animate-fade-in" style={{ animationDelay: '300ms' }}>
              <div className="sticky top-24 space-y-6">
                {sidebar}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UnifiedDashboardLayout;
