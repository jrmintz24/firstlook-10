
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import AgentRequestCard from "@/components/dashboard/AgentRequestCard";

interface ShowingRequest {
  id: string;
  property_address: string;
  preferred_date: string | null;
  preferred_time: string | null;
  message: string | null;
  status: string;
  created_at: string;
  assigned_agent_id?: string | null;
  assigned_agent_name?: string | null;
  assigned_agent_phone?: string | null;
  assigned_agent_email?: string | null;
  estimated_confirmation_date?: string | null;
  status_updated_at?: string | null;
  user_id?: string | null;
}

interface UnassignedRequestsTabProps {
  unassignedRequests: ShowingRequest[];
  onAssignToSelf: (requestId: string) => void;
  onUpdateStatus: (requestId: string) => void;
}

const UnassignedRequestsTab = ({ 
  unassignedRequests, 
  onAssignToSelf, 
  onUpdateStatus 
}: UnassignedRequestsTabProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Unassigned Requests</h2>
        <Badge variant="outline" className="text-orange-600 border-orange-200">
          {unassignedRequests.length} Available
        </Badge>
      </div>

      {unassignedRequests.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No unassigned requests</h3>
            <p className="text-gray-500">All current requests have been assigned to agents.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {unassignedRequests.map((request) => (
            <AgentRequestCard
              key={request.id}
              request={request}
              onAssign={() => onAssignToSelf(request.id)}
              onUpdateStatus={() => onUpdateStatus(request.id)}
              showAssignButton={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default UnassignedRequestsTab;
