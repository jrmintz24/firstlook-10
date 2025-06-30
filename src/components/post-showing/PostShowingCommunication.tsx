
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Calendar, Heart, User, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useEnhancedPostShowingActions } from "@/hooks/useEnhancedPostShowingActions";
import OfferTypeDialog from "./OfferTypeDialog";
import AgentProfileModal from "./AgentProfileModal";

interface PostShowingCommunicationProps {
  showingId: string;
  userType: 'buyer' | 'agent';
  showingStatus: string;
  agentName?: string;
  propertyAddress: string;
  onActionTaken?: () => void;
}

const PostShowingCommunication = ({
  showingId,
  userType,
  showingStatus,
  agentName,
  propertyAddress,
  onActionTaken
}: PostShowingCommunicationProps) => {
  const [showOfferDialog, setShowOfferDialog] = useState(false);
  const [showAgentProfile, setShowAgentProfile] = useState(false);
  const [favoriteNotes, setFavoriteNotes] = useState("");
  const [showNotesInput, setShowNotesInput] = useState(false);
  const { toast } = useToast();
  
  const {
    isSubmitting,
    scheduleAnotherTour,
    hireAgent,
    makeOfferAgentAssisted,
    makeOfferFirstLook,
    favoriteProperty
  } = useEnhancedPostShowingActions();

  // Only show for completed showings
  if (showingStatus !== 'completed') {
    return null;
  }

  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  };

  const getShowingDetails = async () => {
    const { data: showing } = await supabase
      .from('showing_requests')
      .select('assigned_agent_id, assigned_agent_email, assigned_agent_phone')
      .eq('id', showingId)
      .single();
    
    return showing;
  };

  const handleScheduleAnotherTour = async () => {
    const user = await getCurrentUser();
    if (!user) return;

    await scheduleAnotherTour(user.id);
    if (onActionTaken) onActionTaken();
  };

  const handleHireAgentClick = () => {
    setShowAgentProfile(true);
  };

  const handleConfirmHireAgent = async () => {
    const user = await getCurrentUser();
    const showing = await getShowingDetails();
    if (!user || !showing?.assigned_agent_id) return;

    await hireAgent({
      showingId,
      buyerId: user.id,
      agentId: showing.assigned_agent_id,
      propertyAddress,
      agentName
    });
    
    setShowAgentProfile(false);
    if (onActionTaken) onActionTaken();
  };

  const handleMakeOffer = () => {
    setShowOfferDialog(true);
  };

  const handleOfferAgentAssisted = async (qualificationData?: any) => {
    const user = await getCurrentUser();
    const showing = await getShowingDetails();
    if (!user || !showing?.assigned_agent_id) return;

    await makeOfferAgentAssisted({
      showingId,
      buyerId: user.id,
      agentId: showing.assigned_agent_id,
      propertyAddress,
      agentName,
      buyerQualification: qualificationData
    });
    if (onActionTaken) onActionTaken();
  };

  const handleOfferFirstLook = async (qualificationData?: any) => {
    const user = await getCurrentUser();
    const showing = await getShowingDetails();
    if (!user) return;

    await makeOfferFirstLook({
      showingId,
      buyerId: user.id,
      agentId: showing?.assigned_agent_id,
      propertyAddress,
      agentName,
      buyerQualification: qualificationData
    });
    if (onActionTaken) onActionTaken();
  };

  const handleFavoriteProperty = async () => {
    if (showNotesInput) {
      const user = await getCurrentUser();
      if (!user) return;

      await favoriteProperty({
        showingId,
        buyerId: user.id,
        propertyAddress,
        agentName
      }, favoriteNotes);
      
      setShowNotesInput(false);
      setFavoriteNotes("");
      if (onActionTaken) onActionTaken();
    } else {
      setShowNotesInput(true);
    }
  };

  return (
    <>
      <Card className="mt-6 border-gray-200 bg-gray-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <MessageCircle className="h-5 w-5" />
            What's Next?
          </CardTitle>
          <p className="text-sm text-gray-600">
            Thanks for touring {propertyAddress}! Choose your next step:
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {userType === 'buyer' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button
                  onClick={handleScheduleAnotherTour}
                  disabled={isSubmitting}
                  variant="outline"
                  className="h-auto p-4 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-gray-600" />
                    <div className="text-left">
                      <div className="font-semibold text-gray-900">Schedule Another Tour</div>
                      <div className="text-xs text-gray-500">Find more properties</div>
                    </div>
                  </div>
                </Button>
                
                {agentName && (
                  <Button
                    onClick={handleHireAgentClick}
                    disabled={isSubmitting}
                    variant="outline"
                    className="h-auto p-4 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-gray-600" />
                      <div className="text-left">
                        <div className="font-semibold text-gray-900">Hire {agentName}</div>
                        <div className="text-xs text-gray-500">Work together long-term</div>
                      </div>
                    </div>
                  </Button>
                )}
                
                <Button
                  onClick={handleMakeOffer}
                  disabled={isSubmitting}
                  variant="outline"
                  className="h-auto p-4 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-gray-600" />
                    <div className="text-left">
                      <div className="font-semibold text-gray-900">Make an Offer</div>
                      <div className="text-xs text-gray-500">Ready to buy this one</div>
                    </div>
                  </div>
                </Button>
                
                <Button
                  onClick={handleFavoriteProperty}
                  disabled={isSubmitting}
                  variant="outline"
                  className="h-auto p-4 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <Heart className="h-5 w-5 text-gray-600" />
                    <div className="text-left">
                      <div className="font-semibold text-gray-900">Favorite Property</div>
                      <div className="text-xs text-gray-500">Save for later</div>
                    </div>
                  </div>
                </Button>
              </div>

              {showNotesInput && (
                <div className="space-y-2 p-3 bg-white rounded-lg border border-gray-200">
                  <label className="text-sm font-medium text-gray-700">
                    Add a note about what you liked (optional):
                  </label>
                  <Textarea
                    value={favoriteNotes}
                    onChange={(e) => setFavoriteNotes(e.target.value)}
                    placeholder="Great location, loved the kitchen, needs some updates..."
                    rows={2}
                  />
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleFavoriteProperty}
                      size="sm"
                      disabled={isSubmitting}
                    >
                      Save to Favorites
                    </Button>
                    <Button 
                      onClick={() => {
                        setShowNotesInput(false);
                        setFavoriteNotes("");
                      }}
                      variant="outline"
                      size="sm"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}

          {userType === 'agent' && (
            <div className="text-center p-4 bg-white rounded-lg border">
              <p className="text-sm text-gray-600 mb-2">
                Buyer actions will appear here. You'll be notified when they want to hire you, make offers, or schedule more tours.
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
        isSubmitting={isSubmitting}
      />
    </>
  );
};

export default PostShowingCommunication;
