import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Sparkles, AlertCircle, DollarSign, Clock, Users, Lightbulb } from "lucide-react";
import { SavingsCalculator } from "./SavingsCalculator";
import { InlineTooltip } from "./InlineTooltip";
import { ReadTimeEstimate } from "./ReadTimeEstimate";
import { DCAnecdote } from "./DCAnecdote";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

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

const formatContentParagraph = (paragraph: string, index: number) => {
  // Check if this is a major heading (starts with a topic followed by colon)
  const headingMatch = paragraph.match(/^([^:]+):\s*(.+)$/);
  
  if (headingMatch) {
    const [, heading, content] = headingMatch;
    
    // Only create callout boxes for very specific important headings
    const isImportantCallout = heading.toLowerCase().includes('firstlook') || 
                              heading.toLowerCase().includes('important') || 
                              heading.toLowerCase().includes('warning') ||
                              heading.toLowerCase().includes('money') ||
                              heading.toLowerCase().includes('save');
    
    if (isImportantCallout) {
      const getIcon = () => {
        if (heading.toLowerCase().includes('firstlook')) return Users;
        if (heading.toLowerCase().includes('money') || heading.toLowerCase().includes('save')) return DollarSign;
        if (heading.toLowerCase().includes('important') || heading.toLowerCase().includes('warning')) return AlertCircle;
        return Lightbulb;
      };
      
      const IconComponent = getIcon();
      
      return (
        <div key={index} className="mb-8">
          <div className="flex items-start gap-4 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200/50 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <IconComponent className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2 text-lg">{heading}</h4>
              <p className="text-gray-700 leading-relaxed">{formatTextContent(content)}</p>
            </div>
          </div>
        </div>
      );
    } else {
      // Regular heading without callout box
      return (
        <div key={index} className="mb-6">
          <h4 className="font-bold text-gray-900 mb-3 text-xl">{heading}</h4>
          <p className="text-gray-700 leading-relaxed text-lg font-light">{formatTextContent(content)}</p>
        </div>
      );
    }
  }

  // Regular paragraph with better spacing and formatting
  return (
    <p key={index} className="text-gray-700 leading-relaxed mb-6 text-lg font-light">
      {formatTextContent(paragraph)}
    </p>
  );
};

const formatTextContent = (text: string) => {
  // Real estate terms that should have tooltips
  const termsWithTooltips: { [key: string]: string } = {
    "MLS": "Multiple Listing Service - A database used by real estate professionals to share property listings",
    "earnest money": "A deposit made to a seller showing the buyer's good faith in a transaction",
    "contingencies": "Conditions that must be met for a real estate contract to become final",
    "due diligence": "The investigation or research done before entering into an agreement or contract",
    "closing costs": "Fees paid at the closing of a real estate transaction, typically 2-5% of the home price",
    "pre-approval": "A lender's conditional commitment to provide a mortgage up to a certain amount"
  };

  // Split text into parts and apply formatting
  return text.split(/(\b(?:FirstLook|MLS|DC|FHA|VA|HPAP|DC Open Doors|earnest money|contingencies|due diligence|closing costs|pre-approval)\b|\$[0-9,]+|\d+%|[A-Z]{2,})/g).map((part, index) => {
    // Check if this term should have a tooltip
    const lowerPart = part.toLowerCase();
    const tooltipContent = termsWithTooltips[lowerPart];
    
    if (tooltipContent) {
      return (
        <InlineTooltip key={index} content={tooltipContent}>
          <strong>{part}</strong>
        </InlineTooltip>
      );
    }
    
    // Bold important terms and acronyms
    if (/^(FirstLook|MLS|DC|FHA|VA|HPAP|DC Open Doors)$/.test(part)) {
      return <strong key={index}>{part}</strong>;
    }
    
    // Bold money amounts and percentages
    if (/^\$[0-9,]+$/.test(part) || /^\d+%$/.test(part)) {
      return <strong key={index}>{part}</strong>;
    }
    
    // Italicize phrases that need emphasis
    if (part.includes('must-have') || part.includes('nice-to-have') || part.includes('coming soon') || part.includes('off-market')) {
      return <em key={index}>{part}</em>;
    }
    
    return part;
  });
};

// DC-specific anecdotes for each section
const dcAnecdotes: { [key: number]: { story: string; buyer: string; neighborhood?: string; savings?: string } } = {
  0: {
    story: "I was tired of aggressive agents pushing me into homes I couldn't afford. FirstLook let me explore DC neighborhoods at my own pace and saved me over $12,000 in agent fees.",
    buyer: "Sarah M.",
    neighborhood: "Dupont Circle",
    savings: "$12,400"
  },
  1: {
    story: "The DC market moves fast, but FirstLook's tools helped me get pre-approved and understand what I could actually afford before I started touring. No pressure, just facts.",
    buyer: "Marcus T.",
    neighborhood: "Capitol Hill"
  },
  2: {
    story: "I found my dream condo on Zillow but FirstLook made it easy to see it the same day. Their local insights about the building's history were invaluable.",
    buyer: "Jennifer L.",
    neighborhood: "Logan Circle"
  },
  3: {
    story: "FirstLook's agent met me at three different properties in one afternoon. Professional, knowledgeable, and no pressure to make offers I wasn't ready for.",
    buyer: "David K.",
    neighborhood: "Shaw"
  },
  6: {
    story: "When I was ready to make an offer, FirstLook's flat-fee service helped me navigate multiple counteroffers and ultimately win my home for $8,000 under asking.",
    buyer: "Amanda R.",
    neighborhood: "H Street Corridor",
    savings: "$8,000 under asking"
  }
};

