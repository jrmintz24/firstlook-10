
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Calendar, Heart, User, FileText, CheckCircle, RotateCcw } from "lucide-react";
import { useEnhancedPostShowingActions } from "@/hooks/useEnhancedPostShowingActions";
import { usePostShowingActions } from "@/hooks/usePostShowingActions";
// Removed EnhancedOfferTypeDialog import - now going directly to offer questionnaire
import AgentProfileModal from "./AgentProfileModal";
import FavoritePropertyModal from "./FavoritePropertyModal";
import EnhancedOfferModal from "../offer-workflow/EnhancedOfferModal";
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
  // Removed showOfferDialog state - no longer using dialog
  const [showAgentProfile, setShowAgentProfile] = useState(false);
  const [showFavoriteModal, setShowFavoriteModal] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);

  const {
    isSubmitting,
    scheduleAnotherTour,
    hireAgent,
    favoriteProperty
  } = useEnhancedPostShowingActions();

  const {
    getActionsForShowing,
    hasAction,
    getActionCount,
    recordAction,
    removeAction,
    loading: actionsLoading
  } = usePostShowingActions();

  // Get current action states for this showing
  const actionStates = getActionsForShowing(showingId);
  const actionCount = getActionCount(showingId);

  const handleActionComplete = async (actionType: 'favorited' | 'made_offer' | 'hired_agent' | 'scheduled_more_tours') => {
    // Record action in database
    const success = await recordAction(showingId, actionType, {
      property_address: propertyAddress,
      agent_name: agentName,
      agent_id: agentId
    });

    if (!success) {
      console.error(`Failed to record action: ${actionType}`);
      return;
    }
    
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

  const handleActionUndo = async (actionType: 'favorited' | 'hired_agent') => {
    const success = await removeAction(showingId, actionType);
    
    if (!success) {
      console.error(`Failed to undo action: ${actionType}`);
      return;
    }

    // Trigger dashboard refresh
    if (onDataRefresh) {
      onDataRefresh();
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

  const handleMakeOffer = async () => {
    // Record the action first
    await handleActionComplete('made_offer');
    
    // Open the quick offer modal instead of navigating
    setShowOfferModal(true);
  };

  // Removed handleOfferDialogClose - no longer using dialog

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
      available: true,
      completed: actionStates.scheduled_more_tours,
      canUndo: false
    },
    {
      id: 'hired_agent',
      title: `Work with ${agentName}`,
      description: 'Get dedicated agent support',
      icon: User,
      onClick: handleHireAgentClick,
      variant: 'outline' as const,
      available: !!agentId && !!agentName,
      completed: actionStates.hired_agent,
      canUndo: true,
      onUndo: () => handleActionUndo('hired_agent')
    },
    {
      id: 'make_offer',
      title: 'Make an Offer',
      description: 'Ready to buy this property',
      icon: FileText,
      onClick: handleMakeOffer,
      variant: 'outline' as const,
      available: true,
      completed: actionStates.made_offer,
      canUndo: false
    },
    {
      id: 'favorited',
      title: 'Save to Favorites',
      description: 'Keep track of this property',
      icon: Heart,
      onClick: () => setShowFavoriteModal(true),
      variant: 'outline' as const,
      available: true,
      completed: actionStates.favorited,
      canUndo: true,
      onUndo: () => handleActionUndo('favorited')
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
          {actionsLoading ? (
            <div className="text-center py-4 text-gray-500">Loading actions...</div>
          ) : (
            <>
              {/* Prominent Make Offer Section */}
              {!actionStates.made_offer && (
                <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-green-800 mb-1">Ready to make an offer?</h4>
                      <p className="text-sm text-green-700">Get expert consultation to craft a winning strategy</p>
                    </div>
                    <Button 
                      onClick={handleMakeOffer}
                      disabled={isSubmitting}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-md"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Make an Offer
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Other Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {actions.filter(action => action.available).map((action) => {
                const isCompleted = action.completed;
                const Icon = action.icon;
                
                return (
                  <div key={action.id} className="relative">
                    <Button
                      onClick={action.onClick}
                      disabled={isSubmitting || isCompleted}
                      variant={action.variant}
                      className={`h-auto p-3 border transition-all w-full text-sm ${
                        isCompleted 
                          ? 'border-green-200 bg-green-50 hover:bg-green-100' 
                          : action.id === 'make_offer'
                          ? 'border-green-300 bg-green-50 hover:bg-green-100 hover:border-green-400'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div className="relative flex-shrink-0">
                          <Icon className={`h-4 w-4 ${
                            isCompleted 
                              ? 'text-green-600' 
                              : action.id === 'make_offer' 
                              ? 'text-green-600' 
                              : 'text-gray-600'
                          }`} />
                          {isCompleted && (
                            <CheckCircle className="h-3 w-3 text-green-600 absolute -top-1 -right-1" />
                          )}
                        </div>
                        <div className="text-left flex-1 min-w-0">
                          <div className={`font-medium text-sm leading-tight ${isCompleted ? 'text-green-900' : 'text-gray-900'}`}>
                            {action.title}
                          </div>
                          <div className={`text-xs mt-0.5 leading-tight ${isCompleted ? 'text-green-600' : 'text-gray-500'}`}>
                            {isCompleted ? 'Completed' : action.description}
                          </div>
                        </div>
                        {isCompleted && (
                          <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50 text-xs px-2 py-0.5 flex-shrink-0">
                            Done
                          </Badge>
                        )}
                      </div>
                    </Button>
                    
                    {/* Undo button for reversible actions */}
                    {isCompleted && action.canUndo && action.onUndo && (
                      <Button
                        onClick={action.onUndo}
                        variant="ghost"
                        size="sm"
                        className="absolute -top-1 -right-1 h-5 w-5 p-0 bg-white border border-gray-200 hover:bg-gray-50 rounded-full shadow-sm"
                        title={`Undo ${action.title}`}
                      >
                        <RotateCcw className="h-2.5 w-2.5 text-gray-500" />
                      </Button>
                    )}
                  </div>
                );
              })}
              </div>
            </>
          )}

          {actionCount > 0 && (
            <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-800 font-medium">
                Great progress! You've completed {actionCount} action{actionCount > 1 ? 's' : ''}.
              </p>
              <p className="text-xs text-green-600 mt-1">
                We'll keep you updated on any developments with this property.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Removed EnhancedOfferTypeDialog - now going directly to offer questionnaire */}

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

      <EnhancedOfferModal
        isOpen={showOfferModal}
        onClose={() => setShowOfferModal(false)}
        propertyAddress={propertyAddress}
        buyerId={buyerId}
        agentId={agentId}
      />
    </>
  );
};

export default PostShowingActionsPanel;
