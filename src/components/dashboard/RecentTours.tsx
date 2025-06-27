import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  CheckCircle, 
  Calendar, 
  MapPin, 
  MessageCircle,
  CalendarX,
  DollarSign,
  Eye,
  FileText
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ShowingRequest {
  id: string;
  property_address: string;
  preferred_date: string | null;
  preferred_time: string | null;
  status: string;
  created_at: string;
  assigned_agent_id?: string | null;
  assigned_agent_name?: string | null;
}

interface RecentToursProps {
  pendingRequests: ShowingRequest[];
  activeShowings: ShowingRequest[];
  completedShowings: ShowingRequest[];
  onChatWithAgent: (showing: ShowingRequest) => void;
  onReschedule: (showing: ShowingRequest) => void;
  onMakeOffer: (propertyAddress: string) => void;
  onConfirmShowing?: (showing: ShowingRequest) => void;
}

const RecentTours = ({
  pendingRequests,
  activeShowings,
  completedShowings,
  onChatWithAgent,
  onReschedule,
  onMakeOffer,
  onConfirmShowing
}: RecentToursProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
      case 'submitted':
      case 'under_review':
        return 'bg-yellow-100 text-yellow-800';
      case 'agent_assigned':
        return 'bg-blue-100 text-blue-800';
      case 'confirmed':
      case 'agent_confirmed':
      case 'scheduled':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
      case 'submitted':
        return 'Pending Review';
      case 'under_review':
        return 'Under Review';
      case 'agent_assigned':
        return 'Agent Assigned';
      case 'confirmed':
      case 'agent_confirmed':
        return 'Confirmed';
      case 'scheduled':
        return 'Scheduled';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const renderShowingCard = (showing: ShowingRequest, type: 'pending' | 'active' | 'completed') => (
    <Card key={showing.id} className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0" />
            <span className="font-medium truncate">{showing.property_address}</span>
          </div>
          <Badge className={`text-xs ${getStatusColor(showing.status)}`}>
            {getStatusText(showing.status)}
          </Badge>
        </div>

        {showing.preferred_date && (
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
            <Calendar className="h-4 w-4" />
            {new Date(showing.preferred_date).toLocaleDateString()}
            {showing.preferred_time && (
              <span>at {showing.preferred_time}</span>
            )}
          </div>
        )}

        {showing.assigned_agent_name && (
          <div className="text-sm text-gray-600 mb-3">
            Agent: {showing.assigned_agent_name}
          </div>
        )}

        <div className="text-xs text-gray-500 mb-4">
          Requested {formatDistanceToNow(new Date(showing.created_at), { addSuffix: true })}
        </div>

        <div className="flex gap-2 flex-wrap">
          {type === 'pending' && (
            <>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onReschedule(showing)}
                className="text-blue-600 border-blue-600 hover:bg-blue-50"
              >
                <CalendarX className="w-4 h-4 mr-1" />
                Reschedule
              </Button>
            </>
          )}

          {type === 'active' && (
            <>
              {showing.assigned_agent_id && (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onChatWithAgent(showing)}
                  className="text-purple-600 border-purple-600 hover:bg-purple-50"
                >
                  <MessageCircle className="w-4 h-4 mr-1" />
                  Chat
                </Button>
              )}
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onReschedule(showing)}
                className="text-blue-600 border-blue-600 hover:bg-blue-50"
              >
                <CalendarX className="w-4 h-4 mr-1" />
                Reschedule
              </Button>
              {/* Enhanced handling for awaiting_agreement status */}
              {showing.status === 'awaiting_agreement' && onConfirmShowing && (
                <Button 
                  size="sm" 
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
                  onClick={() => onConfirmShowing(showing)}
                >
                  <FileText className="w-4 h-4 mr-1" />
                  Sign Agreement
                </Button>
              )}
              {showing.status === 'agent_confirmed' && onConfirmShowing && (
                <Button 
                  size="sm" 
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => onConfirmShowing(showing)}
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Confirm
                </Button>
              )}
            </>
          )}

          {type === 'completed' && showing.status === 'completed' && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onMakeOffer(showing.property_address)}
              className="text-green-600 border-green-600 hover:bg-green-50"
            >
              <DollarSign className="w-4 h-4 mr-1" />
              Make Offer
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Pending Tours */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5 text-yellow-600" />
            Pending Tours ({pendingRequests.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingRequests.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 font-medium">No pending tours</p>
              <p className="text-sm text-gray-500">Ready to start your search?</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingRequests.slice(0, 3).map(showing => 
                renderShowingCard(showing, 'pending')
              )}
              {pendingRequests.length > 3 && (
                <div className="text-center">
                  <Button variant="ghost" size="sm" className="text-blue-600">
                    View All ({pendingRequests.length})
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active Tours */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Active Tours ({activeShowings.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeShowings.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 font-medium">No active tours</p>
              <p className="text-sm text-gray-500">Confirmed tours will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeShowings.slice(0, 3).map(showing => 
                renderShowingCard(showing, 'active')
              )}
              {activeShowings.length > 3 && (
                <div className="text-center">
                  <Button variant="ghost" size="sm" className="text-blue-600">
                    View All ({activeShowings.length})
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Completed Tours */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Eye className="h-5 w-5 text-blue-600" />
            Recent History ({completedShowings.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {completedShowings.length === 0 ? (
            <div className="text-center py-8">
              <Eye className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 font-medium">No tour history</p>
              <p className="text-sm text-gray-500">Completed tours will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {completedShowings.slice(0, 3).map(showing => 
                renderShowingCard(showing, 'completed')
              )}
              {completedShowings.length > 3 && (
                <div className="text-center">
                  <Button variant="ghost" size="sm" className="text-blue-600">
                    View All ({completedShowings.length})
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RecentTours;
