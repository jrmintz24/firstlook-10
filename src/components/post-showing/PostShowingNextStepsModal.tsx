import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Calendar, 
  Users, 
  MessageCircle, 
  FileText,
  Star,
  User
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

  const handleOfferInterest = () => {
    setShowOfferDialog(true);
  };

  const handleOfferDialogClose = () => {
    setShowOfferDialog(false);
    onClose();
    onActionTaken?.();
  };

  const handleOtherAction = (actionType: string) => {
    // Handle other actions (favorite, schedule another tour, etc.)
    console.log('Action taken:', actionType);
    onActionTaken?.();
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen && !showOfferDialog} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              What's your next step?
            </DialogTitle>
            <p className="text-gray-600">
              How did you feel about {propertyAddress}? Let us know what you'd like to do next.
            </p>
          </DialogHeader>

          <div className="space-y-3">
            {/* Make an Offer / Work with Agent */}
            <Card 
              className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-green-200"
              onClick={handleOfferInterest}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <FileText className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">I'm interested in making an offer</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Get help preparing a competitive offer or schedule a consultation with your agent
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs">Expert guidance</Badge>
                      <Badge variant="secondary" className="text-xs">Quick setup</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Schedule Another Tour */}
            <Card 
              className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-blue-200"
              onClick={() => handleOtherAction('schedule_another_tour')}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">Schedule another tour</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Want to see this property again or bring someone with you?
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Save as Favorite */}
            <Card 
              className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-pink-200"
              onClick={() => handleOtherAction('favorite_property')}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-pink-100 rounded-lg">
                    <Heart className="h-5 w-5 text-pink-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">Save as favorite</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Keep this property in your favorites list for future reference
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ask Questions */}
            <Card 
              className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-purple-200"
              onClick={() => handleOtherAction('ask_questions')}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <MessageCircle className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">Ask questions about the property</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Get answers about the neighborhood, pricing, or property details
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Not Interested */}
            <Card 
              className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-gray-200"
              onClick={() => handleOtherAction('not_interested')}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Users className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">Not the right fit</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      This property isn't what I'm looking for, but I'd like to continue searching
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={onClose}>
              I'll decide later
            </Button>
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
