
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
import { useIsMobile } from "@/hooks/use-mobile";

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
  // Check if we're on mobile to optimize loading
  const isMobile = useIsMobile();
  
  // Disable property details fetching temporarily to fix crashes
  const { showingsWithDetails, loading: detailsLoading } = useShowingRequestPropertyDetails(
    [] // Skip property details fetching entirely for now
  );

  // Use original showings without property details for now
  const enhancedShowings = showings;

  console.log('[ShowingListTab] Rendering:', {
    title,
    showingsCount: showings.length,
    enhancedShowingsCount: enhancedShowings.length,
    detailsLoading,
    userType,
    isMobile,
    showingsStatuses: showings.map(s => ({ id: s.id, status: s.status, address: s.property_address }))
  });

  // Skip loading state since we're not fetching property details

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
    <div ref={ref} className="space-y-4 w-full">
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

          // Use simplified card for confirmed tours (temporary fix to avoid IDX crashes)
          if (showing.status === 'confirmed' && userType === 'buyer') {
            console.log(`[ShowingListTab] Rendering simplified confirmed tour card:`, {
              id: showing.id,
              status: showing.status,
              address: showing.property_address,
              userType
            });
            return (
              <div
                key={showing.id}
                className={cn(
                  "transition-all duration-500",
                  isVisible && "animate-fade-in"
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <OptimizedShowingCard
                  showing={showing}
                  onCancel={onCancelShowing}
                  onReschedule={onRescheduleShowing}
                  onSendMessage={() => onSendMessage?.(showing.id)}
                  onSignAgreement={() => onSignAgreement?.(showing)}
                  userType={userType}
                  currentUserId={currentUserId}
                  buyerActions={buyerActions[showing.id]}
                  agreements={agreements}
                  onComplete={onComplete}
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
