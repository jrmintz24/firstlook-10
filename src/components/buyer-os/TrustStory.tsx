
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, DollarSign, TrendingUp } from "lucide-react";

const TrustStory = () => {
  const stories = [
    {
      icon: CheckCircle,
      name: "Sarah's Saturday",
      title: "From Rushed to Relaxed",
      before: "Spent weekends getting pressured by agents who barely knew her name",
      after: "Now tours homes on her schedule with knowledgeable FirstLook Pros",
      result: "Found her dream home without any pressure to sign agreements"
    },
    {
      icon: DollarSign,
      name: "Mike's Savings",
      title: "From Hidden Fees to Transparency",
      before: "Paid $18,000 in hidden commission costs built into his home price",
      after: "Used FirstLook's transparent pricing and rebate program",
      result: "Saved over $15,000 with clear, upfront costs"
    },
    {
      icon: TrendingUp,
      name: "Aliyah's Upgrade",
      title: "From Curious to Confident",
      before: "Couldn't explore her neighborhood market without making fake commitments",
      after: "Used FirstLook to honestly explore and learn about market values",
      result: "Built expertise and connections for her future home purchase"
    }
  ];

  return (
    <div className="py-24 bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Real Stories from Real Buyers
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            See how FirstLook is changing the home buying experience
          </p>
        </div>
        
        <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-3">
          {stories.map((story, index) => {
            const IconComponent = story.icon;
            return (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                      <IconComponent className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {story.name}
                      </h3>
                      <p className="text-sm text-blue-600 font-medium">
                        {story.title}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                      <p className="text-sm text-red-800">
                        <span className="font-semibold">Before:</span> {story.before}
                      </p>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                      <p className="text-sm text-green-800">
                        <span className="font-semibold">After:</span> {story.after}
                      </p>
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                      <p className="text-sm text-blue-800 font-semibold">
                        Result: {story.result}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TrustStory;
