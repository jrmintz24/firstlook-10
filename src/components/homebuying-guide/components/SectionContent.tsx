
import { useState } from "react";
import { ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useIsMobile } from "@/hooks/use-mobile";
import { DCAnecdote } from "../DCAnecdote";
import { SavingsCalculator } from "../SavingsCalculator";
import { KeyPointsSection } from "./KeyPointsSection";
import { ConditionalCTA } from "./ConditionalCTA";
import { ComparisonTable } from "./ComparisonTable";
import { formatContentParagraph } from "../utils/contentFormatting";

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

interface SectionContentProps {
  section: GuideSection;
  index: number;
  anecdote?: {
    story: string;
    buyer: string;
    neighborhood?: string;
    savings?: string;
  };
}

export const SectionContent = ({ section, index, anecdote }: SectionContentProps) => {
  const isMobile = useIsMobile();
  const [isContentExpanded, setIsContentExpanded] = useState(!isMobile);

  if (isMobile) {
    return (
      <div className="p-6 md:p-10 bg-gradient-to-b from-slate-50 to-white">
        <Collapsible open={isContentExpanded} onOpenChange={setIsContentExpanded}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-gradient-to-r from-slate-100 to-slate-50 rounded-xl mb-6 hover:from-slate-200 hover:to-slate-100 transition-all duration-300 shadow-sm border border-slate-200">
            <span className="font-semibold text-slate-800 text-sm">
              {isContentExpanded ? 'Hide Details' : 'Show Full Section'}
            </span>
            {isContentExpanded ? (
              <ChevronUp className="w-5 h-5 text-slate-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-600" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent>
            <KeyPointsSection keyPoints={section.content.keyPoints} isMobile={true} />
            
            {anecdote && (
              <div className="mb-8">
                <DCAnecdote 
                  story={anecdote.story}
                  buyer={anecdote.buyer}
                  neighborhood={anecdote.neighborhood}
                  savings={anecdote.savings}
                />
              </div>
            )}

            <div className="max-w-none mb-8 prose prose-lg prose-slate max-w-none">
              {section.content.content.map((paragraph, paragraphIndex) => 
                formatContentParagraph(paragraph, paragraphIndex)
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {index === 0 && <SavingsCalculator />}
        {index === 0 && section.content.comparison && (
          <ComparisonTable comparison={section.content.comparison} />
        )}
        <ConditionalCTA index={index} />
      </div>
    );
  }

  return (
    <div className="p-8 md:p-12 bg-gradient-to-b from-slate-50 to-white">
      <KeyPointsSection keyPoints={section.content.keyPoints} isMobile={false} />
      
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

      <div className="max-w-none mb-12 prose prose-xl prose-slate">
        {section.content.content.map((paragraph, paragraphIndex) => 
          formatContentParagraph(paragraph, paragraphIndex)
        )}
      </div>

      {index === 0 && (
        <div className="mb-12">
          <SavingsCalculator />
        </div>
      )}

      {index === 0 && section.content.comparison && (
        <ComparisonTable comparison={section.content.comparison} />
      )}

      <ConditionalCTA index={index} />
    </div>
  );
};
