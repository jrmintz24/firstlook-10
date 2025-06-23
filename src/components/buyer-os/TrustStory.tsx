
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, DollarSign, TrendingUp, Star, X } from "lucide-react";

const TrustStory = () => {
  const stories = [
    {
      emoji: "🎀",
      title: "Sarah's Saturday",
      subtitle: "TWO DIFFERENT REALITIES.",
      sections: [
        {
          type: "trap",
          icon: X,
          title: "The Traditional Trap",
          story: "Sarah found 4 perfect homes on Zillow Friday night. Excited for weekend tours, she called the first listing agent Saturday morning. \"Sorry, you'll need to work with a buyer's agent first. Here's my colleague's number.\" By noon, she'd signed a buyer agreement she didn't fully understand just to see one house. The agent rushed her through 3 showings in 2 hours, pushing for quick decisions on each. \"This market moves fast,\" he kept saying. Sarah felt pressured and overwhelmed.",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          textColor: "text-red-800",
          iconColor: "text-red-600"
        },
        {
          type: "solution",
          icon: CheckCircle,
          title: "The FirstLook Way",
          story: "Sarah spotted those same 4 homes Friday night. By Saturday morning, she'd booked all 4 tours through FirstLook—the earliest starting at 10 AM. Each tour was led by a licensed DC pro who answered her questions without any sales pressure. Sarah took photos, made notes, and even FaceTimed her mom from the second house. After all 4 tours, she had time to think. Two weeks later, she made an informed offer on her favorite—and got a $8,400 commission rebate at closing.",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          textColor: "text-green-800",
          iconColor: "text-green-600"
        }
      ]
    },
    {
      emoji: "💰",
      title: "Marcus's Revelation",
      subtitle: "WHEN THE MATH FINALLY MADE SENSE.",
      sections: [
        {
          type: "trap",
          icon: X,
          title: "The Commission Confusion",
          story: "Marcus had been working with an agent for 3 months. When he finally found 'the one'—a Capitol Hill rowhouse—his agent mentioned a 'small rebate' of $1,500. Marcus was thrilled until he did the math later. On a $600,000 purchase, the buyer agent commission was $18,000. His 'generous' agent had kept $16,500 of what was technically Marcus's money. He felt deceived and wondered what other buyers were missing out on.",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          textColor: "text-red-800",
          iconColor: "text-red-600"
        },
        {
          type: "solution",
          icon: DollarSign,
          title: "The FirstLook Difference",
          story: "With FirstLook, Marcus paid $39/month and toured homes on his schedule. When he found his dream house, the seller was offering a $15,000 buyer agent commission. FirstLook kept their 10% service fee ($1,500) and gave Marcus the remaining $13,500 at closing. Clear, transparent, and fair. Marcus used that money for new hardwood floors and still had enough left over for a vacation. 'Finally, someone who works for the buyer,' he said.",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          textColor: "text-green-800",
          iconColor: "text-green-600"
        }
      ]
    },
    {
      emoji: "📚",
      title: "Priya's Learning Journey", 
      subtitle: "EDUCATION WITHOUT OBLIGATION.",
      sections: [
        {
          type: "trap",
          icon: X,
          title: "The Pressure to Commit",
          story: "Priya wasn't ready to buy immediately but wanted to start learning about the market. Every agent she contacted wanted her to sign agreements upfront. 'We can't show you homes without representation,' they said. She felt trapped—how could she learn about buying without committing to someone she'd just met? The few agents who did show her homes kept pushing her to make offers she wasn't ready for.",
          bgColor: "bg-red-50",
          borderColor: "border-red-200", 
          textColor: "text-red-800",
          iconColor: "text-red-600"
        },
        {
          type: "solution",
          icon: TrendingUp,
          title: "The FirstLook Education",
          story: "FirstLook let Priya explore without pressure. She toured 12 homes over 3 months, learning about neighborhoods, construction quality, and pricing trends. Each FirstLook pro shared insights about the local market without pushing for quick decisions. When Priya finally felt ready to buy, she was the most informed buyer at the negotiating table. She knew exactly what she wanted and got it—under asking price in a competitive market.",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          textColor: "text-green-800", 
          iconColor: "text-green-600"
        }
      ]
    }
  ];

  return (
    <div className="py-28 sm:py-36 bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-8 tracking-tight">
            🧡 You Shouldn't Have to <span className="font-medium">Marry Your Agent</span> Before the First Date
          </h2>
          <p className="text-xl text-gray-600 font-light leading-relaxed">
            Real stories from real buyers who discovered there's a better way to house hunt.
          </p>
        </div>
        
        <div className="space-y-24">
          {stories.map((story, index) => (
            <div key={index} className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h3 className="text-3xl font-medium text-gray-900 mb-3">
                  {story.emoji} {story.title}
                </h3>
                <p className="text-sm font-medium text-gray-500 tracking-wider uppercase">
                  {story.subtitle}
                </p>
              </div>
              
              <div className="grid lg:grid-cols-2 gap-10">
                {story.sections.map((section, sectionIndex) => {
                  const IconComponent = section.icon;
                  return (
                    <Card key={sectionIndex} className={`${section.bgColor} ${section.borderColor} border-2 shadow-md hover:shadow-lg transition-all duration-300 rounded-2xl`}>
                      <CardContent className="p-8 sm:p-10">
                        <div className="flex items-center gap-4 mb-8">
                          <div className={`w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm`}>
                            <IconComponent className={`h-6 w-6 ${section.iconColor}`} />
                          </div>
                          <h4 className={`text-xl font-medium ${section.textColor}`}>
                            {section.title}
                          </h4>
                        </div>
                        
                        <p className={`${section.textColor} leading-relaxed text-base font-light`}>
                          {section.story}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-20">
          <div className="inline-flex items-center gap-4 bg-white text-gray-600 px-12 py-8 rounded-3xl border border-gray-200 shadow-sm">
            <span className="text-3xl">✨</span>
            <span className="font-medium text-xl">
              Every FirstLook buyer gets to write their own success story—<span className="font-semibold text-gray-900">starting with a free tour</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustStory;
