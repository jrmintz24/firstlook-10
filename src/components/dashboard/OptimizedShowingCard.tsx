
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Calendar, User, FileText, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAgreements } from "@/hooks/useAgreements";

interface OptimizedShowingCardProps {
  showing: any;
  onCancel?: (showingId: string) => void;
  onReschedule?: (showingId: string) => void;
  onConfirm?: (showing: any) => void;
  onSendMessage?: (showingId: string) => void;
  onReportIssue?: (showing: any) => void;
  showActions?: boolean;
  userType?: 'buyer' | 'agent';
  onComplete?: () => void;
  currentUserId?: string;
  agreements?: Record<string, boolean>;
  onSignAgreement?: (agreement: any) => void;
}

const StatusBadge = ({ status }: { status: string }) => {
  let color = "bg-gray-100 text-gray-700";
  if (status === "pending") color = "bg-orange-100 text-orange-700";
  if (status === "confirmed") color = "bg-blue-100 text-blue-700";
  if (status === "completed") color = "bg-green-100 text-green-700";
  if (status === "cancelled") color = "bg-red-100 text-red-700";

  return (
    <Badge className={color}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

const OptimizedShowingCard = ({
  showing,
  onCancel,
  onReschedule,
  onConfirm,
  onSendMessage,
  onReportIssue,
  onSignAgreement,
  showActions = true,
  userType = 'buyer',
  onComplete,
  currentUserId,
  agreements = {}
}: OptimizedShowingCardProps) => {
  const { toast } = useToast();
  const { handleSignAgreement } = useAgreements(currentUserId || '', toast, onComplete);

  const agreementNotice = Object.keys(agreements).find(
    (key) => key === showing.id && !agreements[key]
  );

  return (
    <Card className="border border-gray-200 hover:shadow-md transition-all duration-200">
      <CardContent className="p-3 sm:p-4">
        <div className="space-y-2.5 sm:space-y-3">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base leading-tight">
                {showing.property_address}
              </h3>
              {showing.notes && (
                <p className="text-gray-600 text-xs sm:text-sm mt-1 line-clamp-2">
                  {showing.notes}
                </p>
              )}
            </div>
            <div className="flex-shrink-0">
              <StatusBadge status={showing.status} />
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
            {showing.preferred_date_1 && (
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="truncate">
                  {new Date(showing.preferred_date_1).toLocaleDateString()}
                </span>
              </div>
            )}
            
            {showing.preferred_time_1 && (
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="truncate">{showing.preferred_time_1}</span>
              </div>
            )}
            
            {showing.assigned_agent_name && (
              <div className="flex items-center gap-2 text-gray-600 sm:col-span-2">
                <User className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="truncate">Agent: {showing.assigned_agent_name}</span>
              </div>
            )}
          </div>

          {/* Agreement Notice */}
          {agreementNotice && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5 sm:p-3">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <div className="flex items-center gap-2 text-blue-700 text-sm">
                  <FileText className="h-4 w-4 flex-shrink-0" />
                  <span className="font-medium">Agreement Required</span>
                </div>
                <Button
                  size="sm"
                  onClick={() => onSignAgreement?.(showing) || handleSignAgreement(showing)}
                  className="text-xs h-7 w-full sm:w-auto"
                >
                  Sign Agreement
                </Button>
              </div>
            </div>
          )}

          {/* Actions */}
          {showActions && (
            <div className="pt-2 border-t border-gray-100">
              <div className="flex flex-col sm:flex-row gap-2">
                {showing.status === 'pending' && userType === 'agent' && onConfirm && (
                  <Button 
                    size="sm" 
                    onClick={() => onConfirm(showing)}
                    className="h-8 text-xs font-medium"
                  >
                    Confirm Showing
                  </Button>
                )}
                
                {(showing.status === 'pending' || showing.status === 'confirmed') && (
                  <>
                    {onSendMessage && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => onSendMessage(showing.id)}
                        className="h-8 text-xs font-medium"
                      >
                        <MessageSquare className="h-3 w-3 mr-1.5" />
                        <span className="sm:inline">Message</span>
                      </Button>
                    )}
                    
                    {onReschedule && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => onReschedule(showing.id)}
                        className="h-8 text-xs font-medium"
                      >
                        <Calendar className="h-3 w-3 mr-1.5" />
                        <span className="sm:inline">Reschedule</span>
                      </Button>
                    )}
                    
                    {onCancel && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => onCancel(showing.id)}
                        className="h-8 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                      >
                        Cancel
                      </Button>
                    )}
                  </>
                )}
                
                {onReportIssue && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onReportIssue(showing)}
                    className="h-8 text-xs font-medium"
                  >
                    Report Issue
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OptimizedShowingCard;
