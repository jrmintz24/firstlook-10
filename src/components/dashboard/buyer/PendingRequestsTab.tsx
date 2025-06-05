
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Plus } from "lucide-react";
import ShowingRequestCard from "@/components/dashboard/ShowingRequestCard";

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
}

interface PendingRequestsTabProps {
  pendingRequests: ShowingRequest[];
  onRequestShowing: () => void;
  onCancelShowing: (id: string) => void;
  onRescheduleShowing: (id: string) => void;
}

const PendingRequestsTab = ({ 
  pendingRequests, 
  onRequestShowing, 
  onCancelShowing, 
  onRescheduleShowing 
}: PendingRequestsTabProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Pending Requests</h2>
        <Button 
          onClick={onRequestShowing}
          variant="outline"
          className="border-purple-200 text-purple-700 hover:bg-purple-50"
        >
          <Plus className="h-4 w-4 mr-2" />
          Submit New Request
        </Button>
      </div>

      {pendingRequests.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No pending requests</h3>
            <p className="text-gray-500 mb-6">Ready to find your dream home? Submit a showing request!</p>
            <Button 
              onClick={onRequestShowing}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              Request Your Free Showing
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {pendingRequests.map((showing) => (
            <ShowingRequestCard
              key={showing.id}
              showing={showing}
              onCancel={onCancelShowing}
              onReschedule={onRescheduleShowing}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingRequestsTab;
