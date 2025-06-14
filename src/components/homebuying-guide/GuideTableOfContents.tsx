
import { Card, CardContent } from "@/components/ui/card";

interface Section {
  id: string;
  title: string;
  icon: any;
}

interface GuideTableOfContentsProps {
  sections: Section[];
  activeSection: number;
  onSectionClick: (index: number) => void;
}

export const GuideTableOfContents = ({ sections, activeSection, onSectionClick }: GuideTableOfContentsProps) => {
  return (
    <>
      <div className="text-center mb-12">
        <h2 className="text-3xl font-light text-gray-900 mb-4">What You'll Learn</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Click any section to jump directly to that part of the guide, or scroll through the complete process.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
        {sections.map((section, index) => {
          const Icon = section.icon;
          return (
            <Card 
              key={section.id}
              className={`cursor-pointer transition-all duration-300 border-2 ${
                activeSection === index 
                  ? 'border-indigo-500 bg-indigo-50' 
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
              }`}
              onClick={() => onSectionClick(index)}
            >
              <CardContent className="p-6 text-center">
                <Icon className={`w-8 h-8 mx-auto mb-3 ${activeSection === index ? 'text-indigo-600' : 'text-gray-600'}`} />
                <h3 className="font-medium text-gray-900 text-sm leading-tight">
                  {section.title}
                </h3>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
};
