
import { problemPoints } from "@/data/problemPoints";
import { Clock, Users, Shield, Heart, ArrowRight, CheckCircle2, X } from "lucide-react";

interface ProblemSolutionSectionProps {
  onRequestShowing: () => void;
}

const ProblemSolutionSection = ({ onRequestShowing }: ProblemSolutionSectionProps) => {
  const stories = [
    {
      name: "Sarah's Saturday",
      oldWay: {
        icon: X,
        title: "The Traditional Trap",
        story: "Sarah wanted to see 5 homes this weekend. First, she had to sign a buyer agreement with an agent she'd never met. Then wait 3 days for the agent's availability. She ended up seeing only 2 homes, felt pressured to make offers on both, and never heard back when she had questions.",
        pain: "Locked in before you know if they're right for you"
      },
      newWay: {
        icon: CheckCircle2,
        title: "The FirstLook Way",
        story: "Sarah booked all 5 showings in under 10 minutes, toured them on her schedule with professional guides, asked questions freely, and only connected with an agent when she found 'the one.' No pressure, no commitments until she was ready.",
        benefit: "Experience first, commit when you're confident"
      }
    },
    {
      name: "Mike's Surprise",
      oldWay: {
        icon: X,
        title: "Hidden Cost Shock",
        story: "Mike thought agent services were 'free' until closing day when he realized the seller's 6% commission (built into the price) meant he paid an extra $18,000 on his $300k condo for services he barely used.",
        pain: "\"Free\" services that cost thousands in hidden fees"
      },
      newWay: {
        icon: CheckCircle2,
        title: "Transparent Pricing",
        story: "Mike paid $0 for his first tour, $99 for additional showings, and saved over $15,000 by handling most of the process himself with FirstLook's support tools and optional expert help.",
        benefit: "Pay only for what you actually need and use"
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
              You Shouldn't Have to <span className="font-medium">Marry Your Agent</span> Before the First Date
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
              Real stories from real buyers who discovered there's a better way to house hunt
            </p>
          </div>
          
          {/* Story Cards */}
          <div className="space-y-20">
            {stories.map((story, index) => (
              <div key={index} className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                  <h3 className="text-2xl font-medium text-gray-900 mb-2">{story.name}</h3>
                  <p className="text-gray-500 text-sm uppercase tracking-wide">Two different experiences</p>
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

                  {/* Arrow */}
                  <div className="lg:hidden flex justify-center py-4">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <ArrowRight className="w-4 h-4 text-gray-600" />
                    </div>
                  </div>
                  <div className="hidden lg:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                    <div className="w-12 h-12 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center shadow-sm">
                      <ArrowRight className="w-5 h-5 text-gray-600" />
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
