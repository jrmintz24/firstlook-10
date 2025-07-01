
import { ReactNode, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DashboardSection {
  id: string;
  title: string;
  component: ReactNode;
  count?: number;
  icon?: any;
}

interface DashboardLayoutProps {
  header: ReactNode;
  stats: ReactNode;
  mainContent: ReactNode;
  sidebar: ReactNode;
  sections: Record<string, DashboardSection>;
  defaultSection?: string;
  showSectionTabs?: boolean;
  onTabChange?: (tabId: string) => void;
  activeTab?: string;
}

const DashboardLayout = ({ 
  header, 
  stats, 
  mainContent, 
  sidebar, 
  sections, 
  defaultSection,
  showSectionTabs = true,
  onTabChange,
  activeTab
}: DashboardLayoutProps) => {
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {header}

      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {stats}

        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Main Content Area - Takes up 2 columns */}
          <div className="lg:col-span-2">
            {mainContent}
          </div>
          
          {/* Sidebar - Takes up 1 column */}
          <div className="space-y-6">
            {sidebar}
          </div>
        </div>

        {/* Tabbed Sections */}
        {showSectionTabs && sectionsArray.length > 0 && (
          <Tabs value={tabValue} onValueChange={handleTabChange} className="space-y-6">
            <TabsList className="grid w-full bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-xl p-1" style={{ gridTemplateColumns: `repeat(${sectionsArray.length}, 1fr)` }}>
              {sectionsArray.map((section) => (
                <TabsTrigger 
                  key={section.id} 
                  value={section.id} 
                  className="rounded-lg font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  {section.title}
                  {section.count !== undefined && section.count > 0 && (
                    <span className="ml-1 text-xs bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded-full">
                      {section.count}
                    </span>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>

            {sectionsArray.map((section) => (
              <TabsContent key={section.id} value={section.id}>
                {section.component}
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default DashboardLayout;
