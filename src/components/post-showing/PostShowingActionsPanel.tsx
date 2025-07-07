
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Calendar, Heart, User, FileText, CheckCircle } from "lucide-react";
import { useEnhancedPostShowingActions } from "@/hooks/useEnhancedPostShowingActions";
import EnhancedOfferTypeDialog from "./EnhancedOfferTypeDialog";
import AgentProfileModal from "./AgentProfileModal";
import FavoritePropertyModal from "./FavoritePropertyModal";
import { PostShowingWorkflowService } from '@/services/postShowingWorkflowService';

interface PostShowingActionsPanelProps {
  showingId: string;
  buyerId: string;
  agentId?: string;
  agentName?: string;
  agentEmail?: string;
  agentPhone?: string;
  propertyAddress: string;
  onActionCompleted?: (actionType: string) => void;
  onRequestShowing?: () => void;
  onDataRefresh?: () => void; // Add this prop for triggering dashboard refresh
}

const PostShowingActionsPanel = ({
  showingId,
  buyerId,
  agentId,
  agentName,
  agentEmail,
  agentPhone,
  propertyAddress,
  onActionCompleted,
  onRequestShowing,
  onDataRefresh
}: PostShowingActionsPanelProps) => {
  const [showOfferDialog, setShowOfferDialog] = useState(false);
  const [showAgentProfile, setShowAgentProfile] = useState(false);
  const [showFavoriteModal, setShowFavoriteModal] = useState(false);
  const [completedActions, setCompletedActions] = useState<Set<string>>(new Set());

  const {
    isSubmitting,
    scheduleAnotherTour,
    hireAgent,
    favoriteProperty
  } = useEnhancedPostShowingActions();

  const handleActionComplete = async (actionType: string) => {
    setCompletedActions(prev => new Set([...prev, actionType]));
    
    // Notify workflow service and agent
    if (agentId) {
      await PostShowingWorkflowService.notifyAgentOfBuyerAction({
        showingId,
        buyerId,
        agentId,
        actionType,
        actionDetails: { property_address: propertyAddress, agent_name: agentName }
      });
    }

    // Trigger dashboard refresh
    if (onDataRefresh) {
      onDataRefresh();
    }

    if (onActionCompleted) {
      onActionCompleted(actionType);
    }
  };

  const handleScheduleAnotherTour = async () => {
    // Record the action for analytics
    await scheduleAnotherTour(buyerId, showingId);
    await handleActionComplete('scheduled_more_tours');
    
    // Open the property request modal
    if (onRequestShowing) {
      onRequestShowing();
    }
  };

  const handleHireAgentClick = () => {
    if (!agentId) return;
    setShowAgentProfile(true);
  };

  const handleConfirmHireAgent = async () => {
    if (!agentId) return;
    
    await hireAgent({
      showingId,
      buyerId,
      agentId,
      propertyAddress,
      agentName
    });
    
    setShowAgentProfile(false);
    await handleActionComplete('hired_agent');
  };

  const handleMakeOffer = () => {
    setShowOfferDialog(true);
  };

  const handleOfferDialogClose = async () => {
    setShowOfferDialog(false);
    await handleActionComplete('make_offer');
  };

  const handleFavoriteProperty = async (notes?: string) => {
    console.log('Favoriting property from post-showing panel:', propertyAddress);
    
    await favoriteProperty({
      showingId,
      buyerId,
      propertyAddress,
      agentName
    }, notes);
    
    setShowFavoriteModal(false);
    await handleActionComplete('favorited');
    
    console.log('Property favorited, triggering dashboard refresh');
  };

  const actions = [
    {
      id: 'scheduled_more_tours',
      title: 'Schedule Another Tour',
      description: 'Find more properties to visit',
      icon: Calendar,
      onClick: handleScheduleAnotherTour,
      variant: 'outline' as const,
      available: true
    },
    {
      id: 'hired_agent',
      title: `Work with ${agentName}`,
      description: 'Get dedicated agent support',
      icon: User,
      onClick: handleHireAgentClick,
      variant: 'outline' as const,
      available: !!agentId && !!agentName
    },
    {
      id: 'make_offer',
      title: 'Make an Offer',
      description: 'Ready to buy this property',
      icon: FileText,
      onClick: handleMakeOffer,
      variant: 'outline' as const,
      available: true
    },
    {
      id: 'favorited',
      title: 'Save to Favorites',
      description: 'Keep track of this property',
      icon: Heart,
      onClick: () => setShowFavoriteModal(true),
      variant: 'outline' as const,
      available: true
    }
  ];

  return (
    <>
      <Card className="border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <MessageCircle className="h-5 w-5 text-blue-600" />
            What's Next for {propertyAddress}?
          </CardTitle>
          <p className="text-sm text-gray-600">
            Choose your next step to continue your home buying journey
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {actions.filter(action => action.available).map((action) => {
              const isCompleted = completedActions.has(action.id);
              const Icon = action.icon;
              
              return (
                <Button
                  key={action.id}
                  onClick={action.onClick}
                  disabled={isSubmitting || isCompleted}
                  variant={action.variant}
                  className={`h-auto p-4 border-2 transition-all relative ${
                    isCompleted 
                      ? 'border-green-200 bg-green-50 hover:bg-green-100' 
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="relative">
                      <Icon className={`h-5 w-5 ${isCompleted ? 'text-green-600' : 'text-gray-600'}`} />
                      {isCompleted && (
                        <CheckCircle className="h-3 w-3 text-green-600 absolute -top-1 -right-1" />
                      )}
                    </div>
                    <div className="text-left flex-1">
                      <div className={`font-semibold ${isCompleted ? 'text-green-900' : 'text-gray-900'}`}>
                        {action.title}
                      </div>
                      <div className={`text-xs ${isCompleted ? 'text-green-600' : 'text-gray-500'}`}>
                        {isCompleted ? 'Completed' : action.description}
                      </div>
                    </div>
                    {isCompleted && (
                      <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50">
                        Done
                      </Badge>
                    )}
                  </div>
                </Button>
              );
            })}
          </div>

          {completedActions.size > 0 && (
            <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-800 font-medium">
                Great progress! You've completed {completedActions.size} action{completedActions.size > 1 ? 's' : ''}.
              </p>
              <p className="text-xs text-green-600 mt-1">
                We'll keep you updated on any developments with this property.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <EnhancedOfferTypeDialog
        isOpen={showOfferDialog}
        onClose={handleOfferDialogClose}
        propertyAddress={propertyAddress}
        agentId={agentId}
        agentName={agentName}
        buyerId={buyerId}
        showingRequestId={showingId}
      />

      <AgentProfileModal
        isOpen={showAgentProfile}
        onClose={() => setShowAgentProfile(false)}
        onConfirmHire={handleConfirmHireAgent}
        agentName={agentName}
        agentEmail={agentEmail}
        agentPhone={agentPhone}
        isSubmitting={isSubmitting}
      />

      <FavoritePropertyModal
        isOpen={showFavoriteModal}
        onClose={() => setShowFavoriteModal(false)}
        onSave={handleFavoriteProperty}
        propertyAddress={propertyAddress}
        isSubmitting={isSubmitting}
      />
    </>
  );
};

export default PostShowingActionsPanel;
