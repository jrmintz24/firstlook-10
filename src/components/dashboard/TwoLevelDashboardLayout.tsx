
import { ReactNode, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

interface PrimarySection {
  id: string;
  title: string;
  icon: LucideIcon;
  content?: ReactNode;
  subsections?: SubSection[];
}

interface SubSection {
  id: string;
  title: string;
  content: ReactNode;
  count?: number;
}

interface TwoLevelDashboardLayoutProps {
  sections: PrimarySection[];
  defaultPrimaryTab?: string;
  defaultSubTab?: string;
  activePrimaryTab?: string;
  activeSubTab?: string;
  onPrimaryTabChange?: (tabId: string) => void;
  onSubTabChange?: (tabId: string) => void;
  header?: ReactNode;
  stats?: ReactNode;
}

const TwoLevelDashboardLayout = ({
  sections,
  defaultPrimaryTab,
  defaultSubTab,
  activePrimaryTab,
  activeSubTab,
  onPrimaryTabChange,
  onSubTabChange,
  header,
  stats
}: TwoLevelDashboardLayoutProps) => {
  const [currentPrimaryTab, setCurrentPrimaryTab] = useState(
    defaultPrimaryTab || sections[0]?.id
  );
  const [currentSubTab, setCurrentSubTab] = useState(defaultSubTab);

  const primaryTabValue = activePrimaryTab || currentPrimaryTab;
  const subTabValue = activeSubTab || currentSubTab;

  const handlePrimaryTabChange = (value: string) => {
    setCurrentPrimaryTab(value);
    if (onPrimaryTabChange) {
      onPrimaryTabChange(value);
    }
    
    // Reset sub tab when primary changes
    const newSection = sections.find(s => s.id === value);
    if (newSection?.subsections && newSection.subsections.length > 0) {
      const firstSubId = newSection.subsections[0].id;
      setCurrentSubTab(firstSubId);
      if (onSubTabChange) {
        onSubTabChange(firstSubId);
      }
    }
  };

  const handleSubTabChange = (value: string) => {
    setCurrentSubTab(value);
    if (onSubTabChange) {
      onSubTabChange(value);
    }
  };

  const currentSection = sections.find(s => s.id === primaryTabValue);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {header}

      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {stats}

        {/* Primary Navigation */}
        <Tabs value={primaryTabValue} onValueChange={handlePrimaryTabChange} className="space-y-6">
          <TabsList className="grid w-full bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-xl p-1 mb-8" 
                   style={{ gridTemplateColumns: `repeat(${sections.length}, 1fr)` }}>
            {sections.map((section) => (
              <TabsTrigger 
                key={section.id} 
                value={section.id} 
                className="rounded-lg font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center gap-2 px-4 py-3"
              >
                <section.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{section.title}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {sections.map((section) => (
            <TabsContent key={section.id} value={section.id} className="space-y-6">
              {section.subsections && section.subsections.length > 0 ? (
                /* Secondary Navigation for sections with subsections */
                <Card className="bg-white border-0 shadow-sm">
                  <Tabs value={subTabValue} onValueChange={handleSubTabChange}>
                    <div className="border-b border-gray-100">
                      <TabsList className="w-full bg-transparent border-0 p-0 h-auto justify-start rounded-none">
                        {section.subsections.map((subsection) => (
                          <TabsTrigger 
                            key={subsection.id} 
                            value={subsection.id}
                            className="relative px-6 py-4 bg-transparent border-0 rounded-none text-gray-600 font-medium hover:text-gray-900 data-[state=active]:bg-transparent data-[state=active]:text-blue-600 data-[state=active]:shadow-none data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:h-0.5 data-[state=active]:after:bg-blue-600"
                          >
                            {subsection.title}
                            {subsection.count !== undefined && subsection.count > 0 && (
                              <Badge variant="secondary" className="ml-2 px-2 py-0.5 text-xs">
                                {subsection.count}
                              </Badge>
                            )}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                    </div>

                    {section.subsections.map((subsection) => (
                      <TabsContent key={subsection.id} value={subsection.id} className="p-6 mt-0">
                        {subsection.content}
                      </TabsContent>
                    ))}
                  </Tabs>
                </Card>
              ) : (
                /* Direct content for sections without subsections */
                <Card className="bg-white border-0 shadow-sm">
                  <CardContent className="p-6">
                    {section.content}
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default TwoLevelDashboardLayout;
