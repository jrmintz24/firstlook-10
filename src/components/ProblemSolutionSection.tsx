
import { CheckCircle2, X } from "lucide-react";

interface ProblemSolutionSectionProps {
  onRequestShowing: () => void;
}

const ProblemSolutionSection = ({ onRequestShowing }: ProblemSolutionSectionProps) => {
  const stories = [
    {
      name: "Sarah's Saturday",
      subtitle: "Two different realities.",
      oldWay: {
        icon: X,
        title: "The Traditional Trap",
        story: "Sarah wanted to tour 4 homes over the weekend. But before she could even get started, she had to sign a buyer agreement with an agent she'd never met—just to schedule a showing. Then she waited 3 days for their availability. In the end, she saw only 2 homes, felt rushed, and was nudged toward writing offers she wasn't ready for. When she emailed with follow-up questions? Crickets.",
        pain: "She committed to an agent before she knew if they were a good fit. No flexibility. No freedom. No follow-through."
      },
      newWay: {
        icon: CheckCircle2,
        title: "The FirstLook Way",
        story: "Sarah opened FirstLook on Friday. She picked 4 homes, booked tours in under 10 minutes, and visited all of them on her schedule the next day. Each tour was hosted by a vetted local pro—no pressure, just answers. When she finally found \"the one,\" then she chose to connect with an agent she liked.",
        benefit: "She got to experience homes first—then decide when (and if) to commit. Freedom to explore. Support when it matters."
      }
    },
    {
      name: "Mike's Surprise",
      subtitle: "Two very different price tags.",
      oldWay: {
        icon: X,
        title: "The Hidden Cost of \"Free\"",
        story: "Mike thought working with a buyer's agent was free. But at closing, he realized the seller paid 3% in commission to the buyer's agent—baked into the sale price. That meant on his $300K condo, $9,000 went to an agent he barely interacted with. He never negotiated the fee, never approved the terms—and never got a breakdown of where that money went.",
        pain: "\"Free\" turned out to be one of the most expensive parts of buying."
      },
      newWay: {
        icon: CheckCircle2,
        title: "Transparent with FirstLook",
        story: "Mike toured his first home for $0. He booked a few more for $99, and when he was ready to make an offer, he used FirstLook's expert help for a flat $499. All-in? He saved over $8,000, stayed in control, and only paid for what he actually needed.",
        benefit: "No bloated fees. No forced commitments. Just smart homebuying."
      }
    }
  ];

  return (
    <div className="py-24 bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6 tracking-tight">
              🧡 You Shouldn't Have to <span className="font-medium">Marry Your Agent</span> Before the First Date
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
              Real stories from real buyers who discovered there's a better way to house hunt.
            </p>
          </div>
          
          {/* Story Cards */}
          <div className="space-y-20">
            {stories.map((story, index) => (
              <div key={index} className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                  <h3 className="text-2xl font-medium text-gray-900 mb-2">🎀 {story.name}</h3>
                  <p className="text-gray-500 text-sm uppercase tracking-wide">{story.subtitle}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                  {/* Old Way */}
                  <div className="bg-red-50 border border-red-100 rounded-2xl p-8 relative">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <story.oldWay.icon className="w-5 h-5 text-red-600" />
                      </div>
                      <h4 className="text-lg font-semibold text-red-900">❌ {story.oldWay.title}</h4>
                    </div>
                    <p className="text-red-800 mb-6 leading-relaxed">{story.oldWay.story}</p>
                    <div className="bg-red-100 rounded-xl p-4">
                      <p className="text-sm font-medium text-red-700">{story.oldWay.pain}</p>
                    </div>
                  </div>

                  {/* New Way */}
                  <div className="bg-green-50 border border-green-100 rounded-2xl p-8 relative">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <story.newWay.icon className="w-5 h-5 text-green-600" />
                      </div>
                      <h4 className="text-lg font-semibold text-green-900">✅ {story.newWay.title}</h4>
                    </div>
                    <p className="text-green-800 mb-6 leading-relaxed">{story.newWay.story}</p>
                    <div className="bg-green-100 rounded-xl p-4">
                      <p className="text-sm font-medium text-green-700">{story.newWay.benefit}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Stats Section */}
          <div className="mt-20 bg-gray-900 rounded-3xl p-12 text-center text-white">
            <h3 className="text-3xl font-light mb-8">The Numbers Don't Lie</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="text-4xl font-bold mb-2">$15K+</div>
                <div className="text-gray-300">Average savings vs. traditional 6% commission</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">12 min</div>
                <div className="text-gray-300">Average response time for tour requests</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">1,000+</div>
                <div className="text-gray-300">Successful tours with happy buyers</div>
              </div>
            </div>
          </div>

          {/* Final CTA */}
          <div className="mt-20 text-center">
            <div className="bg-white rounded-2xl p-12 max-w-3xl mx-auto border border-gray-200 shadow-sm">
              <h3 className="text-3xl font-light text-gray-900 mb-6 tracking-tight">
                Ready to Be the Hero of Your Own Story?
              </h3>
              <p className="text-gray-600 text-lg mb-8 font-light leading-relaxed">
                Join thousands of smart buyers who've taken control of their home search. Your first private showing is completely free.
              </p>
              <button
                type="button"
                onClick={onRequestShowing}
                className="bg-gray-900 hover:bg-gray-800 text-white px-10 py-4 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Start Your Free Tour
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemSolutionSection;
