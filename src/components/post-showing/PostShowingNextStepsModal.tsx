
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Calendar, 
  User, 
  FileText,
  Star,
  CheckCircle
} from "lucide-react";
import EnhancedOfferTypeDialog from "./EnhancedOfferTypeDialog";

interface PostShowingNextStepsModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyAddress: string;
  agentId?: string;
  agentName?: string;
  buyerId?: string;
  showingRequestId?: string;
  onActionTaken?: () => void;
}

const PostShowingNextStepsModal = ({
  isOpen,
  onClose,
  propertyAddress,
  agentId,
  agentName,
  buyerId,
  showingRequestId,
  onActionTaken
}: PostShowingNextStepsModalProps) => {
  const [showOfferDialog, setShowOfferDialog] = useState(false);
  const [completedActions, setCompletedActions] = useState<Set<string>>(new Set());

  const handleOfferInterest = () => {
    setShowOfferDialog(true);
  };

  const handleOfferDialogClose = () => {
    setShowOfferDialog(false);
    onClose();
    onActionTaken?.();
  };

  const handleOtherAction = (actionType: string) => {
    setCompletedActions(prev => new Set([...prev, actionType]));
    onActionTaken?.();
    onClose();
  };

  const actions = [
    {
      id: 'schedule_another_tour',
      title: 'Schedule Another Tour',
      description: 'Find more properties to visit',
      icon: Calendar,
      onClick: () => handleOtherAction('schedule_another_tour'),
      available: true
    },
    {
      id: 'hire_agent',
      title: `Work with ${agentName || 'Agent'}`,
      description: 'Get dedicated agent support',
      icon: User,
      onClick: () => handleOtherAction('hire_agent'),
      available: !!agentId && !!agentName
    },
    {
      id: 'make_offer',
      title: 'Make an Offer',
      description: 'Ready to buy this property',
      icon: FileText,
      onClick: handleOfferInterest,
      available: true
    },
    {
      id: 'favorite_property',
      title: 'Save to Favorites',
      description: 'Keep track of this property',
      icon: Heart,
      onClick: () => handleOtherAction('favorite_property'),
      available: true
    }
  ];

  return (
    <>
      <Dialog open={isOpen && !showOfferDialog} onOpenChange={onClose}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              What's Next for {propertyAddress}?
            </DialogTitle>
            <p className="text-sm text-gray-600">
              Choose your next step to continue your home buying journey
            </p>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {actions.filter(action => action.available).map((action) => {
                const isCompleted = completedActions.has(action.id);
                const Icon = action.icon;
                
                return (
                  <Button
                    key={action.id}
                    onClick={action.onClick}
                    disabled={isCompleted}
                    variant="outline"
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

            <div className="flex justify-end pt-2">
              <Button variant="ghost" onClick={onClose} className="text-gray-500">
                I'll decide later
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <EnhancedOfferTypeDialog
        isOpen={showOfferDialog}
        onClose={handleOfferDialogClose}
        propertyAddress={propertyAddress}
        agentId={agentId}
        agentName={agentName}
        buyerId={buyerId}
        showingRequestId={showingRequestId}
      />
    </>
  );
};

export default PostShowingNextStepsModal;
