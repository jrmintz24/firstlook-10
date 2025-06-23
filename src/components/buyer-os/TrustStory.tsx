
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, DollarSign, TrendingUp, Star } from "lucide-react";

const TrustStory = () => {
  const stories = [
    {
      icon: CheckCircle,
      name: "Sarah Chen",
      location: "Dupont Circle",
      title: "From Weekend Warrior to Strategic Buyer",
      story: "Used to get pressured into quick decisions. Now tours on her terms, found her dream condo after 8 showings.",
      result: "No pressure. No urgency.",
      emoji: "🟢"
    },
    {
      icon: DollarSign,
      name: "Marcus Williams",
      location: "Capitol Hill",
      title: "Transparency Changed Everything",
      story: "Frustrated by shady rebate math from agents. With FirstLook: $39/month + clear commission split.",
      result: "Saved $12,000. Put it into renovations.",
      emoji: "💰"
    },
    {
      icon: TrendingUp,
      name: "Priya Patel",
      location: "Adams Morgan", 
      title: "Learning Without the Sales Pitch",
      story: "Wasn't ready to commit to an agent. Used FirstLook to explore, learn, and buy with confidence.",
      result: "Built market savvy before making the biggest purchase of her life.",
      emoji: "📈"
    }
  ];

  return (
    <div className="py-24 bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6 tracking-tight">
            Real Buyers. Real Freedom. <span className="font-semibold">Real Savings.</span>
          </h2>
        </div>
        
        <div className="space-y-16">
          {stories.map((story, index) => {
            const IconComponent = story.icon;
            const isEven = index % 2 === 0;
            
            return (
              <div key={index} className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center max-w-6xl mx-auto`}>
                <div className="flex-1 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <IconComponent className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold text-gray-900">{story.name} — {story.location}</h3>
                    </div>
                  </div>
                  
                  <h4 className="text-xl font-medium text-blue-600">"{story.title}"</h4>
                  
                  <p className="text-gray-700 leading-relaxed text-lg font-light">
                    {story.story}
                  </p>
                  
                  <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                    <div className="flex items-start gap-3">
                      <span className="text-xl">{story.emoji}</span>
                      <p className="text-blue-800 font-medium leading-relaxed">
                        {story.result}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex-shrink-0">
                  <div className="w-48 h-48 bg-gradient-to-br from-blue-100 to-gray-100 rounded-3xl flex items-center justify-center text-6xl shadow-lg">
                    {story.emoji}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TrustStory;
