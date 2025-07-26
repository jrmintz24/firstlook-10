
import React from "react";
import { LucideIcon } from "lucide-react";
import AgentRequestCard from "./AgentRequestCard";
import ShowingRequestCard from "./ShowingRequestCard";
import OptimizedShowingCard from "./OptimizedShowingCard";
import EmptyStateCard from "./EmptyStateCard";
import EnhancedTourCard from "./EnhancedTourCard";
import { useShowingRequestPropertyDetails } from "@/hooks/useShowingRequestPropertyDetails";
import FloatingCard from "@/components/ui/FloatingCard";
import DynamicShadowCard from "@/components/ui/DynamicShadowCard";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";

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
  assigned_agent_id?: string | null;
  estimated_confirmation_date?: string | null;
  status_updated_at?: string | null;
  user_id?: string | null;
  buyer_consents_to_contact?: boolean | null;
  idx_property_id?: string | null;
}

interface ShowingListTabProps {
  title: string;
  showings: ShowingRequest[];
  emptyIcon: LucideIcon;
  emptyTitle: string;
  emptyDescription: string;
  emptyButtonText: string;
  onRequestShowing: () => void;
  onCancelShowing: (id: string) => void;
  onRescheduleShowing: (id: string) => void;
  onConfirmShowing?: (request: ShowingRequest) => void;
  onReportIssue?: (request: ShowingRequest) => void;
  onSendMessage?: (id: string) => void;
  showActions?: boolean;
  userType?: 'buyer' | 'agent';
  onComplete?: () => void;
  currentUserId?: string;
  agreements?: Record<string, boolean>;
  onSignAgreement?: (showing: ShowingRequest) => void;
  buyerActions?: Record<string, {
    favorited?: boolean;
    madeOffer?: boolean;
    hiredAgent?: boolean;
    scheduledMoreTours?: boolean;
    askedQuestions?: number;
    propertyRating?: number;
    agentRating?: number;
    latestAction?: string;
    actionTimestamp?: string;
  }>;
  eligibility?: any;
  onUpgradeClick?: () => void;
}

const ShowingListTab: React.FC<ShowingListTabProps> = ({
  title,
  showings,
  emptyIcon: Icon,
  emptyTitle,
  emptyDescription,
  emptyButtonText,
  onRequestShowing,
  onCancelShowing,
  onRescheduleShowing,
  onConfirmShowing,
  onReportIssue,
  onSendMessage,
  showActions = true,
  userType = 'buyer',
  onComplete,
  currentUserId,
  agreements = {},
  onSignAgreement,
  buyerActions = {},
  eligibility,
  onUpgradeClick
}) => {
  // Fetch property details for the showings
  const { showingsWithDetails, loading: detailsLoading } = useShowingRequestPropertyDetails(showings);

  // Use showings with details if available, otherwise fall back to original showings
  const enhancedShowings = showingsWithDetails.length > 0 ? showingsWithDetails : showings;

  if (enhancedShowings.length === 0) {
    return (
      <EmptyStateCard
        title={emptyTitle}
        description={emptyDescription}
        buttonText={emptyButtonText}
        onButtonClick={onRequestShowing}
        icon={Icon}
      />
    );
  }

  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <div ref={ref} className="space-y-4">
      <h2 className={cn(
        "text-xl font-semibold text-gray-900 mb-4 transition-all duration-500",
        isVisible && "animate-fade-in"
      )}>{title}</h2>
      <div className="space-y-4">
        {enhancedShowings.map((showing, index) => {
          if (userType === 'agent') {
            return (
              <AgentRequestCard
                key={showing.id}
                request={showing}
                onAssign={() => {}}
                onUpdateStatus={(status, estimatedDate) => {}}
                onSendMessage={() => onSendMessage?.(showing.id)}
                onConfirm={onConfirmShowing}
                onReportIssue={onReportIssue}
                onReschedule={onRescheduleShowing}
                showAssignButton={!showing.assigned_agent_id}
                onComplete={onComplete}
                currentAgentId={currentUserId}
                buyerActions={buyerActions[showing.id]}
              />
            );
          }

          // Use EnhancedTourCard for confirmed tours
          if (showing.status === 'confirmed' && userType === 'buyer') {
            return (
              <div
                key={showing.id}
                className={cn(
                  "transition-all duration-500",
                  isVisible && "animate-fade-in"
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <EnhancedTourCard
                  showing={showing}
                  onCancel={onCancelShowing}
                  onReschedule={onRescheduleShowing}
                  onAddToCalendar={(showing) => {
                    // TODO: Implement calendar integration
                    console.log('Add to calendar:', showing);
                  }}
                  onGetDirections={(address) => {
                    // Open in Google Maps
                    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_blank');
                  }}
                  index={index}
                />
              </div>
            );
          }

          // Use standard card for other statuses
          return (
            <div
              key={showing.id}
              className={cn(
                "transition-all duration-500",
                isVisible && "animate-fade-in"
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <DynamicShadowCard
                shadowIntensity={0.1}
                shadowColor="rgba(0, 0, 0, 0.08)"
              >
                <FloatingCard
                  intensity="subtle"
                  duration={5000}
                  delay={index * 200}
                >
                  <OptimizedShowingCard
                    showing={showing}
                    onCancel={onCancelShowing}
                    onReschedule={onRescheduleShowing}
                    onConfirm={onConfirmShowing ? () => onConfirmShowing(showing) : undefined}
                    onComplete={onComplete}
                    currentUserId={currentUserId}
                    agreements={agreements}
                    userType={userType}
                    showActions={showActions}
                    onSignAgreement={onSignAgreement}
                    onRequestShowing={onRequestShowing}
                  />
                </FloatingCard>
              </DynamicShadowCard>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ShowingListTab;
