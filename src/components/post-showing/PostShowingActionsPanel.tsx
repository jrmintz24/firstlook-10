
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Calendar, Heart, User, FileText, CheckCircle } from "lucide-react";
import { useEnhancedPostShowingActions } from "@/hooks/useEnhancedPostShowingActions";
import OfferTypeDialog from "./OfferTypeDialog";
import AgentProfileModal from "./AgentProfileModal";
import FavoritePropertyModal from "./FavoritePropertyModal";

interface PostShowingActionsPanelProps {
  showingId: string;
  buyerId: string;
  agentId?: string;
  agentName?: string;
  agentEmail?: string;
  agentPhone?: string;
  propertyAddress: string;
  onActionCompleted?: (actionType: string) => void;
}

const PostShowingActionsPanel = ({
  showingId,
  buyerId,
  agentId,
  agentName,
  agentEmail,
  agentPhone,
  propertyAddress,
  onActionCompleted
}: PostShowingActionsPanelProps) => {
  const [showOfferDialog, setShowOfferDialog] = useState(false);
  const [showAgentProfile, setShowAgentProfile] = useState(false);
  const [showFavoriteModal, setShowFavoriteModal] = useState(false);
  const [completedActions, setCompletedActions] = useState<Set<string>>(new Set());

  const {
    isSubmitting,
    scheduleAnotherTour,
    hireAgent,
    makeOfferAgentAssisted,
    makeOfferFirstLook,
    favoriteProperty
  } = useEnhancedPostShowingActions();

  const handleActionComplete = (actionType: string) => {
    setCompletedActions(prev => new Set([...prev, actionType]));
    if (onActionCompleted) {
      onActionCompleted(actionType);
    }
  };

  const handleScheduleAnotherTour = async () => {
    await scheduleAnotherTour(buyerId);
    handleActionComplete('schedule_another_tour');
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
    handleActionComplete('hire_agent');
  };

  const handleMakeOffer = () => {
    setShowOfferDialog(true);
  };

  const handleOfferAgentAssisted = async (qualificationData?: any) => {
    if (!agentId) return;

    await makeOfferAgentAssisted({
      showingId,
      buyerId,
      agentId,
      propertyAddress,
      agentName,
      buyerQualification: qualificationData
    });
    
    setShowOfferDialog(false);
    handleActionComplete('make_offer_agent_assisted');
  };

  const handleOfferFirstLook = async (qualificationData?: any) => {
    await makeOfferFirstLook({
      showingId,
      buyerId,
      agentId,
      propertyAddress,
      agentName,
      buyerQualification: qualificationData
    });
    
    setShowOfferDialog(false);
    handleActionComplete('make_offer_firstlook');
  };

  const handleFavoriteProperty = async (notes?: string) => {
    await favoriteProperty({
      showingId,
      buyerId,
      propertyAddress,
      agentName
    }, notes);
    
    setShowFavoriteModal(false);
    handleActionComplete('favorite_property');
  };

  const actions = [
    {
      id: 'schedule_another_tour',
      title: 'Schedule Another Tour',
      description: 'Find more properties to visit',
      icon: Calendar,
      onClick: handleScheduleAnotherTour,
      variant: 'outline' as const,
      available: true
    },
    {
      id: 'hire_agent',
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
      id: 'favorite_property',
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

      <OfferTypeDialog
        isOpen={showOfferDialog}
        onClose={() => setShowOfferDialog(false)}
        onSelectAgentAssisted={handleOfferAgentAssisted}
        onSelectFirstLookGenerator={handleOfferFirstLook}
        agentName={agentName}
        propertyAddress={propertyAddress}
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
