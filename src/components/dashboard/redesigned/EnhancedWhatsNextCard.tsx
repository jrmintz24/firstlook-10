
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, Calendar, UserPlus, Heart, FileText, AlertCircle } from "lucide-react";
import { usePostShowingActionsManager } from "@/hooks/usePostShowingActionsManager";
import { useEffect, useState } from "react";

interface EnhancedWhatsNextCardProps {
  buyerId?: string;
  completedShowings: any[];
  onMakeOffer: () => void;
  onWorkWithAgent?: (agentData: any) => void;
  onScheduleAnotherTour?: () => void;
  onSeeOtherProperties?: () => void;
  isLoading?: boolean;
}

const EnhancedWhatsNextCard = ({ 
  buyerId,
  completedShowings,
  onMakeOffer,
  onWorkWithAgent,
  onScheduleAnotherTour,
  onSeeOtherProperties,
  isLoading = false
}: EnhancedWhatsNextCardProps) => {
  const { 
    fetchActionsForShowing, 
    hasCompletedAction, 
    getCompletedActionTypes,
    getAgentFromShowing,
    recordAction 
  } = usePostShowingActionsManager(buyerId);
  
  const [showingActions, setShowingActions] = useState<Record<string, string[]>>({});
  const [availableAgents, setAvailableAgents] = useState<any[]>([]);

  // Load actions for all completed showings
  useEffect(() => {
    const loadShowingActions = async () => {
      if (!completedShowings.length) return;

      const actionsMap: Record<string, string[]> = {};
      const agents: any[] = [];

      for (const showing of completedShowings) {
        await fetchActionsForShowing(showing.id);
        actionsMap[showing.id] = getCompletedActionTypes(showing.id);
        
        const agent = getAgentFromShowing(showing);
        if (agent.available && !agents.find(a => a.id === agent.id)) {
          agents.push({
            ...agent,
            showingId: showing.id,
            propertyAddress: showing.property_address
          });
        }
      }

      setShowingActions(actionsMap);
      setAvailableAgents(agents);
    };

    loadShowingActions();
  }, [completedShowings, fetchActionsForShowing, getCompletedActionTypes, getAgentFromShowing]);

  const totalCompletedActions = Object.values(showingActions).flat().length;
  const hasAnyActions = totalCompletedActions > 0;

  const handleActionClick = async (actionType: string, handler?: () => void) => {
    if (handler) {
      handler();
    }

    // Record the action for the most recent showing
    if (completedShowings.length > 0) {
      await recordAction(completedShowings[0].id, actionType);
    }
  };

  const handleWorkWithAgent = () => {
    if (availableAgents.length > 0 && onWorkWithAgent) {
      onWorkWithAgent(availableAgents[0]);
    }
  };

  if (completedShowings.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">What's Next?</h3>
        <div className="flex items-center gap-3 text-gray-600">
          <Circle className="w-5 h-5" />
          <span>Complete your first tour to see next steps</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">What's Next?</h3>
        {hasAnyActions && (
          <Badge variant="secondary" className="text-xs">
            {totalCompletedActions} action{totalCompletedActions > 1 ? 's' : ''} taken
          </Badge>
        )}
      </div>
      
      {/* Progress Summary */}
      <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="font-medium text-green-800">
            Great! You've completed {completedShowings.length} tour{completedShowings.length > 1 ? 's' : ''}
          </span>
        </div>
        <p className="text-sm text-green-700">
          Now let's help you take the next step in your home buying journey.
        </p>
      </div>

      {/* Primary Action - Make Offer */}
      <div className="mb-6">
        <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h4 className="font-semibold text-green-800 mb-1">Love what you saw?</h4>
              <p className="text-sm text-green-700">Get expert help crafting a winning offer strategy</p>
            </div>
            <Button 
              size="lg"
              onClick={() => handleActionClick('make_offer', onMakeOffer)} 
              disabled={isLoading}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-md"
            >
              <FileText className="w-4 h-4 mr-2" />
              Make an Offer
            </Button>
          </div>
        </div>
      </div>

      {/* Post-Tour Actions */}
      <div className="border-t pt-6">
        <p className="text-sm font-medium text-gray-700 mb-4">Available Actions:</p>
        <div className="grid grid-cols-1 gap-3">
          {availableAgents.length > 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2 justify-start h-auto p-4"
              onClick={() => handleActionClick('work_with_agent', handleWorkWithAgent)}
              disabled={isLoading}
            >
              <div className="flex items-center gap-3 w-full">
                <UserPlus className="w-5 h-5 text-purple-600" />
                <div className="text-left flex-1">
                  <div className="font-medium text-gray-900">Work with {availableAgents[0].name}</div>
                  <div className="text-xs text-gray-500">Get dedicated agent support</div>
                </div>
                {hasCompletedAction(availableAgents[0].showingId, 'work_with_agent') && (
                  <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50 text-xs">
                    Done
                  </Badge>
                )}
              </div>
            </Button>
          )}

          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2 justify-start h-auto p-4"
            onClick={() => handleActionClick('schedule_another_tour', onScheduleAnotherTour)}
            disabled={isLoading}
          >
            <div className="flex items-center gap-3 w-full">
              <Calendar className="w-5 h-5 text-blue-600" />
              <div className="text-left flex-1">
                <div className="font-medium text-gray-900">Schedule Another Tour</div>
                <div className="text-xs text-gray-500">Find more properties to visit</div>
              </div>
              {completedShowings.some(s => hasCompletedAction(s.id, 'schedule_another_tour')) && (
                <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50 text-xs">
                  Done
                </Badge>
              )}
            </div>
          </Button>

          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2 justify-start h-auto p-4"
            onClick={() => handleActionClick('favorite_property', onSeeOtherProperties)}
            disabled={isLoading}
          >
            <div className="flex items-center gap-3 w-full">
              <Heart className="w-5 h-5 text-red-600" />
              <div className="text-left flex-1">
                <div className="font-medium text-gray-900">Save Favorites</div>
                <div className="text-xs text-gray-500">Keep track of properties you liked</div>
              </div>
              {completedShowings.some(s => hasCompletedAction(s.id, 'favorite_property')) && (
                <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50 text-xs">
                  Done
                </Badge>
              )}
            </div>
          </Button>
        </div>
      </div>

      {/* Help Section */}
      {availableAgents.length === 0 && (
        <div className="border-t pt-4 mt-4">
          <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-800">No agent data available</p>
              <p className="text-xs text-amber-700 mt-1">
                Complete more tours with assigned agents to unlock agent collaboration features.
              </p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default EnhancedWhatsNextCard;
