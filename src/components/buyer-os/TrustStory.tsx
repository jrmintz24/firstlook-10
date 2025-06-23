
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, DollarSign, TrendingUp, Star } from "lucide-react";

const TrustStory = () => {
  const longFormStories = [
    {
      icon: CheckCircle,
      name: "Sarah Chen",
      location: "Dupont Circle",
      title: "From Weekend Warrior to Strategic Buyer",
      story: "Sarah used to spend every Saturday being shuttled around by agents who barely knew her name. She'd get pressured into making quick decisions on homes she wasn't sure about, all while feeling like she was wasting everyone's time when she said 'maybe.' With FirstLook, Sarah can explore neighborhoods at her own pace, ask real questions without sales pressure, and only involve an agent when she's ready to make an offer. She found her dream condo after touring 8 properties over 3 months—on her timeline.",
      result: "Found her perfect home without any pressure or fake urgency",
      image: "🏠"
    },
    {
      icon: DollarSign,
      name: "Marcus Williams",
      location: "Capitol Hill",
      title: "Transparency Changed Everything",
      story: "Marcus was frustrated by hidden costs and unclear commission structures that seemed to change depending on which agent he talked to. Traditional buyers' agents would quote different rebate amounts, and he never knew what he was actually paying for. FirstLook's transparent pricing meant he knew exactly what he'd pay upfront—$39/month for tours, and a clear rebate structure if he decided to buy. When he purchased his townhouse, he saved over $12,000 in commission rebates that he put toward renovations.",
      result: "Saved $12,000 with transparent pricing and commission rebates",
      image: "💰"
    },
    {
      icon: TrendingUp,
      name: "Priya Patel",
      location: "Adams Morgan", 
      title: "Building Market Knowledge Without Commitment",
      story: "As a first-time buyer, Priya felt overwhelmed by the pressure to 'get serious' with an agent before she even knew what she wanted. She wasn't ready to commit to exclusive representation, but she needed to understand the market. FirstLook let her tour different types of properties, ask questions about neighborhoods, and build real expertise over 6 months. When she finally found 'the one,' she had the confidence to negotiate effectively and knew she was making the right choice.",
      result: "Built market expertise and confidence before making her biggest purchase",
      image: "📈"
    }
  ];

  return (
    <div className="py-24 bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6 tracking-tight">
            Real Stories from <span className="font-semibold">Real DC Buyers</span>
          </h2>
          <p className="text-xl text-gray-600 font-light leading-relaxed">
            See how FirstLook is changing the home buying experience in Washington, DC
          </p>
        </div>
        
        <div className="space-y-16">
          {longFormStories.map((story, index) => {
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
                      <h3 className="text-2xl font-semibold text-gray-900">{story.name}</h3>
                      <p className="text-gray-600 font-light">{story.location}</p>
                    </div>
                  </div>
                  
                  <h4 className="text-xl font-medium text-blue-600">{story.title}</h4>
                  
                  <p className="text-gray-700 leading-relaxed text-lg font-light">
                    {story.story}
                  </p>
                  
                  <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                    <div className="flex items-start gap-3">
                      <Star className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                      <p className="text-blue-800 font-medium leading-relaxed">
                        {story.result}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex-shrink-0">
                  <div className="w-48 h-48 bg-gradient-to-br from-blue-100 to-gray-100 rounded-3xl flex items-center justify-center text-6xl shadow-lg">
                    {story.image}
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
