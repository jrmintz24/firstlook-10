
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
    <div className="py-20 bg-gray-50">
      <div className="text-center mb-16 container mx-auto px-6 sm:px-8">
        <h2 className="text-4xl md:text-5xl font-extralight text-gray-900 mb-6 tracking-tight leading-tight">What You'll Master</h2>
        <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto font-light leading-relaxed">
          Click any section to jump directly to that part of the guide, or scroll through the complete step-by-step process.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto px-6 sm:px-8">
        {sections.map((section, index) => {
          const Icon = section.icon;
          return (
            <Card 
              key={section.id}
              className={`cursor-pointer transition-all duration-300 group hover:shadow-lg ${
                activeSection === index 
                  ? 'border-2 border-gray-900 bg-white shadow-lg' 
                  : 'border border-gray-200 hover:border-gray-300 bg-white'
              } rounded-2xl overflow-hidden`}
              onClick={() => onSectionClick(index)}
            >
              <CardContent className="p-6 text-center relative">
                <div className={`absolute top-4 right-4 text-xs font-medium w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                  activeSection === index ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                }`}>
                  {index + 1}
                </div>
                
                <div className={`w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  activeSection === index 
                    ? 'bg-gray-900 shadow-md' 
                    : 'bg-gray-100 group-hover:bg-gray-200'
                }`}>
                  <Icon className={`w-6 h-6 transition-colors duration-300 ${
                    activeSection === index ? 'text-white' : 'text-gray-600'
                  }`} />
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
