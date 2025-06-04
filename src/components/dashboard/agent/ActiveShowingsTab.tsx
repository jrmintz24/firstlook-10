
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";
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

interface ActiveShowingsTabProps {
  activeShowings: ShowingRequest[];
  onUpdateStatus: (requestId: string) => void;
}

const ActiveShowingsTab = ({ activeShowings, onUpdateStatus }: ActiveShowingsTabProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Active Showings</h2>
        <Badge variant="outline" className="text-green-600 border-green-200">
          {activeShowings.length} Confirmed
        </Badge>
      </div>

      {activeShowings.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <CheckCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No active showings</h3>
            <p className="text-gray-500">Confirmed showings will appear here when scheduled.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {activeShowings.map((request) => (
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

export default ActiveShowingsTab;
