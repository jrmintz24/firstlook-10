
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "./components/SectionHeader";
import { SectionContent } from "./components/SectionContent";

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
  const anecdote = dcAnecdotes[index];

  return (
    <div data-section={section.id} className="mb-12 md:mb-24">
      <Card className="border-0 shadow-xl md:shadow-2xl rounded-2xl md:rounded-3xl overflow-hidden bg-white">
        <CardContent className="p-0">
          <SectionHeader
            title={section.title}
            icon={section.icon}
            index={index}
            overview={section.content.overview}
            content={section.content.content}
          />
          <SectionContent
            section={section}
            index={index}
            anecdote={anecdote}
          />
        </CardContent>
      </Card>
    </div>
  );
};