export const GuideSection = ({ section, index }: GuideSectionProps) => {
  const Icon = section.icon;
  const isMobile = useIsMobile();
  const [isContentExpanded, setIsContentExpanded] = useState(!isMobile);

  const getConditionalCTA = () => {
    switch (index) {
      case 0:
        return {
          title: "Ready to get started?",
          description: "FirstLook makes it easy to tour homes without agent pressure and get professional support only when you need it.",
          buttonText: "Create Free Account",
          link: "/buyer-auth",
          gradient: "from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
        };
      case 1:
        return {
          title: "Need help with financing?",
          description: "Connect with FirstLook's network of trusted lenders who understand independent buyers and DC programs.",
          buttonText: "Find Financing Options",
          link: "/subscriptions",
          gradient: "from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
        };
      case 2:
        return {
          title: "Start your home search",
          description: "Use FirstLook's curated search tools to find homes that match your criteria in DC's competitive market.",
          buttonText: "Browse DC Homes",
          link: "/buyer-auth",
          gradient: "from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
        };
      case 3:
        return {
          title: "Need help touring homes?",
          description: "FirstLook provides safe, professional home tours without the pressure of traditional agents.",
          buttonText: "Schedule Your First Tour",
          link: "/single-home-tour",
          gradient: "from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
        };
      case 6:
        return {
          title: "Need help with offers?",
          description: "FirstLook offers flat-fee offer writing and negotiation support to help you win the home you want.",
          buttonText: "View Offer Support",
          link: "/subscriptions",
          gradient: "from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
        };
      default:
        return null;
    }
  };

  const conditionalCTA = getConditionalCTA();
  const anecdote = dcAnecdotes[index];

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
              <ReadTimeEstimate content={section.content.content} />
            </div>
          </div>

          {/* Section Content - Mobile Collapsible */}
          <div className="p-10">
            {isMobile ? (
              <Collapsible open={isContentExpanded} onOpenChange={setIsContentExpanded}>
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-gray-50 rounded-xl mb-6 hover:bg-gray-100 transition-colors">
                  <span className="font-medium text-gray-900">
                    {isContentExpanded ? 'Hide Details' : 'Show Full Section'}
                  </span>
                  <ArrowRight className={`w-5 h-5 text-gray-600 transition-transform ${isContentExpanded ? 'rotate-90' : ''}`} />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  {/* Key Points with modern styling */}
                  <div className="mb-12">
                    <div className="flex items-center gap-2 mb-6">
                      <Sparkles className="w-5 h-5 text-purple-600" />
                      <h3 className="text-xl font-medium text-gray-900">Key Takeaways</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      {section.content.keyPoints.map((point, pointIndex) => (
                        <div key={pointIndex} className="flex items-start gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200/50">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 font-medium">{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* DC Anecdote */}
                  {anecdote && (
                    <div className="mb-12">
                      <DCAnecdote 
                        story={anecdote.story}
                        buyer={anecdote.buyer}
                        neighborhood={anecdote.neighborhood}
                        savings={anecdote.savings}
                      />
                    </div>
                  )}

                  {/* Detailed Content */}
                  <div className="max-w-none mb-12">
                    {section.content.content.map((paragraph, paragraphIndex) => 
                      formatContentParagraph(paragraph, paragraphIndex)
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ) : (
              <>
                {/* Desktop version - always expanded */}
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

                {/* DC Anecdote */}
                {anecdote && (
                  <div className="mb-12">
                    <DCAnecdote 
                      story={anecdote.story}
                      buyer={anecdote.buyer}
                      neighborhood={anecdote.neighborhood}
                      savings={anecdote.savings}
                    />
                  </div>
                )}

                {/* Detailed Content with better formatting */}
                <div className="max-w-none mb-12">
                  {section.content.content.map((paragraph, paragraphIndex) => 
                    formatContentParagraph(paragraph, paragraphIndex)
                  )}
                </div>
              </>
            )}

            {/* Add Savings Calculator to Introduction Section */}
            {index === 0 && (
              <div className="mb-12">
                <SavingsCalculator />
              </div>
            )}

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

            {/* Conditional Section CTAs */}
            {conditionalCTA && (
              <div className={`p-8 bg-gradient-to-br ${conditionalCTA.gradient.includes('purple') ? 'from-purple-50 to-indigo-50 border-purple-200/50' : conditionalCTA.gradient.includes('green') ? 'from-green-50 to-emerald-50 border-green-200/50' : 'from-blue-50 to-cyan-50 border-blue-200/50'} rounded-2xl border`}>
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${conditionalCTA.gradient.split(' hover:')[0]} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <ArrowRight className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-2 text-lg">{conditionalCTA.title}</h4>
                    <p className="text-gray-600 mb-4 font-light">
                      {conditionalCTA.description}
                    </p>
                    <Link to={conditionalCTA.link}>
                      <Button className={`bg-gradient-to-r ${conditionalCTA.gradient} text-white rounded-xl font-medium`}>
                        {conditionalCTA.buttonText}
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
