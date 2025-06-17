
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Home } from "lucide-react";

interface ShowingRequest {
  id: string;
  property_address: string;
  preferred_date: string | null;
  preferred_time: string | null;
  status: string;
  assigned_agent_name?: string | null;
}

interface RecentToursProps {
  showingRequests: ShowingRequest[];
  onBookTour: () => void;
}

const RecentTours = ({ showingRequests, onBookTour }: RecentToursProps) => {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">Recent Tours</h2>
      {showingRequests.length > 0 ? (
        <div className="space-y-4">
          {showingRequests.slice(0, 5).map((request) => (
            <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <div className="font-medium">{request.property_address}</div>
                <div className="text-sm text-gray-600">
                  {request.preferred_date && request.preferred_time ? 
                    `${request.preferred_date} at ${request.preferred_time}` : 
                    'Date TBD'
                  }
                </div>
                {request.assigned_agent_name && (
                  <div className="text-sm text-gray-600">Agent: {request.assigned_agent_name}</div>
                )}
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                request.status === 'completed' ? 'bg-green-100 text-green-800' :
                request.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Home className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">No tours yet!</p>
          <Button onClick={onBookTour}>
            Book Your First Tour
          </Button>
        </div>
      )}
    </Card>
  );
};

export default RecentTours;
