
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
    <div className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-light text-gray-900 mb-6 tracking-tight">What You'll Master</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
          Click any section to jump directly to that part of the guide, or scroll through the complete step-by-step process.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto px-4">
        {sections.map((section, index) => {
          const Icon = section.icon;
          return (
            <Card 
              key={section.id}
              className={`cursor-pointer transition-all duration-300 group hover:scale-105 ${
                activeSection === index 
                  ? 'border-2 border-purple-500 bg-gradient-to-br from-purple-50 to-indigo-50 shadow-lg' 
                  : 'border border-gray-200 hover:border-purple-300 hover:shadow-lg bg-white'
              } rounded-2xl overflow-hidden`}
              onClick={() => onSectionClick(index)}
            >
              <CardContent className="p-8 text-center relative">
                <div className={`absolute top-4 right-4 text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                  activeSection === index ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {index + 1}
                </div>
                
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
                  activeSection === index 
                    ? 'bg-gradient-to-br from-purple-500 to-indigo-500' 
                    : 'bg-gray-100 group-hover:bg-purple-100'
                } transition-all duration-300`}>
                  <Icon className={`w-8 h-8 ${
                    activeSection === index ? 'text-white' : 'text-gray-600 group-hover:text-purple-600'
                  } transition-colors duration-300`} />
                </div>
                
                <h3 className="font-medium text-gray-900 text-sm leading-tight">
                  {section.title}
                </h3>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
