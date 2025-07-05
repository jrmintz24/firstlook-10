
import { Card, CardContent } from "@/components/ui/card";

const IndustryAndStories = () => {
  const stories = [
    {
      emoji: "🏡",
      title: "Sarah's Saturday",
      subtitle: '"No more pressure tours."',
      story: "Sarah used to feel helpless navigating real estate. Her weekends were hijacked by agents she barely knew, who rushed her from home to home with an urgency that didn't match her own. The kicker? She had to sign a buyer's agreement just to see her first home. Every showing felt like an audition — for her and for them.\n\nWith FirstLook, Sarah booked 4 showings on her own terms. Each showing was led by a local pro who answered her questions — but never pressured her to buy. She FaceTimed her mom from one place, took time to think, and two weeks later made an offer she felt great about. At closing, she got an $8,400 rebate — money she used for new furniture and a much-needed vacation."
    },
    {
      emoji: "💰",
      title: "Marcus's Math",
      subtitle: '"Finally, the numbers made sense."',
      story: "Marcus had always assumed real estate agents were 'free' — until he looked closer. On his $600,000 home, his agent earned $18,000 in buyer-side commission. The agent offered him a $1,500 rebate, calling it generous. Marcus did the math — he was missing out on over $16,000.\n\nWith FirstLook, he toured homes on his own schedule for $39/month. When he found 'the one,' FirstLook submitted his offer, took a 10% service fee, and rebated the remaining $13,500. He put that money toward renovations, and still had enough for a family trip. For the first time, he felt like the system worked for him."
    },
    {
      emoji: "📚",
      title: "Priya's Journey",
      subtitle: '"Education without obligation."',
      story: "Priya wasn't in a rush — she just wanted to understand the market. But every agent she called asked her to sign an exclusivity contract before showing her anything. When she declined, most stopped replying. The few that did help made her feel like a burden.\n\nFirstLook gave her the freedom to explore. Over three months, she toured 12 homes, chatted with friendly tour partners, and slowly built her confidence. She learned about local pricing trends, renovation red flags, and neighborhood quirks. When she finally found the right place, she used FirstLook's tools to build her offer and negotiated below asking — fully in control from start to finish."
    }
  ];

  return (
    <div>
      {/* Industry Context Section */}
      <div className="py-12 sm:py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-6 sm:px-8">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-6">
              <span className="text-3xl">🎯</span>
              <div>
                <h2 className="text-3xl md:text-4xl font-light text-gray-900 tracking-tight">
                  The Commission Model Is Broken.
                </h2>
                <p className="text-xl text-gray-600 mt-2">
                  We're not fixing it. We're replacing it.
                </p>
              </div>
            </div>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-lg border border-gray-100 mb-12">
              <div className="prose prose-lg max-w-none text-gray-700 font-light leading-relaxed space-y-6">
                <p className="text-lg">
                  In 2024, the old 6% commission model collapsed. Buyer agents are no longer "free" — they want upfront contracts and out-of-pocket payments from buyers.
                </p>
                
                <p className="text-lg">
                  Meanwhile, middlemen platforms put basic home information behind paywalls, steering buyers into the same broken system with hidden fees and pressure tactics.
                </p>
                
                <p className="text-lg font-medium text-gray-900">
                  But what about buyers who want control?
                </p>
                
                <p className="text-lg font-semibold text-gray-900">
                  FirstLook is built for the next chapter.
                </p>
              </div>
            </div>

            <div className="text-center mb-12">
              <h3 className="text-2xl md:text-3xl font-light text-gray-900 mb-8 tracking-tight">
                Here's what we believe:
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl">🏠</span>
                </div>
                <p className="text-gray-700 font-light leading-relaxed">
                  <span className="font-medium text-gray-900">Tour homes</span> without gatekeepers
                </p>
              </div>
              
              <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl">📝</span>
                </div>
                <p className="text-gray-700 font-light leading-relaxed">
                  <span className="font-medium text-gray-900">Make offers</span> with or without an agent
                </p>
              </div>
              
              <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl">💰</span>
                </div>
                <p className="text-gray-700 font-light leading-relaxed">
                  <span className="font-medium text-gray-900">Save thousands</span> when you close
                </p>
              </div>
            </div>

            <div className="text-center bg-gradient-to-br from-gray-900 to-blue-900 rounded-2xl p-8 sm:p-10 text-white">
              <div className="max-w-3xl mx-auto">
                <p className="text-xl sm:text-2xl font-light leading-relaxed">
                  No pressure. No contracts. Just progress.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Real Buyer Stories Section */}
      <div className="py-12 sm:py-16 bg-white">
        <div className="container mx-auto px-6 sm:px-8">
          <div className="text-center mb-12 max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-6 tracking-tight">
              Real Buyer Stories
            </h2>
          </div>
          
          <div className="space-y-12">
            {stories.map((story, index) => (
              <div key={index} className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-medium text-gray-900 mb-2 flex items-center justify-center gap-3">
                    <span className="text-3xl">{story.emoji}</span>
                    {story.title}
                  </h3>
                  <p className="text-lg font-medium text-gray-600 italic">
                    {story.subtitle}
                  </p>
                </div>
                
                <Card className="bg-gray-50 border-0 shadow-md rounded-2xl">
                  <CardContent className="p-8 sm:p-10">
                    <div className="prose prose-lg max-w-none">
                      {story.story.split('\n\n').map((paragraph, pIndex) => (
                        <p key={pIndex} className="text-gray-700 leading-relaxed font-light mb-4 last:mb-0">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndustryAndStories;
