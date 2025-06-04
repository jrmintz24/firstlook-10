
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
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

interface ShowingHistoryTabProps {
  completedShowings: ShowingRequest[];
  onCancelShowing: (id: string) => void;
  onRescheduleShowing: (id: string) => void;
}

const ShowingHistoryTab = ({ 
  completedShowings, 
  onCancelShowing, 
  onRescheduleShowing 
}: ShowingHistoryTabProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Showing History</h2>
      
      {completedShowings.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Star className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No completed showings yet</h3>
            <p className="text-gray-500 mb-6">Your showing history will appear here once you complete your first showing.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {completedShowings.map((showing) => (
            <ShowingRequestCard
              key={showing.id}
              showing={showing}
              onCancel={onCancelShowing}
              onReschedule={onRescheduleShowing}
              showActions={false}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ShowingHistoryTab;
