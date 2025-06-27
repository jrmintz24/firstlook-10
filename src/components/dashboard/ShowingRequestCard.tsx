
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, MapPin, User, Phone, Mail, AlertCircle, CheckCircle, MessageCircle, Edit, FileText, X, UserPlus } from "lucide-react";
import { getStatusInfo, getEstimatedTimeline, type ShowingStatus } from "@/utils/showingStatus";
import ShowingCheckoutButton from "./ShowingCheckoutButton";
import PostShowingTrigger from "@/components/post-showing/PostShowingTrigger";
import PostShowingCommunication from "@/components/post-showing/PostShowingCommunication";
import MessageIndicator from "@/components/messaging/MessageIndicator";
import TourProgressTracker from "./TourProgressTracker";
import ChatInitiator from "@/components/messaging/ChatInitiator";
import RescheduleModal from "./RescheduleModal";
import StatusBadge from "./shared/StatusBadge";
import InteractiveButton from "./shared/InteractiveButton";

interface ShowingRequest {
  id: string;
  property_address: string;
  preferred_date: string | null;
  preferred_time: string | null;
  message: string | null;
  status: string;
  created_at: string;
  assigned_agent_name?: string | null;
  assigned_agent_phone?: string | null;
  assigned_agent_email?: string | null;
  assigned_agent_id?: string | null;
  estimated_confirmation_date?: string | null;
  status_updated_at?: string | null;
  user_id?: string | null;
}

interface ShowingRequestCardProps {
  showing: ShowingRequest;
  onCancel: (id: string) => void;
  onReschedule: (id: string) => void;
  onConfirm?: (id: string) => void;
  showActions?: boolean;
  userType?: 'buyer' | 'agent';
  onComplete?: () => void;
  currentUserId?: string;
  onSendMessage?: (showingId: string) => void;
  agreements?: Record<string, boolean>;
}

