
import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LucideIcon } from "lucide-react";

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
  onTabChange
}: UnifiedDashboardLayoutProps) => {
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

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getUserTypeStyles()}`}>
      {/* Unified Header */}
      <div className="bg-white/90 backdrop-blur-sm shadow-sm border-b border-gray-200/60 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-6">
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-sm text-gray-600 hidden sm:block">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 text-sm text-gray-600 px-3 py-1 rounded-full border ${getUserTypeBadge()}`}>
                <span className="capitalize">{userType}</span>
              </div>
              <div className="text-sm font-medium text-gray-900 hidden sm:block">
                Welcome, {displayName}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs 
              value={activeTab || defaultTab} 
              onValueChange={onTabChange} 
              className="space-y-6"
            >
              <TabsList className="grid w-full bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl p-1 shadow-sm" 
                style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}>
                {tabs.map((tab) => (
                  <TabsTrigger 
                    key={tab.id}
                    value={tab.id} 
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg text-sm font-medium transition-all duration-200"
                  >
                    <div className="flex items-center gap-2">
                      <tab.icon className="h-4 w-4" />
                      <span className="hidden sm:inline">{tab.title}</span>
                      {tab.count !== undefined && tab.count > 0 && (
                        <Badge 
                          variant="secondary" 
                          className={`ml-1 text-xs px-1.5 py-0.5 ${tab.color || 'bg-gray-100 text-gray-700'}`}
                        >
                          {tab.count}
                        </Badge>
                      )}
                    </div>
                  </TabsTrigger>
                ))}
              </TabsList>

              {tabs.map((tab) => (
                <TabsContent key={tab.id} value={tab.id} className="mt-6">
                  {tab.content}
                </TabsContent>
              ))}
            </Tabs>
          </div>

          {/* Sidebar */}
          {sidebar && (
            <div className="lg:col-span-1">
              {sidebar}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UnifiedDashboardLayout;
