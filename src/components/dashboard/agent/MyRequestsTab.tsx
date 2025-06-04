
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
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

interface MyRequestsTabProps {
  myRequests: ShowingRequest[];
  onUpdateStatus: (requestId: string) => void;
}

const MyRequestsTab = ({ myRequests, onUpdateStatus }: MyRequestsTabProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">My Requests</h2>
        <Badge variant="outline" className="text-blue-600 border-blue-200">
          {myRequests.length} Assigned
        </Badge>
      </div>

      {myRequests.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No assigned requests</h3>
            <p className="text-gray-500">Visit the unassigned tab to claim new showing requests.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {myRequests.map((request) => (
            <AgentRequestCard
              key={request.id}
              request={request}
              onAssign={() => {}}
              onUpdateStatus={() => onUpdateStatus(request.id)}
              showAssignButton={false}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRequestsTab;
