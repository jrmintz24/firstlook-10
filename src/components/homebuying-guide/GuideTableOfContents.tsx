
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
    <div className="py-20 bg-gradient-to-b from-white via-gray-50/50 to-gray-50">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6 tracking-tight leading-tight">What You'll Master</h2>
        <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto font-light leading-relaxed">
          Click any section to jump directly to that part of the guide, or scroll through the complete step-by-step process.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto px-4">
        {sections.map((section, index) => {
          const Icon = section.icon;
          return (
            <Card 
              key={section.id}
              className={`cursor-pointer transition-all duration-300 group hover:scale-105 hover:-translate-y-2 ${
                activeSection === index 
                  ? 'border-2 border-purple-500 bg-gradient-to-br from-purple-50 to-indigo-50 shadow-xl' 
                  : 'border border-gray-200 hover:border-purple-300 hover:shadow-xl bg-white'
              } rounded-3xl overflow-hidden`}
              onClick={() => onSectionClick(index)}
            >
              <CardContent className="p-8 text-center relative">
                <div className={`absolute top-5 right-5 text-xs font-bold w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${
                  activeSection === index ? 'bg-purple-600 text-white shadow-lg' : 'bg-gray-200 text-gray-600 group-hover:bg-purple-100 group-hover:text-purple-600'
                }`}>
                  {index + 1}
                </div>
                
                <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                  activeSection === index 
                    ? 'bg-gradient-to-br from-purple-500 to-indigo-500 shadow-lg' 
                    : 'bg-gray-100 group-hover:bg-purple-100 shadow-md group-hover:shadow-lg'
                } group-hover:scale-110`}>
                  <Icon className={`w-8 h-8 transition-colors duration-300 ${
                    activeSection === index ? 'text-white' : 'text-gray-600 group-hover:text-purple-600'
                  }`} />
                </div>
                
                <h3 className="font-semibold text-gray-900 text-sm md:text-base leading-tight tracking-wide">
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
