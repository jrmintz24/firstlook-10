
import { Card } from "@/components/ui/card";
import { Trophy, Star, Target, Award } from "lucide-react";

interface BadgesSectionProps {
  completedTours: number;
  propertiesViewed: number;
}

const BadgesSection = ({ completedTours, propertiesViewed }: BadgesSectionProps) => {
  const badges = [
    {
      id: 'first-tour',
      icon: Trophy,
      title: 'First Tour Booked',
      description: 'Started your home search journey',
      earned: completedTours > 0 || propertiesViewed > 0,
      color: 'text-yellow-600 bg-yellow-100'
    },
    {
      id: 'explorer',
      icon: Star,
      title: '5 Properties Viewed',
      description: 'Getting a feel for the market',
      earned: propertiesViewed >= 5,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      id: 'serious-buyer',
      icon: Target,
      title: 'Serious Buyer',
      description: 'Completed multiple tours',
      earned: completedTours >= 3,
      color: 'text-purple-600 bg-purple-100'
    },
    {
      id: 'expert',
      icon: Award,
      title: 'Market Expert',
      description: 'Viewed 10+ properties',
      earned: propertiesViewed >= 10,
      color: 'text-green-600 bg-green-100'
    }
  ];

  const earnedBadges = badges.filter(badge => badge.earned);

  if (earnedBadges.length === 0) {
    return null;
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Achievements</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {earnedBadges.map((badge) => {
          const IconComponent = badge.icon;
          return (
            <div key={badge.id} className="text-center">
              <div className={`p-3 rounded-full w-16 h-16 mx-auto mb-2 flex items-center justify-center ${badge.color}`}>
                <IconComponent className="w-8 h-8" />
              </div>
              <h4 className="font-medium text-gray-800 text-sm">{badge.title}</h4>
              <p className="text-xs text-gray-600 mt-1">{badge.description}</p>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default BadgesSection;
