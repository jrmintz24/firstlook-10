
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight } from "lucide-react";

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

export const GuideSection = ({ section, index }: GuideSectionProps) => {
  const Icon = section.icon;

  return (
    <div data-section={section.id} className="mb-20">
      <Card className="border-0 shadow-lg rounded-3xl overflow-hidden">
        <CardContent className="p-0">
          {/* Section Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm opacity-80">Step {index}</div>
                <h2 className="text-2xl font-light">{section.title}</h2>
              </div>
            </div>
            <p className="text-lg opacity-90 leading-relaxed">
              {section.content.overview}
            </p>
          </div>

          {/* Section Content */}
          <div className="p-8">
            {/* Key Points */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Key Points:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {section.content.keyPoints.map((point, pointIndex) => (
                  <div key={pointIndex} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{point}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Content */}
            <div className="prose prose-lg max-w-none">
              {section.content.content.map((paragraph, paragraphIndex) => (
                <p key={paragraphIndex} className="text-gray-700 leading-relaxed mb-4">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Comparison Table for Introduction Section */}
            {index === 0 && section.content.comparison && (
              <div className="mt-8">
                <h3 className="text-xl font-medium text-gray-900 mb-6">FirstLook vs. Traditional Buyer's Agent: Key Differences</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-200 rounded-lg">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-200 p-4 text-left font-medium text-gray-900">Aspect</th>
                        <th className="border border-gray-200 p-4 text-left font-medium text-indigo-600">FirstLook (Modern DIY Approach)</th>
                        <th className="border border-gray-200 p-4 text-left font-medium text-gray-600">Traditional Buyer's Agent</th>
                      </tr>
                    </thead>
                    <tbody>
                      {section.content.comparison.aspects.map((aspect, aspectIndex) => (
                        <tr key={aspectIndex} className="hover:bg-gray-50">
                          <td className="border border-gray-200 p-4 font-medium text-gray-900 align-top">
                            {aspect.category}
                          </td>
                          <td className="border border-gray-200 p-4 text-gray-700 align-top">
                            {aspect.firstlook}
                          </td>
                          <td className="border border-gray-200 p-4 text-gray-700 align-top">
                            {aspect.traditional}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Section CTAs */}
            {index === 0 && (
              <div className="mt-8 p-6 bg-gray-50 rounded-2xl">
                <h4 className="font-medium text-gray-900 mb-2">Ready to get started?</h4>
                <p className="text-gray-600 mb-4">
                  FirstLook makes it easy to tour homes without agent pressure and get professional support only when you need it.
                </p>
                <Link to="/buyer-auth">
                  <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                    Create Free Account
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            )}

            {index === 3 && (
              <div className="mt-8 p-6 bg-indigo-50 rounded-2xl">
                <h4 className="font-medium text-gray-900 mb-2">Need help touring homes?</h4>
                <p className="text-gray-600 mb-4">
                  FirstLook provides safe, professional home tours without the pressure of traditional agents.
                </p>
                <Link to="/single-home-tour">
                  <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                    Schedule Your First Tour
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            )}

            {index === 6 && (
              <div className="mt-8 p-6 bg-green-50 rounded-2xl">
                <h4 className="font-medium text-gray-900 mb-2">Need help with offers?</h4>
                <p className="text-gray-600 mb-4">
                  FirstLook offers flat-fee offer writing and negotiation support to help you win the home you want.
                </p>
                <Link to="/subscriptions">
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    View Offer Support
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
