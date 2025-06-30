import ShowingRequestCard from "./ShowingRequestCard";
import AgreementSigningCard from "./AgreementSigningCard";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Calendar, CheckCircle, Clock, Video, User } from "lucide-react";
import EmptyStateCard from "./EmptyStateCard";
import ProfileTab from "./ProfileTab";
import BuyerMessagingView from "../messaging/BuyerMessagingView";
import { useConsultationBookings } from "@/hooks/useConsultationBookings";

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
}

interface Agreement {
  id: string;
  showing_request_id: string;
  signed: boolean;
  signed_at: string | null;
  agreement_type: string;
  created_at: string;
}

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  user_type: string;
}

// Updated interface to match the component's expectations
interface ShowingWithAgreement {
  id: string;
  property_address: string;
  preferred_date: string | null;
  preferred_time: string | null;
  status: string;
  assigned_agent_name: string | null; // Made optional to match actual data
  assigned_agent_phone: string | null;
  tour_agreement: Agreement | null;
}

interface BuyerDashboardSectionsProps {
  pendingRequests: ShowingRequest[];
  activeShowings: ShowingRequest[];
  completedShowings: ShowingRequest[];
  agreements: Agreement[];
  currentUser: any;
  profile: Profile | null;
  displayName: string;
  unreadCount: number;
  onRequestShowing: () => void;
  onCancelShowing: (id: string) => void;
  onRescheduleShowing: (id: string) => void;
  onConfirmShowing: (showing: ShowingRequest) => void;
  fetchShowingRequests: () => void;
  onSendMessage: (showingId: string) => void;
  onSignAgreement?: (showingId: string, signerName: string) => Promise<boolean>;
}

// Helper function to check if a showing has passed its scheduled time
const hasShowingPassed = (showing: ShowingRequest): boolean => {
  if (!showing.preferred_date || !showing.preferred_time) return false;
  
  const showingDateTime = new Date(`${showing.preferred_date}T${showing.preferred_time}`);
  const now = new Date();
  
  return showingDateTime < now;
};

