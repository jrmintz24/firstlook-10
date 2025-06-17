
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
        story: "Sarah found 4 perfect homes on Zillow Friday night. Excited for weekend tours, she called the first listing agent Saturday morning. \"Sorry, you'll need to work with a buyer's agent first—I can't show you the home directly.\" Three agents later, she finally found one available... for Tuesday. By then, 2 of her dream homes were under contract. She toured the remaining properties feeling rushed, with an agent who barely knew her name pushing her to \"write an offer today before someone else does.\"",
        pain: "Lost her dream homes to paperwork and other people's schedules. Felt pressured by someone she'd never met."
      },
      newWay: {
        icon: CheckCircle2,
        title: "The FirstLook Way",
        story: "Sarah spotted those same 4 homes Friday night. By Saturday morning, she'd booked all 4 tours through FirstLook—the earliest starting at 10 AM. Each tour was led by a knowledgeable local professional who answered her questions without any sales pressure. She had thoughtful conversations at each property, took her time, and when she found \"the one\" on Sunday, she chose to work with the FirstLook agent who'd impressed her most.",
        benefit: "Saw every home she wanted, on her timeline. Made informed decisions without pressure. Built trust before commitment."
      }
    },
    {
      name: "Mike's Surprise",
      subtitle: "Two very different price tags.",
      oldWay: {
        icon: X,
        title: "The Hidden Cost of \"Free\"",
        story: "Mike thought he'd scored when his friend's agent offered to help him buy—\"completely free!\" Six months later at closing, Mike discovered the truth. That $300K condo? The seller had built in $18,000 to cover both agents' commissions. Mike's \"free\" agent had shown him exactly 3 properties, was impossible to reach on weekends, and spent more time texting during tours than answering Mike's questions. The most expensive \"free\" service he'd ever received.",
        pain: "Paid $18K hidden in the home price for terrible service he never agreed to."
      },
      newWay: {
        icon: CheckCircle2,
        title: "Transparent with FirstLook",
        story: "Mike toured 8 condos over two weeks with FirstLook's transparent pricing: his first tour was free, then $99 per additional tour. When he was ready to make an offer, FirstLook's full-service support cost him $899. Total investment: under $1,200. He saved over $16,000 compared to traditional commissions, got better service, and always knew exactly what he was paying for—and why.",
        benefit: "Complete transparency. Better service. Saved over $16,000 with no hidden fees."
      }
    },
    {
      name: "Lisa's Curiosity",
      subtitle: "Two approaches to neighborhood intel.",
      oldWay: {
        icon: X,
        title: "The Awkward Dance",
        story: "Lisa noticed the cute house three doors down hit the market. After 8 years in the neighborhood, she was curious what it might be worth—and honestly, what her own house could sell for. But getting a tour meant calling an agent, pretending to be a serious buyer, and enduring an uncomfortable song-and-dance. \"Are you pre-approved? When are you looking to buy? I'll need you to sign this agreement...\" She gave up. The house sold two weeks later, and she never did find out what her place might be worth.",
        pain: "Couldn't satisfy simple curiosity without lying to agents or making fake commitments."
      },
      newWay: {
        icon: CheckCircle2,
        title: "Honest Exploration",
        story: "When Lisa saw her neighbor's house go on the market, she booked a FirstLook tour the same day. She was upfront: \"I live three doors down and I'm curious about market values in our neighborhood.\" Her tour guide was knowledgeable about recent sales, renovation costs, and neighborhood trends. Lisa got great insights about her area's market—and when she was ready to sell her own home two years later, she knew exactly who to call.",
        benefit: "Got honest market insights without awkward pretenses. Built a relationship for future needs."
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
                  <h3 className="text-2xl font-medium text-gray-900 mb-2">
                    {index === 0 ? "🎀" : index === 1 ? "🧾" : "🏠"} {story.name}
                  </h3>
                  <p className="text-gray-500 text-sm uppercase tracking-wide">{story.subtitle}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                  {/* Old Way */}
                  <div className="bg-red-50 border border-red-100 rounded-2xl p-8 relative">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <story.oldWay.icon className="w-5 h-5 text-red-600" />
                      </div>
                      <h4 className="text-lg font-semibold text-red-900">{story.oldWay.title}</h4>
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
                      <h4 className="text-lg font-semibold text-green-900">{story.newWay.title}</h4>
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
