
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, DollarSign, TrendingUp, Star, X } from "lucide-react";

const TrustStory = () => {
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
    <div className="py-16 sm:py-20 bg-white">
      <div className="container mx-auto px-6 sm:px-8">
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-6 tracking-tight">
            Real Buyer Stories
          </h2>
        </div>
        
        <div className="space-y-16">
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
  );
};

export default TrustStory;
