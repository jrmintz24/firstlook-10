
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Circle, ExternalLink, Calendar, UserPlus, Heart } from "lucide-react";

interface WhatsNextCardProps {
  hasUpcomingTour: boolean;
  hasCompletedTours: number;
  onMakeOffer: () => void;
  onWorkWithAgent?: () => void;
  onScheduleAnotherTour?: () => void;
  onSeeOtherProperties?: () => void;
  isLoading?: boolean;
}

const WhatsNextCard = ({ 
  hasUpcomingTour, 
  hasCompletedTours, 
  onMakeOffer,
  onWorkWithAgent,
  onScheduleAnotherTour,
  onSeeOtherProperties,
  isLoading = false
}: WhatsNextCardProps) => {
  const getChecklist = () => {
    const items = [];
    
    if (hasUpcomingTour) {
      items.push({
        id: 'prepare',
        text: 'Prepare questions for your tour',
        completed: false,
        actionable: false
      });
    }
    
    if (hasCompletedTours > 0) {
      items.push({
        id: 'debrief',
        text: 'Debrief after tour',
        completed: true,
        actionable: false
      });
      items.push({
        id: 'feedback',
        text: 'Review feedback',
        completed: false,
        actionable: false
      });
    }
    
    items.push({
      id: 'offer',
      text: 'Ready to make an offer?',
      completed: false,
      actionable: true
    });
    
    return items;
  };

  const checklist = getChecklist();

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">What's Next?</h3>
      
      <div className="space-y-3 mb-6">
        {checklist.map((item) => (
          <div key={item.id} className="flex items-center gap-3">
            {item.completed ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <Circle className="w-5 h-5 text-gray-400" />
            )}
            <span className={`flex-1 ${item.completed ? 'text-gray-500 line-through' : 'text-gray-700'}`}>
              {item.text}
            </span>
            {item.actionable && !item.completed && (
              <Button size="sm" onClick={onMakeOffer} disabled={isLoading}>
                Get Started
              </Button>
            )}
          </div>
        ))}
      </div>

      {/* Post-tour actions for completed tours */}
      {hasCompletedTours > 0 && (
        <div className="border-t pt-4 mb-4">
          <p className="text-sm font-medium text-gray-700 mb-3">Post-Tour Actions:</p>
          <div className="grid grid-cols-1 gap-2">
            {onWorkWithAgent && (
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2 justify-start"
                onClick={onWorkWithAgent}
                disabled={isLoading}
              >
                <UserPlus className="w-4 h-4" />
                Work with Agent
              </Button>
            )}
            {onScheduleAnotherTour && (
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2 justify-start"
                onClick={onScheduleAnotherTour}
                disabled={isLoading}
              >
                <Calendar className="w-4 h-4" />
                Schedule Another Showing
              </Button>
            )}
            {onSeeOtherProperties && (
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2 justify-start"
                onClick={onSeeOtherProperties}
                disabled={isLoading}
              >
                <Heart className="w-4 h-4" />
                See Other Properties
              </Button>
            )}
          </div>
        </div>
      )}

      <div className="border-t pt-4">
        <p className="text-sm text-gray-600 mb-3">Need guidance?</p>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <ExternalLink className="w-4 h-4" />
            Homebuying Tips
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <ExternalLink className="w-4 h-4" />
            FAQ
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default WhatsNextCard;
