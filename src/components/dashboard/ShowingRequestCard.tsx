
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
  const statusInfo = getStatusInfo(showing.status as ShowingStatus);
  const timeline = getEstimatedTimeline(showing.status as ShowingStatus);

  return (
    <Card className="shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        {/* Post-showing workflow trigger */}
        <PostShowingTrigger
          showingId={showing.id}
          status={showing.status}
          preferredDate={showing.preferred_date || undefined}
          preferredTime={showing.preferred_time || undefined}
        />

        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <Badge className={`${statusInfo.bgColor} ${statusInfo.color} border-0`}>
                <span className="mr-1">{statusInfo.icon}</span>
                {statusInfo.label}
              </Badge>
              {showing.status_updated_at && (
                <span className="text-xs text-gray-500">
                  Updated {new Date(showing.status_updated_at).toLocaleDateString()}
                </span>
              )}
            </div>
            
            <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-purple-500" />
              {showing.property_address}
            </h3>

            {/* Tour Progress Tracker - only show for active showings */}
            {['pending', 'agent_assigned', 'confirmed', 'scheduled'].includes(showing.status) && (
              <div className="mb-4">
                <TourProgressTracker showing={showing} userType={userType} />
              </div>
            )}

            {/* Status Description */}
            <div className="bg-blue-50 p-3 rounded-lg mb-4">
              <div className="text-sm font-medium text-blue-800 mb-1">Current Status</div>
              <div className="text-blue-600 text-sm mb-2">{statusInfo.description}</div>
              <div className="text-blue-500 text-xs">{timeline}</div>
            </div>

            {/* Message Indicator */}
            {currentUserId && (
              <MessageIndicator
                showingRequestId={showing.id}
                userId={currentUserId}
                onSendMessage={onSendMessage}
                compact={false}
              />
            )}

            {/* Date/Time Info */}
            {showing.preferred_date && (
              <div className="flex items-center gap-6 text-gray-600 mb-3">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(showing.preferred_date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
                {showing.preferred_time && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{showing.preferred_time}</span>
                  </div>
                )}
              </div>
            )}

            {/* Estimated Confirmation Date */}
            {showing.estimated_confirmation_date && (
              <div className="flex items-center gap-2 text-green-600 mb-3">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">
                  Expected confirmation by {new Date(showing.estimated_confirmation_date).toLocaleDateString()}
                </span>
              </div>
            )}

            {/* Agent Information */}
            {showing.assigned_agent_name && (
              <div className="bg-green-50 p-3 rounded-lg mb-4">
                <div className="text-sm font-medium text-green-800 mb-2 flex items-center gap-1">
                  <User className="h-4 w-4" />
                  Your Showing Partner
                </div>
                <div className="text-green-700 font-medium">{showing.assigned_agent_name}</div>
                <div className="flex items-center gap-4 mt-2">
                  {showing.assigned_agent_phone && (
                    <div className="flex items-center gap-1 text-green-600 text-sm">
                      <Phone className="h-3 w-3" />
                      <span>{showing.assigned_agent_phone}</span>
                    </div>
                  )}
                  {showing.assigned_agent_email && (
                    <div className="flex items-center gap-1 text-green-600 text-sm">
                      <Mail className="h-3 w-3" />
                      <span>{showing.assigned_agent_email}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Notes */}
            {showing.message && (
              <div className="bg-gray-50 p-3 rounded-lg mb-4">
                <div className="text-sm font-medium text-gray-800 mb-1">Your Notes</div>
                <div className="text-gray-600 text-sm">{showing.message}</div>
              </div>
            )}

            <p className="text-xs text-gray-400">
              Requested on {new Date(showing.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Actions */}
        {showActions && ['submitted', 'under_review', 'agent_assigned', 'confirmed', 'pending', 'scheduled'].includes(showing.status) && (
          <div className="flex gap-2 flex-wrap">
            {/* Chat Button */}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onSendMessage?.(showing.id)}
              className="flex items-center gap-2 border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              <MessageCircle className="w-4 h-4" />
              Chat
            </Button>

            {/* Reschedule Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onReschedule(showing.id)}
              className="flex items-center gap-2 border-orange-200 text-orange-700 hover:bg-orange-50"
            >
              <Edit className="w-4 h-4" />
              Reschedule
            </Button>

            {showing.status === 'confirmed' && onConfirm && (
              <Button variant="outline" size="sm" onClick={() => onConfirm(showing.id)} className="border-green-200 text-green-700 hover:bg-green-50">
                Confirm & Sign
              </Button>
            )}
            
            {/* Show checkout button for active showings */}
            <ShowingCheckoutButton
              showing={showing}
              userType={userType}
              onComplete={onComplete}
            />
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCancel(showing.id)}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              Cancel
            </Button>
          </div>
        )}

        {/* Post-showing communication */}
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
  );
};

export default ShowingRequestCard;
