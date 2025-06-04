
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, MapPin } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { getStatusInfo, type ShowingStatus } from "@/utils/showingStatus";

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

interface StatusUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: ShowingRequest;
  onUpdateStatus: (requestId: string, newStatus: string, estimatedDate?: string) => void;
}

const StatusUpdateModal = ({ isOpen, onClose, request, onUpdateStatus }: StatusUpdateModalProps) => {
  const [selectedStatus, setSelectedStatus] = useState<string>(request.status);
  const [estimatedDate, setEstimatedDate] = useState<Date | undefined>(
    request.estimated_confirmation_date ? new Date(request.estimated_confirmation_date) : undefined
  );

  const statusOptions = [
    { value: 'under_review', label: 'Under Review', description: 'Reviewing request details' },
    { value: 'agent_assigned', label: 'Agent Assigned', description: 'Agent has been assigned' },
    { value: 'confirmed', label: 'Confirmed', description: 'Showing confirmed and scheduled' },
    { value: 'scheduled', label: 'Scheduled', description: 'Showing is upcoming' },
    { value: 'completed', label: 'Completed', description: 'Showing has been completed' },
    { value: 'cancelled', label: 'Cancelled', description: 'Showing has been cancelled' }
  ];

  const currentStatusInfo = getStatusInfo(selectedStatus as ShowingStatus);

  const handleSubmit = () => {
    const estimatedDateString = estimatedDate ? format(estimatedDate, 'yyyy-MM-dd') : undefined;
    onUpdateStatus(request.id, selectedStatus, estimatedDateString);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-purple-500" />
            Update Status - {request.property_address}
          </DialogTitle>
          <DialogDescription>
            Change the status of this showing request and set an estimated confirmation date if needed.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Status */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-800 mb-2">Current Status</h3>
            <Badge className={`${getStatusInfo(request.status as ShowingStatus).bgColor} ${getStatusInfo(request.status as ShowingStatus).color} border-0`}>
              {getStatusInfo(request.status as ShowingStatus).label}
            </Badge>
          </div>

          {/* Status Selection */}
          <div>
            <h3 className="font-medium text-gray-800 mb-3">New Status</h3>
            <div className="grid gap-3">
              {statusOptions.map((status) => (
                <div
                  key={status.value}
                  className={cn(
                    "p-3 border rounded-lg cursor-pointer transition-colors",
                    selectedStatus === status.value
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                  onClick={() => setSelectedStatus(status.value)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-800">{status.label}</div>
                      <div className="text-sm text-gray-600">{status.description}</div>
                    </div>
                    <input
                      type="radio"
                      checked={selectedStatus === status.value}
                      onChange={() => setSelectedStatus(status.value)}
                      className="text-purple-600"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Preview Selected Status */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-800 mb-2">Preview New Status</h3>
            <Badge className={`${currentStatusInfo.bgColor} ${currentStatusInfo.color} border-0 mb-2`}>
              <span className="mr-1">{currentStatusInfo.icon}</span>
              {currentStatusInfo.label}
            </Badge>
            <div className="text-blue-600 text-sm">{currentStatusInfo.description}</div>
          </div>

          {/* Estimated Confirmation Date */}
          {['agent_assigned', 'confirmed'].includes(selectedStatus) && (
            <div>
              <h3 className="font-medium text-gray-800 mb-3">Estimated Confirmation Date (Optional)</h3>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !estimatedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {estimatedDate ? format(estimatedDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={estimatedDate}
                    onSelect={setEstimatedDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleSubmit}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              disabled={selectedStatus === request.status && !estimatedDate}
            >
              Update Status
            </Button>
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StatusUpdateModal;
