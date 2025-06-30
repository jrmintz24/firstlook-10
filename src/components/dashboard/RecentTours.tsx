
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Calendar, 
  Clock, 
  MessageCircle, 
  FileText, 
  CheckCircle2,
  AlertCircle,
  User,
  Phone
} from "lucide-react";
import PostShowingActions from "./PostShowingActions";
import { usePostShowingDashboardData } from "@/hooks/usePostShowingDashboardData";

interface RecentToursProps {
  pendingRequests: any[];
  activeShowings: any[];
  completedShowings: any[];
  onChatWithAgent: (showing: any) => void;
  onReschedule: (showing: any) => void;
  onMakeOffer: (propertyAddress: string) => void;
  onConfirmShowing: (showing: any) => void;
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
  const [expandedShowing, setExpandedShowing] = useState<string | null>(null);
  
  // Get current user ID for dashboard data
  const currentUserId = pendingRequests[0]?.user_id || activeShowings[0]?.user_id || completedShowings[0]?.user_id || '';
  const { actionsSummary } = usePostShowingDashboardData(currentUserId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <AlertCircle className="w-3 h-3" />;
      case 'confirmed': return <Calendar className="w-3 h-3" />;
      case 'completed': return <CheckCircle2 className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  const renderShowingCard = (showing: any) => {
    const isExpanded = expandedShowing === showing.id;
    
    return (
      <Card key={showing.id} className="border-gray-200 hover:border-gray-300 transition-colors">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <h3 className="font-medium text-gray-900 truncate">{showing.property_address}</h3>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                {showing.preferred_date && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(showing.preferred_date).toLocaleDateString()}
                  </div>
                )}
                {showing.preferred_time && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {showing.preferred_time}
                  </div>
                )}
              </div>

              {showing.assigned_agent_name && (
                <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                  <User className="w-3 h-3" />
                  <span>Agent: {showing.assigned_agent_name}</span>
                </div>
              )}
            </div>

            <Badge className={`${getStatusColor(showing.status)} border`}>
              {getStatusIcon(showing.status)}
              <span className="ml-1 capitalize">{showing.status}</span>
            </Badge>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {showing.status === 'pending' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onConfirmShowing(showing)}
              >
                Confirm Tour
              </Button>
            )}

            {showing.status === 'confirmed' && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onReschedule(showing)}
                >
                  Reschedule
                </Button>
                {showing.assigned_agent_id && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onChatWithAgent(showing)}
                  >
                    <MessageCircle className="w-3 h-3 mr-1" />
                    Message Agent
                  </Button>
                )}
              </>
            )}

            {showing.status === 'completed' && (
              <Button
                variant={isExpanded ? "secondary" : "outline"}
                size="sm"
                onClick={() => setExpandedShowing(isExpanded ? null : showing.id)}
              >
                {isExpanded ? 'Hide Actions' : 'Show Actions'}
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onMakeOffer(showing.property_address)}
              className="text-green-600 hover:text-green-700"
            >
              <FileText className="w-3 h-3 mr-1" />
              Make Offer
            </Button>
          </div>

          {/* Expanded post-showing actions */}
          {isExpanded && showing.status === 'completed' && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <PostShowingActions
                showingId={showing.id}
                userType="buyer"
                showingStatus={showing.status}
                agentName={showing.assigned_agent_name}
                agentId={showing.assigned_agent_id}
                agentEmail={showing.assigned_agent_email}
                agentPhone={showing.assigned_agent_phone}
                propertyAddress={showing.property_address}
                buyerId={showing.user_id}
                onActionTaken={() => {
                  // Optional: refresh data or show success message
                  console.log('Action taken for showing:', showing.id);
                }}
              />
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const allShowings = [
    ...pendingRequests.map(s => ({ ...s, priority: 3 })),
    ...activeShowings.map(s => ({ ...s, priority: 2 })),
    ...completedShowings.slice(0, 5).map(s => ({ ...s, priority: 1 }))
  ].sort((a, b) => b.priority - a.priority);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Recent Tours</span>
            <Badge variant="secondary">
              {allShowings.length} total
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {allShowings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No tours scheduled yet</p>
              <p className="text-sm">Request your first property tour to get started!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {allShowings.map(renderShowingCard)}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Activity Summary for completed tours */}
      {completedShowings.length > 0 && (
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <CheckCircle2 className="h-5 w-5" />
              Your Tour Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-900">{completedShowings.length}</div>
                <div className="text-sm text-blue-600">Completed Tours</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-900">{actionsSummary.favoritedProperties}</div>
                <div className="text-sm text-green-600">Favorites</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-900">{actionsSummary.agentConnections}</div>
                <div className="text-sm text-purple-600">Agent Connections</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RecentTours;
