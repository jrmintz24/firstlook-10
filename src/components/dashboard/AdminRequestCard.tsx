import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
} from "lucide-react";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { getStatusInfo, getEstimatedTimeline, type ShowingStatus } from "@/utils/showingStatus";

interface AgentProfile {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
}

export interface ShowingRequest {
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

interface AdminRequestCardProps {
  request: ShowingRequest;
  agents: AgentProfile[];
  onAssign: (requestId: string, agent: AgentProfile) => void;
  onUpdateStatus: (status: string) => void;
}

const AdminRequestCard = ({ request, agents, onAssign, onUpdateStatus }: AdminRequestCardProps) => {
  const statusInfo = getStatusInfo(request.status as ShowingStatus);
  const timeline = getEstimatedTimeline(request.status as ShowingStatus);

  return (
    <Card className="shadow-lg border-0">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <Badge className={`${statusInfo.bgColor} ${statusInfo.color} border-0`}>
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
            <div className="bg-blue-50 p-3 rounded-lg mb-4">
              <div className="text-sm font-medium text-blue-800 mb-1">Current Status</div>
              <div className="text-blue-600 text-sm mb-2">{statusInfo.description}</div>
              <div className="text-blue-500 text-xs">{timeline}</div>
            </div>
            {request.preferred_date && (
              <div className="flex items-center gap-6 text-gray-600 mb-3">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(request.preferred_date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</span>
                </div>
                {request.preferred_time && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{request.preferred_time}</span>
                  </div>
                )}
              </div>
            )}
            {request.assigned_agent_name && (
              <div className="bg-green-50 p-3 rounded-lg mb-4">
                <div className="text-sm font-medium text-green-800 mb-2 flex items-center gap-1">
                  <User className="h-4 w-4" /> Assigned Agent
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
        <div className="flex gap-3 items-center">
          {!request.assigned_agent_name && (
            <Select onValueChange={(value) => {
              const agent = agents.find((a) => a.id === value);
              if (agent) onAssign(request.id, agent);
            }}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Assign Agent" />
              </SelectTrigger>
              <SelectContent>
                {agents.map((agent) => (
                  <SelectItem key={agent.id} value={agent.id}>
                    {agent.first_name} {agent.last_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Button variant="outline" onClick={() => onUpdateStatus(request.status)}>
            Update Status
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminRequestCard;
