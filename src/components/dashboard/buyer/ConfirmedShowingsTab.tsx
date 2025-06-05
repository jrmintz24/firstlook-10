
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Plus } from "lucide-react";
import ShowingRequestCard from "@/components/dashboard/ShowingRequestCard";
import type { ShowingRequest } from "@/types";

interface ConfirmedShowingsTabProps {
  activeShowings: ShowingRequest[];
  onRequestShowing: () => void;
  onCancelShowing: (id: string) => void;
  onRescheduleShowing: (id: string) => void;
}

const ConfirmedShowingsTab = ({ 
  activeShowings, 
  onRequestShowing, 
  onCancelShowing, 
  onRescheduleShowing 
}: ConfirmedShowingsTabProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Confirmed Showings</h2>
        <Button 
          onClick={onRequestShowing}
          variant="outline"
          className="border-purple-200 text-purple-700 hover:bg-purple-50"
        >
          <Plus className="h-4 w-4 mr-2" />
          Schedule Another Showing
        </Button>
      </div>

      {activeShowings.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No confirmed showings</h3>
            <p className="text-gray-500 mb-6">Once your requests are confirmed, they'll appear here.</p>
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
          {activeShowings.map((showing) => (
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

export default ConfirmedShowingsTab;
