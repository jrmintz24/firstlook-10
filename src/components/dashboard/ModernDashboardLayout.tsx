
import { ReactNode, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import SimplifiedConnectionStatus from "./SimplifiedConnectionStatus";

interface DashboardSection {
  id: string;
  title: string;
  content: ReactNode;
  count?: number;
  icon?: any;
}

interface ModernDashboardLayoutProps {
  header: ReactNode;
  stats: ReactNode;
  mainContent: ReactNode;
  sidebar: ReactNode;
  sections: Record<string, DashboardSection>;
  defaultSection?: string;
  showSectionTabs?: boolean;
  onTabChange?: (tabId: string) => void;
  activeTab?: string;
  userId?: string | null;
}

const ModernDashboardLayout = ({ 
  header, 
  stats, 
  mainContent, 
  sidebar, 
  sections, 
  defaultSection,
  showSectionTabs = true,
  onTabChange,
  activeTab,
  userId
}: ModernDashboardLayoutProps) => {
  const sectionsArray = Object.values(sections);
  const [currentTab, setCurrentTab] = useState(defaultSection || sectionsArray[0]?.id);
  
  const handleTabChange = (value: string) => {
    setCurrentTab(value);
    if (onTabChange) {
      onTabChange(value);
    }
  };

  const tabValue = activeTab || currentTab;

  return (
    <div className="min-h-screen bg-gray-50">
      {header}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Connection Status - Only shows when offline */}
        <div className="mb-4 flex justify-end">
          <SimplifiedConnectionStatus userId={userId} />
        </div>

        {/* Stats Section */}
        <div className="mb-6">
          {stats}
        </div>

        {/* Simplified Main Dashboard Grid - reduced spacing */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          {/* Main Content Area - Only show if there's actual content */}
          {mainContent && (
            <div className="lg:col-span-3">
              <Card className="bg-white border-0 shadow-sm">
                <CardContent className="p-6">
                  {mainContent}
                </CardContent>
              </Card>
            </div>
          )}
          
          {/* Sidebar - Takes up 1 column */}
          <div className={mainContent ? "lg:col-span-1" : "lg:col-span-4"}>
            {sidebar}
          </div>
        </div>

        {/* Tabbed Sections - moved up with reduced margin */}
        {showSectionTabs && sectionsArray.length > 0 && (
          <Card className="bg-white border-0 shadow-sm">
            <Tabs value={tabValue} onValueChange={handleTabChange}>
              <div className="border-b border-gray-100">
                <TabsList className="w-full bg-transparent border-0 p-0 h-auto justify-start rounded-none">
                  {sectionsArray.map((section) => (
                    <TabsTrigger 
                      key={section.id} 
                      value={section.id}
                      className="relative px-6 py-4 bg-transparent border-0 rounded-none text-gray-600 font-medium hover:text-gray-900 data-[state=active]:bg-transparent data-[state=active]:text-blue-600 data-[state=active]:shadow-none data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:h-0.5 data-[state=active]:after:bg-blue-600"
                    >
                      {section.title}
                      {section.count !== undefined && section.count > 0 && (
                        <span className="ml-2 px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full font-medium">
                          {section.count}
                        </span>
                      )}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {sectionsArray.map((section) => (
                <TabsContent key={section.id} value={section.id} className="p-6 mt-0">
                  {section.content}
                </TabsContent>
              ))}
            </Tabs>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ModernDashboardLayout;
