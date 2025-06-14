
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Sparkles, AlertCircle, DollarSign, Clock, Users, Lightbulb } from "lucide-react";

interface GuideSection {
  id: string;
  title: string;
  icon: any;
  content: {
    overview: string;
    keyPoints: string[];
    content: string[];
    comparison?: {
      aspects: Array<{
        category: string;
        firstlook: string;
        traditional: string;
      }>;
    };
  };
}

interface GuideSectionProps {
  section: GuideSection;
  index: number;
}

const getCalloutIcon = (text: string) => {
  if (text.toLowerCase().includes('money') || text.toLowerCase().includes('cost') || text.toLowerCase().includes('save')) {
    return DollarSign;
  }
  if (text.toLowerCase().includes('time') || text.toLowerCase().includes('quick') || text.toLowerCase().includes('fast')) {
    return Clock;
  }
  if (text.toLowerCase().includes('tip') || text.toLowerCase().includes('remember') || text.toLowerCase().includes('pro')) {
    return Lightbulb;
  }
  if (text.toLowerCase().includes('important') || text.toLowerCase().includes('warning') || text.toLowerCase().includes('careful')) {
    return AlertCircle;
  }
  return Sparkles;
};

const formatContentParagraph = (paragraph: string, index: number) => {
  // Check if this is a heading (starts with a topic followed by colon)
  const headingMatch = paragraph.match(/^([^:]+):\s*(.+)$/);
  
  if (headingMatch) {
    const [, heading, content] = headingMatch;
    const IconComponent = getCalloutIcon(heading);
    
    return (
      <div key={index} className="mb-8">
        <div className="flex items-start gap-4 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200/50 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <IconComponent className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2 text-lg">{heading}</h4>
            <p className="text-gray-700 leading-relaxed">{content}</p>
          </div>
        </div>
      </div>
    );
  }

  // Check for FirstLook mentions and highlight them
  if (paragraph.includes('FirstLook') || paragraph.includes('How FirstLook')) {
    return (
      <div key={index} className="mb-6 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200/50">
        <div className="flex items-start gap-3">
          <Users className="w-6 h-6 text-purple-600 mt-1 flex-shrink-0" />
          <p className="text-gray-700 leading-relaxed font-medium">{paragraph}</p>
        </div>
      </div>
    );
  }

  // Regular paragraph with better spacing
  return (
    <p key={index} className="text-gray-700 leading-relaxed mb-6 text-lg font-light">
      {paragraph}
    </p>
  );
};

export const GuideSection = ({ section, index }: GuideSectionProps) => {
  const Icon = section.icon;

  return (
    <div data-section={section.id} className="mb-24">
      <Card className="border-0 shadow-2xl rounded-3xl overflow-hidden bg-white">
        <CardContent className="p-0">
          {/* Modern Section Header */}
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-10 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/5 bg-[size:20px_20px]" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-6 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-purple-300">Step {index + 1}</span>
                  </div>
                  <h2 className="text-3xl font-light tracking-tight">{section.title}</h2>
                </div>
              </div>
              <p className="text-xl text-gray-300 leading-relaxed font-light max-w-4xl">
                {section.content.overview}
              </p>
            </div>
          </div>

          {/* Section Content */}
          <div className="p-10">
            {/* Key Points with modern styling */}
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <h3 className="text-xl font-medium text-gray-900">Key Takeaways</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {section.content.keyPoints.map((point, pointIndex) => (
                  <div key={pointIndex} className="flex items-start gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200/50">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">{point}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Content with better formatting */}
            <div className="max-w-none mb-12">
              {section.content.content.map((paragraph, paragraphIndex) => 
                formatContentParagraph(paragraph, paragraphIndex)
              )}
            </div>

            {/* Modern Comparison Table for Introduction Section */}
            {index === 0 && section.content.comparison && (
              <div className="mb-12">
                <h3 className="text-2xl font-light text-gray-900 mb-8 text-center">FirstLook vs. Traditional Agent</h3>
                <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-lg">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                          <th className="p-6 text-left font-medium text-gray-900 border-r border-gray-200">Comparison</th>
                          <th className="p-6 text-left font-medium text-purple-900 bg-gradient-to-r from-purple-50 to-indigo-50 border-r border-gray-200">FirstLook Approach</th>
                          <th className="p-6 text-left font-medium text-gray-700">Traditional Agent</th>
                        </tr>
                      </thead>
                      <tbody>
                        {section.content.comparison.aspects.map((aspect, aspectIndex) => (
                          <tr key={aspectIndex} className="border-b border-gray-200 hover:bg-gray-50/50 transition-colors">
                            <td className="p-6 font-medium text-gray-900 border-r border-gray-200 bg-gray-50/30">
                              {aspect.category}
                            </td>
                            <td className="p-6 text-gray-700 border-r border-gray-200 bg-gradient-to-r from-purple-50/50 to-indigo-50/50">
                              {aspect.firstlook}
                            </td>
                            <td className="p-6 text-gray-700">
                              {aspect.traditional}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Modern Section CTAs */}
            {index === 0 && (
              <div className="p-8 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl border border-purple-200/50">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <ArrowRight className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-2 text-lg">Ready to get started?</h4>
                    <p className="text-gray-600 mb-4 font-light">
                      FirstLook makes it easy to tour homes without agent pressure and get professional support only when you need it.
                    </p>
                    <Link to="/buyer-auth">
                      <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-medium">
                        Create Free Account
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {index === 3 && (
              <div className="p-8 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-200/50">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <ArrowRight className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-2 text-lg">Need help touring homes?</h4>
                    <p className="text-gray-600 mb-4 font-light">
                      FirstLook provides safe, professional home tours without the pressure of traditional agents.
                    </p>
                    <Link to="/single-home-tour">
                      <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl font-medium">
                        Schedule Your First Tour
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {index === 6 && (
              <div className="p-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200/50">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <ArrowRight className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-2 text-lg">Need help with offers?</h4>
                    <p className="text-gray-600 mb-4 font-light">
                      FirstLook offers flat-fee offer writing and negotiation support to help you win the home you want.
                    </p>
                    <Link to="/subscriptions">
                      <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-medium">
                        View Offer Support
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
