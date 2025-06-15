
import React from "react";
import { InlineTooltip } from "../InlineTooltip";

// Real estate terms that should have tooltips
const termsWithTooltips: { [key: string]: string } = {
  "MLS": "Multiple Listing Service - A database used by real estate professionals to share property listings",
  "earnest money": "A deposit made to a seller showing the buyer's good faith in a transaction",
  "contingencies": "Conditions that must be met for a real estate contract to become final",
  "due diligence": "The investigation or research done before entering into an agreement or contract",
  "closing costs": "Fees paid at the closing of a real estate transaction, typically 2-5% of the home price",
  "pre-approval": "A lender's conditional commitment to provide a mortgage up to a certain amount"
};

export const formatTextContent = (text: string) => {
  // Split text into parts and apply formatting
  return text.split(/(\b(?:FirstLook|MLS|DC|FHA|VA|HPAP|DC Open Doors|earnest money|contingencies|due diligence|closing costs|pre-approval)\b|\$[0-9,]+|\d+%|[A-Z]{2,})/g).map((part, index) => {
    // Check if this term should have a tooltip
    const lowerPart = part.toLowerCase();
    const tooltipContent = termsWithTooltips[lowerPart];
    
    if (tooltipContent) {
      return (
        <InlineTooltip key={index} content={tooltipContent}>
          <strong className="text-gray-900 font-semibold">{part}</strong>
        </InlineTooltip>
      );
    }
    
    // Bold important terms and acronyms
    if (/^(FirstLook|MLS|DC|FHA|VA|HPAP|DC Open Doors)$/.test(part)) {
      return <strong key={index} className="text-gray-900 font-semibold">{part}</strong>;
    }
    
    // Bold money amounts and percentages
    if (/^\$[0-9,]+$/.test(part) || /^\d+%$/.test(part)) {
      return <strong key={index} className="text-green-600 font-bold">{part}</strong>;
    }
    
    // Italicize phrases that need emphasis
    if (part.includes('must-have') || part.includes('nice-to-have') || part.includes('coming soon') || part.includes('off-market')) {
      return <em key={index} className="text-purple-600 font-medium">{part}</em>;
    }
    
    return part;
  });
};

export const formatContentParagraph = (paragraph: string, index: number) => {
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
        if (heading.toLowerCase().includes('firstlook')) return import('lucide-react').then(m => m.Users);
        if (heading.toLowerCase().includes('money') || heading.toLowerCase().includes('save')) return import('lucide-react').then(m => m.DollarSign);
        if (heading.toLowerCase().includes('important') || heading.toLowerCase().includes('warning')) return import('lucide-react').then(m => m.AlertCircle);
        return import('lucide-react').then(m => m.Lightbulb);
      };
      
      return (
        <CalloutBox key={index} heading={heading} content={content} getIcon={getIcon} />
      );
    } else {
      // Regular heading without callout box
      return (
        <div key={index} className="mb-6 md:mb-8">
          <h4 className="font-bold text-gray-900 mb-3 md:mb-4 text-xl md:text-2xl tracking-wide">{heading}</h4>
          <p className="text-gray-700 leading-relaxed text-base md:text-lg font-light">{formatTextContent(content)}</p>
        </div>
      );
    }
  }

  // Regular paragraph with better spacing and formatting
  return (
    <p key={index} className="text-gray-700 leading-relaxed mb-6 md:mb-8 text-base md:text-lg font-light">
      {formatTextContent(paragraph)}
    </p>
  );
};

const CalloutBox = ({ heading, content, getIcon }: { heading: string; content: string; getIcon: () => Promise<any> }) => {
  const [IconComponent, setIconComponent] = React.useState<any>(null);
  
  React.useEffect(() => {
    getIcon().then(setIconComponent);
  }, [getIcon]);

  if (!IconComponent) return null;

  return (
    <div className="mb-8 md:mb-10">
      <div className="flex items-start gap-4 md:gap-5 p-6 md:p-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200/50 mb-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1">
        <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg hover:scale-110 transition-transform duration-300">
          <IconComponent className="w-5 h-5 md:w-6 md:h-6 text-white" />
        </div>
        <div>
          <h4 className="font-bold text-gray-900 mb-3 text-lg md:text-xl tracking-wide">{heading}</h4>
          <p className="text-gray-700 leading-relaxed text-base md:text-lg font-light">{formatTextContent(content)}</p>
        </div>
      </div>
    </div>
  );
};
