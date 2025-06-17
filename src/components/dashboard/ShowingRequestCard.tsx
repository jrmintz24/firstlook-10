
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, User, Phone, Mail, AlertCircle, CheckCircle, MessageCircle, Edit } from "lucide-react";
import { getStatusInfo, getEstimatedTimeline, type ShowingStatus } from "@/utils/showingStatus";
import ShowingCheckoutButton from "./ShowingCheckoutButton";
import PostShowingTrigger from "@/components/post-showing/PostShowingTrigger";
import PostShowingCommunication from "@/components/post-showing/PostShowingCommunication";
import MessageIndicator from "@/components/messaging/MessageIndicator";
import TourProgressTracker from "./TourProgressTracker";
import ChatInitiator from "@/components/messaging/ChatInitiator";
import RescheduleModal from "./RescheduleModal";

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
  onSendMessage
}: ShowingRequestCardProps) => {
  const [showChatModal, setShowChatModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  
  const statusInfo = getStatusInfo(showing.status as ShowingStatus);
  const timeline = getEstimatedTimeline(showing.status as ShowingStatus);

  // Only show messaging for confirmed showings that have an assigned agent
  const canSendMessage = showing.assigned_agent_id && 
                        ['confirmed', 'agent_confirmed', 'scheduled', 'in_progress'].includes(showing.status);

  const handleChatClick = () => {
    if (canSendMessage) {
      setShowChatModal(true);
    }
  };

  const handleRescheduleClick = () => {
    setShowRescheduleModal(true);
  };

  const handleRescheduleSuccess = () => {
    setShowRescheduleModal(false);
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <>
      <Card className="group shadow-sm border border-gray-200/80 hover:shadow-lg hover:border-purple-200/60 transition-all duration-300 bg-gradient-to-br from-white to-gray-50/30">
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
                <Badge className={`${statusInfo.bgColor} ${statusInfo.color} border-0 px-3 py-1 text-sm font-medium shadow-sm`}>
                  <span className="mr-2">{statusInfo.icon}</span>
                  {statusInfo.label}
                </Badge>
                {showing.status_updated_at && (
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    Updated {new Date(showing.status_updated_at).toLocaleDateString()}
                  </span>
                )}
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-3 group-hover:text-purple-700 transition-colors">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                  <MapPin className="h-5 w-5 text-purple-600" />
                </div>
                {showing.property_address}
              </h3>

              {['pending', 'agent_assigned', 'confirmed', 'scheduled'].includes(showing.status) && (
                <div className="mb-6">
                  <TourProgressTracker showing={showing} userType={userType} />
                </div>
              )}

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100 mb-6">
                <div className="text-sm font-semibold text-blue-900 mb-2">Current Status</div>
                <div className="text-blue-700 text-sm mb-2">{statusInfo.description}</div>
                <div className="text-blue-600 text-xs font-medium">{timeline}</div>
              </div>

              {currentUserId && canSendMessage && (
                <div className="mb-4">
                  <MessageIndicator
                    showingRequestId={showing.id}
                    userId={currentUserId}
                    onSendMessage={handleChatClick}
                    compact={false}
                  />
                </div>
              )}

              {showing.preferred_date && (
                <div className="flex items-center gap-8 text-gray-700 mb-4 p-3 bg-gray-50 rounded-lg">
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

              {showing.estimated_confirmation_date && (
                <div className="flex items-center gap-3 text-green-700 mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium">
                    Expected confirmation by {new Date(showing.estimated_confirmation_date).toLocaleDateString()}
                  </span>
                </div>
              )}

              {showing.assigned_agent_name && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200 mb-4">
                  <div className="text-sm font-semibold text-green-900 mb-3 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Your Showing Partner
                  </div>
                  <div className="text-green-800 font-bold text-lg mb-2">{showing.assigned_agent_name}</div>
                  <div className="flex items-center gap-6">
                    {showing.assigned_agent_phone && (
                      <div className="flex items-center gap-2 text-green-700 text-sm">
                        <Phone className="h-3 w-3" />
                        <span>{showing.assigned_agent_phone}</span>
                      </div>
                    )}
                    {showing.assigned_agent_email && (
                      <div className="flex items-center gap-2 text-green-700 text-sm">
                        <Mail className="h-3 w-3" />
                        <span>{showing.assigned_agent_email}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {showing.message && (
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-4">
                  <div className="text-sm font-semibold text-gray-800 mb-2">Your Notes</div>
                  <div className="text-gray-700 text-sm leading-relaxed">{showing.message}</div>
                </div>
              )}

              <p className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full inline-block">
                Requested on {new Date(showing.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          {showActions && ['submitted', 'under_review', 'agent_assigned', 'confirmed', 'pending', 'scheduled'].includes(showing.status) && (
            <div className="flex gap-3 flex-wrap pt-4 border-t border-gray-100">
              {canSendMessage && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleChatClick}
                  className="flex items-center gap-2 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  Chat with Agent
                </Button>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={handleRescheduleClick}
                className="flex items-center gap-2 border-orange-200 text-orange-700 hover:bg-orange-50 hover:border-orange-300 transition-all duration-200 shadow-sm"
              >
                <Edit className="w-4 h-4" />
                Reschedule
              </Button>

              {showing.status === 'confirmed' && onConfirm && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onConfirm(showing.id)} 
                  className="border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 transition-all duration-200 shadow-sm"
                >
                  Confirm & Sign
                </Button>
              )}
              
              <ShowingCheckoutButton
                showing={showing}
                userType={userType}
                onComplete={onComplete}
              />
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => onCancel(showing.id)}
                className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 transition-all duration-200 shadow-sm"
              >
                Cancel
              </Button>
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
