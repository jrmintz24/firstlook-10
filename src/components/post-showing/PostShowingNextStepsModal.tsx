
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, FileText, MessageSquare, Star, Building, User } from "lucide-react";
import FavoritePropertyModal from "./FavoritePropertyModal";
import EnhancedOfferTypeDialog from "./EnhancedOfferTypeDialog";
import AgentProfileModal from "./AgentProfileModal";

interface PostShowingNextStepsModalProps {
  isOpen: boolean;
  onClose: () => void;
  showing: {
    id: string;
    property_address: string;
    assigned_agent_name?: string;
    assigned_agent_id?: string;
    assigned_agent_email?: string;
    assigned_agent_phone?: string;
  };
  buyerId: string;
}

const PostShowingNextStepsModal = ({
  isOpen,
  onClose,
  showing,
  buyerId
}: PostShowingNextStepsModalProps) => {
  const [showFavoriteModal, setShowFavoriteModal] = useState(false);
  const [showOfferDialog, setShowOfferDialog] = useState(false);
  const [showAgentProfile, setShowAgentProfile] = useState(false);

  const handleFavoriteComplete = async (notes?: string) => {
    console.log('Saving favorite with notes:', notes);
    setShowFavoriteModal(false);
  };

  const handleOfferComplete = () => {
    setShowOfferDialog(false);
  };

  const handleAgentProfileClose = () => {
    setShowAgentProfile(false);
  };

  const handleConfirmHire = () => {
    console.log('Confirming agent hire');
    setShowAgentProfile(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl bg-white">
          <DialogHeader className="text-center">
            <DialogTitle className="text-2xl font-bold text-gray-900 mb-2">
              What's Next?
            </DialogTitle>
            <p className="text-gray-600">
              Choose your next steps for {showing.property_address}
            </p>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {/* Make an Offer */}
            <Card 
              className="border-2 border-gray-200 bg-white hover:border-gray-300 hover:shadow-md transition-all cursor-pointer group"
              onClick={() => setShowOfferDialog(true)}
            >
              <CardHeader className="text-center pb-3">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-gray-200 transition-colors">
                  <FileText className="w-6 h-6 text-gray-700" />
                </div>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Make an Offer
                </CardTitle>
                <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                  Recommended
                </Badge>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-gray-600 mb-3">
                  Start the comprehensive offer preparation process. GCAAR/MAR compliant with market analysis.
                </p>
                <div className="flex flex-wrap justify-center gap-1">
                  <Badge variant="outline" className="text-xs bg-gray-50">Market Analysis</Badge>
                  <Badge variant="outline" className="text-xs bg-gray-50">Agent-Ready</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Save as Favorite */}
            <Card 
              className="border-2 border-gray-200 bg-white hover:border-gray-300 hover:shadow-md transition-all cursor-pointer group"
              onClick={() => setShowFavoriteModal(true)}
            >
              <CardHeader className="text-center pb-3">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-gray-200 transition-colors">
                  <Heart className="w-6 h-6 text-gray-700" />
                </div>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Save as Favorite
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-gray-600">
                  Keep this property in your favorites list to compare with others and come back to later.
                </p>
              </CardContent>
            </Card>

            {/* Work with Agent */}
            {showing.assigned_agent_name && (
              <Card 
                className="border-2 border-gray-200 bg-white hover:border-gray-300 hover:shadow-md transition-all cursor-pointer group"
                onClick={() => setShowAgentProfile(true)}
              >
                <CardHeader className="text-center pb-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-gray-200 transition-colors">
                    <Building className="w-6 h-6 text-gray-700" />
                  </div>
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    Work with {showing.assigned_agent_name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-gray-600">
                    Connect with your showing agent for ongoing representation and additional properties.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Send Message */}
            <Card 
              className="border-2 border-gray-200 bg-white hover:border-gray-300 hover:shadow-md transition-all cursor-pointer group"
            >
              <CardHeader className="text-center pb-3">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-gray-200 transition-colors">
                  <MessageSquare className="w-6 h-6 text-gray-700" />
                </div>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Send Message
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-gray-600">
                  Ask questions or share feedback about the property with your agent.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Action */}
          <div className="text-center pt-6 border-t">
            <Button variant="outline" onClick={onClose} className="text-gray-600 hover:text-gray-900">
              I'll decide later
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modals */}
      <FavoritePropertyModal
        isOpen={showFavoriteModal}
        onClose={() => setShowFavoriteModal(false)}
        onSave={handleFavoriteComplete}
        propertyAddress={showing.property_address}
      />

      <EnhancedOfferTypeDialog
        isOpen={showOfferDialog}
        onClose={() => setShowOfferDialog(false)}
        showing={showing}
        buyerId={buyerId}
      />

      {showing.assigned_agent_name && (
        <AgentProfileModal
          isOpen={showAgentProfile}
          onClose={handleAgentProfileClose}
          onConfirmHire={handleConfirmHire}
          agentName={showing.assigned_agent_name}
          agentEmail={showing.assigned_agent_email}
          agentPhone={showing.assigned_agent_phone}
        />
      )}
    </>
  );
};

export default PostShowingNextStepsModal;
