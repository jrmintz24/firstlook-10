import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle, MessageSquare, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

interface ShowingRequestCardProps {
  showing: ShowingRequest;
  onCancel: (id: string) => void;
  onReschedule: (id: string) => void;
  onConfirm?: (request: ShowingRequest) => void;
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
  const handleCancel = () => {
    onCancel(showing.id);
    onComplete?.();
  };

  const handleReschedule = () => {
    onReschedule(showing.id);
    onComplete?.();
  };

  const handleConfirm = () => {
    onConfirm?.(showing);
    onComplete?.();
  };

  const handleSendMessageClick = () => {
    onSendMessage?.(showing.id);
  };

  const getStatusInfo = (status: string) => {
    const statusMap = {
      'pending': {
        color: 'bg-gray-100 text-gray-800 border-gray-200',
        label: 'Pending',
        icon: Clock,
        description: 'Your request is being processed'
      },
      'submitted': {
        color: 'bg-gray-100 text-gray-800 border-gray-200',
        label: 'Submitted',
        icon: Clock,
        description: 'Your request has been submitted'
      },
      'under_review': {
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        label: 'Under Review',
        icon: Clock,
        description: 'Your request is under review'
      },
      'agent_assigned': {
        color: 'bg-purple-100 text-purple-800 border-purple-200',
        label: 'Agent Assigned',
        icon: Clock,
        description: 'An agent has been assigned to your request'
      },
      'confirmed': {
        color: 'bg-green-100 text-green-800 border-green-200',
        label: 'Confirmed',
        icon: CheckCircle,
        description: 'Your showing is confirmed'
      },
      'agent_confirmed': {
        color: 'bg-green-100 text-green-800 border-green-200',
        label: 'Confirmed',
        icon: CheckCircle,
        description: 'Your showing is confirmed'
      },
      'scheduled': {
        color: 'bg-green-100 text-green-800 border-green-200',
        label: 'Scheduled',
        icon: Calendar,
        description: 'Your showing is scheduled'
      },
      'completed': {
        color: 'bg-green-100 text-green-800 border-green-200',
        label: 'Completed',
        icon: CheckCircle,
        description: 'Your showing is completed'
      },
      'cancelled': {
        color: 'bg-red-100 text-red-800 border-red-200',
        label: 'Cancelled',
        icon: Clock,
        description: 'Your showing has been cancelled'
      },
      'awaiting_agreement': {
        color: 'bg-amber-100 text-amber-800 border-amber-200',
        label: 'Awaiting Agreement',
        icon: Clock,
        description: 'Check your email to sign the tour agreement'
      },
    };

    return statusMap[status] || {
      color: 'bg-gray-100 text-gray-800 border-gray-200',
      label: status.replace('_', ' ').toUpperCase(),
      icon: Clock,
      description: ''
    };
  };

  const statusInfo = getStatusInfo(showing.status);

  return (
    <Card className="shadow-sm border border-gray-200/60">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-medium text-gray-800">{showing.property_address}</h3>
            <p className="text-sm text-gray-600">
              {showing.preferred_date} at {showing.preferred_time}
            </p>
            <Badge className={`mt-2 ${statusInfo.color}`}>
              <statusInfo.icon className="h-3 w-3 mr-1" />
              {statusInfo.label}
            </Badge>
            {statusInfo.description && (
              <p className="text-xs text-gray-500 mt-1">{statusInfo.description}</p>
            )}
          </div>
        </div>
        {showing.assigned_agent_name && userType === 'buyer' && (
          <div className="mt-4 border-t pt-4">
            <h4 className="text-sm font-medium text-gray-700">Your Agent</h4>
            <p className="text-xs text-gray-500">
              {showing.assigned_agent_name} - {showing.assigned_agent_phone}
            </p>
            <p className="text-xs text-gray-500">
              {showing.assigned_agent_email}
            </p>
          </div>
        )}
        {showActions && (
          <div className="flex justify-end gap-2 mt-4">
            {showing.status === 'pending' && (
              <>
                <Button variant="outline" size="sm" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleReschedule}>
                  Reschedule
                </Button>
              </>
            )}
            {showing.status === 'submitted' && (
              <Button variant="outline" size="sm" onClick={handleCancel}>
                Cancel
              </Button>
            )}
            {showing.status === 'under_review' && (
              <Button variant="outline" size="sm" onClick={handleCancel}>
                Cancel
              </Button>
            )}
            {showing.status === 'agent_assigned' && (
              <>
                <Button variant="outline" size="sm" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleConfirm}>
                  Confirm
                </Button>
              </>
            )}
            {showing.status === 'confirmed' && (
              <Button variant="outline" size="sm" onClick={handleCancel}>
                Cancel
              </Button>
            )}
            {showing.status === 'awaiting_agreement' && (
              <Button variant="outline" size="sm" onClick={handleCancel}>
                Cancel
              </Button>
            )}
            {['confirmed', 'agent_confirmed', 'scheduled'].includes(showing.status) && (
              <Button size="sm" onClick={handleSendMessageClick}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Message Agent
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ShowingRequestCard;
