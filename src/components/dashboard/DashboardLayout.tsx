
import { ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DashboardSection {
  id: string;
  label: string;
  content: ReactNode;
  count?: number;
}

interface DashboardLayoutProps {
  header: ReactNode;
  stats: ReactNode;
  mainContent: ReactNode;
  sidebar: ReactNode;
  sections: DashboardSection[];
  defaultSection?: string;
  showSectionTabs?: boolean;
}

const DashboardLayout = ({ 
  header, 
  stats, 
  mainContent, 
  sidebar, 
  sections, 
  defaultSection = sections[0]?.id,
  showSectionTabs = true 
}: DashboardLayoutProps) => {
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
        {showSectionTabs && sections.length > 0 && (
          <Tabs defaultValue={defaultSection} className="space-y-6">
            <TabsList className="grid w-full bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-xl p-1" style={{ gridTemplateColumns: `repeat(${sections.length}, 1fr)` }}>
              {sections.map((section) => (
                <TabsTrigger 
                  key={section.id} 
                  value={section.id} 
                  className="rounded-lg font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  {section.label}
                  {section.count !== undefined && section.count > 0 && (
                    <span className="ml-1 text-xs bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded-full">
                      {section.count}
                    </span>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>

            {sections.map((section) => (
              <TabsContent key={section.id} value={section.id}>
                {section.content}
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default DashboardLayout;