const ShowingRequestCard = ({ 
  showing, 
  onCancel, 
  onReschedule, 
  onConfirm, 
  showActions = true,
  userType = 'buyer',
  onComplete,
  currentUserId,
  onSendMessage,
  agreements = {}
}: ShowingRequestCardProps) => {
  const [showChatModal, setShowChatModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  
  const statusInfo = getStatusInfo(showing.status as ShowingStatus);
  const timeline = getEstimatedTimeline(showing.status as ShowingStatus);
  const isAgreementSigned = agreements[showing.id];

  // Enhanced button visibility logic for different user types
  const canSendMessage = showing.assigned_agent_id && 
                        ['confirmed', 'agent_confirmed', 'scheduled', 'in_progress'].includes(showing.status);
  
  // Buyer-specific buttons
  const showBuyerRescheduleButton = userType === 'buyer' && 
    ['submitted', 'under_review', 'agent_assigned', 'pending', 'confirmed', 'agent_confirmed', 'scheduled'].includes(showing.status);
  
  const showBuyerCancelButton = userType === 'buyer' && 
    ['submitted', 'under_review', 'agent_assigned', 'pending'].includes(showing.status);
  
  // Agent-specific buttons
  const showAgentAcceptButton = userType === 'agent' && 
    showing.status === 'pending' && !showing.assigned_agent_id && onConfirm;
  
  const showAgentRescheduleButton = userType === 'agent' && 
    showing.assigned_agent_id === currentUserId &&
    ['agent_assigned', 'confirmed', 'agent_confirmed', 'scheduled'].includes(showing.status);
  
  // Shared buttons
  const showConfirmButton = showing.status === 'awaiting_agreement' && onConfirm;

  const handleChatClick = () => {
    if (canSendMessage) {
      setShowChatModal(true);
    }
  };

  const handleRescheduleClick = () => {
    setShowRescheduleModal(true);
  };

  const handleCancelClick = () => {
    onCancel(showing.id);
  };

  const handleAcceptClick = () => {
    if (onConfirm) {
      onConfirm(showing.id);
    }
  };

  const handleRescheduleSuccess = () => {
    setShowRescheduleModal(false);
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <>
      <Card className="group shadow-sm border border-gray-200/80 hover:shadow-xl hover:border-purple-200/60 transition-all duration-300 bg-white hover:-translate-y-1 transform">
        <CardContent className="p-6">
          <PostShowingTrigger
            showingId={showing.id}
            status={showing.status}
            preferredDate={showing.preferred_date || undefined}
            preferredTime={showing.preferred_time || undefined}
          />

          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <StatusBadge 
                  status={showing.status} 
                  size="md" 
                  animated={true}
                />
                {showing.status_updated_at && (
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full transition-colors duration-200 hover:bg-gray-200">
                    Updated {new Date(showing.status_updated_at).toLocaleDateString()}
                  </span>
                )}
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-3 group-hover:text-purple-700 transition-colors duration-200">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-all duration-200 group-hover:scale-110">
                  <MapPin className="h-5 w-5 text-purple-600" />
                </div>
                {showing.property_address}
              </h3>

              {['pending', 'agent_assigned', 'confirmed', 'scheduled'].includes(showing.status) && (
                <div className="mb-6 animate-fade-in">
                  <TourProgressTracker showing={showing} userType={userType} />
                </div>
              )}

              {/* Current Status - only show for non-confirmed statuses or awaiting_agreement */}
              {(showing.status === 'awaiting_agreement' || !['confirmed', 'agent_confirmed', 'scheduled'].includes(showing.status)) && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100 mb-6 hover:shadow-md transition-all duration-200">
                  <div className="text-sm font-semibold text-blue-900 mb-2">Current Status</div>
                  <div className="text-blue-700 text-sm mb-2">{statusInfo.description}</div>
                  <div className="text-blue-600 text-xs font-medium">{timeline}</div>
                </div>
              )}

              {/* Message Indicator */}
              {currentUserId && canSendMessage && (
                <div className="mb-4 animate-fade-in">
                  <MessageIndicator
                    showingRequestId={showing.id}
                    userId={currentUserId}
                    onSendMessage={handleChatClick}
                    compact={false}
                  />
                </div>
              )}

              {/* Date and Time */}
              {showing.preferred_date && (
                <div className="flex items-center gap-8 text-gray-700 mb-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-purple-500" />
                    <span className="font-medium">{new Date(showing.preferred_date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                  {showing.preferred_time && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-purple-500" />
                      <span className="font-medium">{showing.preferred_time}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Estimated Confirmation Date */}
              {showing.estimated_confirmation_date && (
                <div className="flex items-center gap-3 text-green-700 mb-4 p-3 bg-green-50 rounded-lg border border-green-200 hover:shadow-md transition-all duration-200">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium">
                    Expected confirmation by {new Date(showing.estimated_confirmation_date).toLocaleDateString()}
                  </span>
                </div>
              )}

              {/* Agent Information */}
              {showing.assigned_agent_name && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200 mb-4 hover:shadow-md transition-all duration-200">
                  <div className="text-sm font-semibold text-green-900 mb-3 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Your Showing Partner
                  </div>
                  <div className="text-green-800 font-bold text-lg mb-2">{showing.assigned_agent_name}</div>
                  <div className="flex items-center gap-6">
                    {showing.assigned_agent_phone && (
                      <div className="flex items-center gap-2 text-green-700 text-sm hover:text-green-800 transition-colors duration-200">
                        <Phone className="h-3 w-3" />
                        <span>{showing.assigned_agent_phone}</span>
                      </div>
                    )}
                    {showing.assigned_agent_email && (
                      <div className="flex items-center gap-2 text-green-700 text-sm hover:text-green-800 transition-colors duration-200">
                        <Mail className="h-3 w-3" />
                        <span>{showing.assigned_agent_email}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* User Message */}
              {showing.message && (
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-4 hover:bg-gray-100 transition-colors duration-200">
                  <div className="text-sm font-semibold text-gray-800 mb-2">Your Notes</div>
                  <div className="text-gray-700 text-sm leading-relaxed">{showing.message}</div>
                </div>
              )}

              <p className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full inline-block hover:bg-gray-200 transition-colors duration-200">
                Requested on {new Date(showing.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Agreement Required Section */}
          {showConfirmButton && (
            <div className="mb-6 p-4 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl hover:shadow-md transition-all duration-200 animate-fade-in">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-orange-900 mb-2">Agreement Required</h4>
                  <p className="text-orange-800 text-sm mb-3">
                    Your tour has been confirmed by the agent! Please sign the tour agreement below to finalize your appointment.
                  </p>
                  <p className="text-orange-700 text-xs mb-3">
                    You can sign the agreement right here in your dashboard - no need to check email.
                  </p>
                  <InteractiveButton
                    onClick={() => onConfirm && onConfirm(showing.id)}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold"
                    icon={FileText}
                  >
                    Sign Agreement Now
                  </InteractiveButton>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Action Buttons */}
          {showActions && (
            <div className="flex gap-3 flex-wrap pt-4 border-t border-gray-100">
              {canSendMessage && (
                <InteractiveButton 
                  variant="outline" 
                  size="sm" 
                  onClick={handleChatClick}
                  className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 shadow-sm"
                  icon={MessageCircle}
                >
                  Chat with {userType === 'buyer' ? 'Agent' : 'Client'}
                </InteractiveButton>
              )}

              {/* Agent Accept Button */}
              {showAgentAcceptButton && (
                <InteractiveButton
                  onClick={handleAcceptClick}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold"
                  icon={UserPlus}
                >
                  Accept & Confirm
                </InteractiveButton>
              )}

              {/* Buyer Reschedule Button */}
              {showBuyerRescheduleButton && (
                <InteractiveButton
                  variant="outline"
                  size="sm"
                  onClick={handleRescheduleClick}
                  className="border-orange-200 text-orange-700 hover:bg-orange-50 hover:border-orange-300 shadow-sm"
                  icon={Edit}
                >
                  Reschedule
                </InteractiveButton>
              )}

              {/* Agent Reschedule Button */}
              {showAgentRescheduleButton && (
                <InteractiveButton
                  variant="outline"
                  size="sm"
                  onClick={handleRescheduleClick}
                  className="border-orange-200 text-orange-700 hover:bg-orange-50 hover:border-orange-300 shadow-sm"
                  icon={Edit}
                >
                  Reschedule
                </InteractiveButton>
              )}

              {/* Buyer Cancel Button */}
              {showBuyerCancelButton && (
                <InteractiveButton
                  variant="outline"
                  size="sm"
                  onClick={handleCancelClick}
                  className="border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 shadow-sm"
                  icon={X}
                >
                  Cancel Tour
                </InteractiveButton>
              )}
              
              <ShowingCheckoutButton
                showing={showing}
                userType={userType}
                onComplete={onComplete}
              />
            </div>
          )}

          <PostShowingCommunication
            showingId={showing.id}
            userType={userType}
            showingStatus={showing.status}
            agentName={showing.assigned_agent_name || undefined}
            propertyAddress={showing.property_address}
            onActionTaken={onComplete}
          />
        </CardContent>
      </Card>

      {/* Chat Modal */}
      {showChatModal && showing.assigned_agent_id && currentUserId && (
        <ChatInitiator
          showingRequestId={showing.id}
          agentId={showing.assigned_agent_id}
          buyerId={currentUserId}
          propertyAddress={showing.property_address}
          isOpen={showChatModal}
          onClose={() => setShowChatModal(false)}
        />
      )}

      {/* Reschedule Modal */}
      {showRescheduleModal && (
        <RescheduleModal
          showingRequest={showing}
          isOpen={showRescheduleModal}
          onClose={() => setShowRescheduleModal(false)}
          onSuccess={handleRescheduleSuccess}
        />
      )}
    </>
  );
};

export default ShowingRequestCard;