export const generateBuyerDashboardSections = ({
  pendingRequests,
  activeShowings,
  completedShowings,
  agreements,
  currentUser,
  profile,
  displayName,
  unreadCount,
  onRequestShowing,
  onCancelShowing,
  onRescheduleShowing,
  onConfirmShowing,
  fetchShowingRequests,
  onSendMessage,
  onSignAgreement
}: BuyerDashboardSectionsProps) => {
  // Use consultation bookings hook
  const { bookings: consultationBookings } = useConsultationBookings(currentUser?.id, 'buyer');

  // Ensure proper filtering of showings by status
  const confirmedShowings = activeShowings.filter(showing => 
    ['confirmed', 'scheduled', 'in_progress'].includes(showing.status)
  );
  
  // Filter showings that are awaiting agreement signature - these should come from ALL requests, not just pendingRequests
  const allShowings = [...pendingRequests, ...activeShowings, ...completedShowings];
  const awaitingAgreementShowings = allShowings.filter(showing => 
    showing.status === 'awaiting_agreement'
  );
  
  // Other pending requests (not awaiting agreement) - exclude awaiting_agreement status
  const otherPendingRequests = pendingRequests.filter(showing => 
    !['awaiting_agreement', 'confirmed', 'scheduled', 'in_progress', 'completed', 'cancelled'].includes(showing.status)
  );
  
  // Only show tours that are actually completed
  const actuallyCompletedShowings = completedShowings.filter(showing => 
    showing.status === 'completed'
  );

  // Separate upcoming and past consultations
  const now = new Date();
  const upcomingConsultations = consultationBookings.filter(booking => 
    new Date(booking.scheduled_at) > now && booking.status === 'scheduled'
  );
  const pastConsultations = consultationBookings.filter(booking => 
    new Date(booking.scheduled_at) <= now || booking.status === 'completed'
  );

  const ConsultationCard = ({ booking }: { booking: any }) => (
    <Card className="border border-gray-200 bg-white">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Video className="h-4 w-4 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">Agent Consultation</h3>
            <p className="text-sm text-gray-600 mt-1">
              {booking.offer_intents?.property_address}
            </p>
            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(booking.scheduled_at).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {new Date(booking.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              <span className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {booking.duration_minutes} min
              </span>
            </div>
            {booking.status === 'scheduled' && (
              <div className="mt-2">
                <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                  Upcoming
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return [
    {
      id: "requested",
      title: "Requested Tours",
      icon: Calendar,
      count: otherPendingRequests.length + awaitingAgreementShowings.length,
      content: (
        <div className="space-y-4">
          {/* Agreement signing cards for showings awaiting agreement */}
          {awaitingAgreementShowings.map((showing) => {
            // Find the agreement for this showing
            const tourAgreement = agreements.find(agreement => agreement.showing_request_id === showing.id) || null;
            
            // Create the showing object with proper typing
            const showingWithAgreement: ShowingWithAgreement = {
              id: showing.id,
              property_address: showing.property_address,
              preferred_date: showing.preferred_date,
              preferred_time: showing.preferred_time,
              status: showing.status,
              assigned_agent_name: showing.assigned_agent_name || null,
              assigned_agent_phone: showing.assigned_agent_phone || null,
              tour_agreement: tourAgreement
            };
            
            return (
              <AgreementSigningCard
                key={`agreement-${showing.id}`}
                showing={showingWithAgreement}
                onSign={async (showingId: string, signerName: string) => {
                  if (onSignAgreement) {
                    const success = await onSignAgreement(showingId, signerName);
                    if (success) {
                      fetchShowingRequests();
                    }
                    return success;
                  }
                  return false;
                }}
              />
            );
          })}

          {/* Regular pending request cards */}
          {otherPendingRequests.map((showing) => (
            <ShowingRequestCard
              key={showing.id}
              showing={showing}
              onCancel={onCancelShowing}
              onReschedule={onRescheduleShowing}
              onConfirm={(id: string) => {
                const showingToConfirm = otherPendingRequests.find(s => s.id === id);
                if (showingToConfirm) {
                  onConfirmShowing(showingToConfirm);
                }
              }}
              currentUserId={currentUser?.id}
              onSendMessage={onSendMessage}
              onComplete={fetchShowingRequests}
            />
          ))}

          {/* Empty state only if no pending requests at all */}
          {otherPendingRequests.length === 0 && awaitingAgreementShowings.length === 0 && (
            <EmptyStateCard
              title="No Pending Requests"
              description="You don't have any tour requests pending. Ready to explore some properties?"
              buttonText="Request a Tour"
              onButtonClick={onRequestShowing}
              icon={Calendar}
            />
          )}
        </div>
      )
    },
    {
      id: "confirmed",
      title: "Confirmed Tours",
      icon: CheckCircle,
      count: confirmedShowings.length + upcomingConsultations.length,
      content: (
        <div className="space-y-4">
          {/* Upcoming Consultations */}
          {upcomingConsultations.map((booking) => (
            <ConsultationCard key={`consultation-${booking.id}`} booking={booking} />
          ))}

          {/* Confirmed Showings */}
          {confirmedShowings.length === 0 && upcomingConsultations.length === 0 ? (
            <EmptyStateCard
              title="No Confirmed Tours"
              description="Once your tour requests are confirmed, they'll appear here."
              buttonText="Request a Tour"
              onButtonClick={onRequestShowing}
              icon={CheckCircle}
            />
          ) : (
            confirmedShowings.map((showing) => (
              <ShowingRequestCard
                key={showing.id}
                showing={showing}
                onCancel={onCancelShowing}
                onReschedule={onRescheduleShowing}
                onConfirm={(id: string) => {
                  const showingToConfirm = confirmedShowings.find(s => s.id === id);
                  if (showingToConfirm) {
                    onConfirmShowing(showingToConfirm);
                  }
                }}
                currentUserId={currentUser?.id}
                onSendMessage={onSendMessage}
                onComplete={fetchShowingRequests}
              />
            ))
          )}
        </div>
      )
    },
    {
      id: "messages",
      title: "Messages",
      icon: MessageCircle,
      count: unreadCount,
      content: currentUser?.id ? (
        <BuyerMessagingView userId={currentUser.id} />
      ) : (
        <Card>
          <CardContent className="text-center py-8">
            <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Please log in to view messages</p>
          </CardContent>
        </Card>
      )
    },
    {
      id: "history",
      title: "Completed Tours",
      icon: Clock,
      count: actuallyCompletedShowings.length + pastConsultations.length,
      content: (
        <div className="space-y-4">
          {/* Past Consultations */}
          {pastConsultations.map((booking) => (
            <ConsultationCard key={`past-consultation-${booking.id}`} booking={booking} />
          ))}

          {actuallyCompletedShowings.length === 0 && pastConsultations.length === 0 ? (
            <EmptyStateCard
              title="No Completed Tours"
              description="Your completed tours will appear here for your reference."
              buttonText="Request Your First Tour"
              onButtonClick={onRequestShowing}
              icon={Clock}
            />
          ) : (
            actuallyCompletedShowings.map((showing) => (
              <ShowingRequestCard
                key={showing.id}
                showing={showing}
                onCancel={onCancelShowing}
                onReschedule={onRescheduleShowing}
                showActions={true} // Keep actions for completed tours to show post-showing actions
                currentUserId={currentUser?.id}
                onSendMessage={onSendMessage}
                onComplete={fetchShowingRequests}
              />
            ))
          )}
        </div>
      )
    },
    {
      id: "profile",
      title: "Profile",
      icon: currentUser?.user_metadata?.avatar_url ? null : undefined,
      count: 0,
      content: (
        <ProfileTab
          profile={profile}
          userEmail={currentUser?.email}
          displayName={displayName}
        />
      )
    }
  ];
};
