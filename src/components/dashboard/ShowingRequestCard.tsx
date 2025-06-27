
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

  // Helper function to check if showing has passed
  const hasShowingPassed = (): boolean => {
    if (!showing.preferred_date || !showing.preferred_time) return false;
    
    const showingDateTime = new Date(`${showing.preferred_date}T${showing.preferred_time}`);
    const now = new Date();
    
    return showingDateTime < now;
  };

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

  // Format time to 12-hour format
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <>
      <Card className="group shadow-sm border border-gray-200/60 hover:shadow-2xl hover:border-blue-200/40 transition-all duration-300 bg-white/95 backdrop-blur-sm hover:-translate-y-2 transform rounded-2xl overflow-hidden">
        <CardContent className="p-8">
          <PostShowingTrigger
            showingId={showing.id}
            status={showing.status}
            preferredDate={showing.preferred_date || undefined}
            preferredTime={showing.preferred_time || undefined}
          />

          <div className="flex items-start justify-between mb-8">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-6">
                <StatusBadge 
                  status={showing.status} 
                  size="md" 
                  animated={true}
                />
                {showing.status_updated_at && (
                  <span className="text-xs text-gray-500 bg-gray-100/80 px-3 py-2 rounded-full transition-colors duration-200 hover:bg-gray-200/80 font-medium">
                    Updated {new Date(showing.status_updated_at).toLocaleDateString()}
                  </span>
                )}
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-4 group-hover:text-blue-700 transition-colors duration-200">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center group-hover:from-blue-200 group-hover:to-indigo-200 transition-all duration-200 group-hover:scale-110 shadow-lg">
                  <MapPin className="h-6 w-6 text-blue-600" />
                </div>
                {showing.property_address}
              </h3>

              {/* Date and Time - Enhanced styling */}
              {showing.preferred_date && (
                <div className="flex items-center gap-8 text-gray-700 mb-6 p-4 bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-2xl border border-gray-100/50 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="font-semibold text-lg">{new Date(showing.preferred_date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                  {showing.preferred_time && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-100 rounded-xl flex items-center justify-center">
                        <Clock className="h-4 w-4 text-indigo-600" />
                      </div>
                      <span className="font-semibold text-lg">{formatTime(showing.preferred_time)}</span>
                    </div>
                  )}
                </div>
              )}

              {['pending', 'agent_assigned', 'confirmed', 'scheduled'].includes(showing.status) && (
                <div className="mb-8 animate-fade-in">
                  <TourProgressTracker showing={showing} userType={userType} />
                </div>
              )}

              {/* Enhanced Timeline display */}
              {showing.status === 'awaiting_agreement' && (
                <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-yellow-50 p-6 rounded-2xl border border-orange-200/50 mb-6 hover:shadow-lg transition-all duration-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <AlertCircle className="h-5 w-5 text-orange-600" />
                    </div>
                    <div className="text-sm font-bold text-orange-900">Current Status</div>
                  </div>
                  <div className="text-orange-800 text-sm mb-2 font-medium">{statusInfo.description}</div>
                  <div className="text-orange-700 text-xs font-semibold">{timeline}</div>
                </div>
              )}

              {/* Timeline display for other non-final statuses */}
              {!['confirmed', 'agent_confirmed', 'scheduled', 'completed', 'cancelled', 'awaiting_agreement'].includes(showing.status) && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200/50 mb-6 hover:shadow-lg transition-all duration-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Clock className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="text-sm font-bold text-blue-900">Current Status</div>
                  </div>
                  <div className="text-blue-700 text-sm mb-2 font-medium">{statusInfo.description}</div>
                  <div className="text-blue-600 text-xs font-semibold">{timeline}</div>
                </div>
              )}

              {/* Message Indicator */}
              {currentUserId && canSendMessage && (
                <div className="mb-6 animate-fade-in">
                  <MessageIndicator
                    showingRequestId={showing.id}
                    userId={currentUserId}
                    onSendMessage={handleChatClick}
                    compact={false}
                  />
                </div>
              )}

              {/* Estimated Confirmation Date - Enhanced styling */}
              {showing.estimated_confirmation_date && !showing.assigned_agent_name && (
                <div className="flex items-center gap-4 text-green-700 mb-6 p-5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200/50 hover:shadow-lg transition-all duration-200">
                  <div className="w-10 h-10 bg-green-100 rounded-2xl flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <span className="text-sm font-semibold">
                    Expected confirmation by {new Date(showing.estimated_confirmation_date).toLocaleDateString()}
                  </span>
                </div>
              )}

              {/* Agent Information - Enhanced styling */}
              {showing.assigned_agent_name && (
                <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 p-6 rounded-2xl border border-green-200/50 mb-6 hover:shadow-lg transition-all duration-200">
                  <div className="text-sm font-bold text-green-900 mb-4 flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center">
                      <User className="h-4 w-4 text-green-600" />
                    </div>
                    Your Showing Partner
                  </div>
                  <div className="text-green-800 font-bold text-xl mb-3">{showing.assigned_agent_name}</div>
                  <div className="flex items-center gap-8">
                    {showing.assigned_agent_phone && (
                      <div className="flex items-center gap-3 text-green-700 text-sm hover:text-green-800 transition-colors duration-200">
                        <Phone className="h-4 w-4" />
                        <span className="font-medium">{showing.assigned_agent_phone}</span>
                      </div>
                    )}
                    {showing.assigned_agent_email && (
                      <div className="flex items-center gap-3 text-green-700 text-sm hover:text-green-800 transition-colors duration-200">
                        <Mail className="h-4 w-4" />
                        <span className="font-medium">{showing.assigned_agent_email}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* User Message - Enhanced styling */}
              {showing.message && (
                <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-5 rounded-2xl border border-gray-200/50 mb-6 hover:bg-gray-100/50 transition-colors duration-200">
                  <div className="text-sm font-bold text-gray-800 mb-3">Your Notes</div>
                  <div className="text-gray-700 text-sm leading-relaxed font-medium">{showing.message}</div>
                </div>
              )}

              <p className="text-xs text-gray-500 bg-gray-100/80 px-4 py-2 rounded-full inline-block hover:bg-gray-200/80 transition-colors duration-200 font-medium">
                Requested on {new Date(showing.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Agreement Required Section - Enhanced styling */}
          {showConfirmButton && (
            <div className="mb-8 p-6 bg-gradient-to-r from-orange-50 via-amber-50 to-yellow-50 border border-orange-200/50 rounded-2xl hover:shadow-lg transition-all duration-200 animate-fade-in">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center flex-shrink-0 mt-1">
                  <AlertCircle className="h-6 w-6 text-orange-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-orange-900 mb-3 text-lg">Agreement Required</h4>
                  <p className="text-orange-800 text-sm mb-4 leading-relaxed">
                    Your tour has been confirmed by the agent! Please sign the tour agreement below to finalize your appointment.
                  </p>
                  <p className="text-orange-700 text-xs mb-4 leading-relaxed">
                    You can sign the agreement right here in your dashboard - no need to check email.
                  </p>
                  <InteractiveButton
                    onClick={() => onConfirm && onConfirm(showing.id)}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-6 py-3"
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
            <div className="flex gap-4 flex-wrap pt-6 border-t border-gray-100/80">
              {canSendMessage && (
                <InteractiveButton 
                  variant="outline" 
                  size="sm" 
                  onClick={handleChatClick}
                  className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 shadow-md px-4 py-2"
                  icon={MessageCircle}
                >
                  Chat with {userType === 'buyer' ? 'Agent' : 'Client'}
                </InteractiveButton>
              )}

              {/* Agent Accept Button */}
              {showAgentAcceptButton && (
                <InteractiveButton
                  onClick={handleAcceptClick}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-6 py-2"
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
                  className="border-orange-200 text-orange-700 hover:bg-orange-50 hover:border-orange-300 shadow-md px-4 py-2"
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
                  className="border-orange-200 text-orange-700 hover:bg-orange-50 hover:border-orange-300 shadow-md px-4 py-2"
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
                  className="border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 shadow-md px-4 py-2"
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

          {/* Show PostShowingCommunication for completed tours AND past confirmed tours */}
          <PostShowingCommunication
            showingId={showing.id}
            userType={userType}
            showingStatus={showing.status === 'completed' || (hasShowingPassed() && ['confirmed', 'scheduled'].includes(showing.status)) ? 'completed' : showing.status}
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
