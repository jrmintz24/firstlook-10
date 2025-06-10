
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, User, Phone, Mail, AlertCircle, CheckCircle, UserPlus } from "lucide-react";
import { getStatusInfo, getEstimatedTimeline, type ShowingStatus } from "@/utils/showingStatus";

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
  estimated_confirmation_date?: string | null;
  status_updated_at?: string | null;
  user_id?: string | null;
}

interface AgentRequestCardProps {
  request: ShowingRequest;
  onAssign: () => void;
  onUpdateStatus: (status: string, estimatedDate?: string) => void;
  onSendMessage: () => void;
  onAccept?: () => void;
  showAssignButton: boolean;
}

const AgentRequestCard = ({ request, onAssign, onUpdateStatus, onSendMessage, onAccept, showAssignButton }: AgentRequestCardProps) => {
  const statusInfo = getStatusInfo(request.status as ShowingStatus);
  const timeline = getEstimatedTimeline(request.status as ShowingStatus);

  return (
    <Card className="shadow-lg border-0">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <Badge className={`${statusInfo.bgColor} ${statusInfo.color} border-0`}>
                <span className="mr-1">{statusInfo.icon}</span>
                {statusInfo.label}
              </Badge>
              {request.status_updated_at && (
                <span className="text-xs text-gray-500">
                  Updated {new Date(request.status_updated_at).toLocaleDateString()}
                </span>
              )}
            </div>
            
            <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-purple-500" />
              {request.property_address}
            </h3>

            {/* Status Description */}
            <div className="bg-blue-50 p-3 rounded-lg mb-4">
              <div className="text-sm font-medium text-blue-800 mb-1">Current Status</div>
              <div className="text-blue-600 text-sm mb-2">{statusInfo.description}</div>
              <div className="text-blue-500 text-xs">{timeline}</div>
            </div>

            {/* Date/Time Info */}
            {request.preferred_date && (
              <div className="flex items-center gap-6 text-gray-600 mb-3">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(request.preferred_date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
                {request.preferred_time && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{request.preferred_time}</span>
                  </div>
                )}
              </div>
            )}

            {/* Estimated Confirmation Date */}
            {request.estimated_confirmation_date && (
              <div className="flex items-center gap-2 text-green-600 mb-3">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">
                  Expected confirmation by {new Date(request.estimated_confirmation_date).toLocaleDateString()}
                </span>
              </div>
            )}

            {/* Agent Information */}
            {request.assigned_agent_name && (
              <div className="bg-green-50 p-3 rounded-lg mb-4">
                <div className="text-sm font-medium text-green-800 mb-2 flex items-center gap-1">
                  <User className="h-4 w-4" />
                  Assigned Agent
                </div>
                <div className="text-green-700 font-medium">{request.assigned_agent_name}</div>
                <div className="flex items-center gap-4 mt-2">
                  {request.assigned_agent_phone && (
                    <div className="flex items-center gap-1 text-green-600 text-sm">
                      <Phone className="h-3 w-3" />
                      <span>{request.assigned_agent_phone}</span>
                    </div>
                  )}
                  {request.assigned_agent_email && (
                    <div className="flex items-center gap-1 text-green-600 text-sm">
                      <Mail className="h-3 w-3" />
                      <span>{request.assigned_agent_email}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Notes */}
            {request.message && (
              <div className="bg-gray-50 p-3 rounded-lg mb-4">
                <div className="text-sm font-medium text-gray-800 mb-1">Client Notes</div>
                <div className="text-gray-600 text-sm">{request.message}</div>
              </div>
            )}

            <p className="text-xs text-gray-400">
              Requested on {new Date(request.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          {showAssignButton && (
            <Button
              onClick={onAssign}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Assign to Me
            </Button>
          )}

          {/* Removed the redundant "Accept Showing" button since assignment now goes directly to admin approval */}

          {!showAssignButton && ['submitted', 'under_review', 'agent_assigned', 'pending_admin_approval', 'confirmed', 'scheduled'].includes(request.status) && (
            <Button
              variant="outline"
              onClick={() => onUpdateStatus(request.status)}
              className="border-purple-200 text-purple-700 hover:bg-purple-50"
            >
              Update Status
            </Button>
          )}

          {!showAssignButton && (
            <Button variant="outline" onClick={onSendMessage} className="border-purple-200 text-purple-700 hover:bg-purple-50">
              Send Message
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentRequestCard;
