
import { Calendar, CheckCircle, Clock, MessageSquare, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import EmptyStateCard from "./EmptyStateCard";
import ConsultationsSection from "./ConsultationsSection";
import InlineMessagesPanel from "@/components/messaging/InlineMessagesPanel";

// Add this interface for consultations
interface Consultation {
  id: string;
  propertyAddress: string;
  scheduledAt: string;
  consultationType: 'phone' | 'video';
  agentName?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

// Update the generateBuyerDashboardSections function parameters to include consultations
export const generateBuyerDashboardSections = ({
  pendingRequests,
  activeShowings,
  completedShowings,
  consultations = [], // Add this parameter
  agreements,
  currentUser,
  profile,
  displayName,
  unreadCount,
  onRequestShowing,
  onCancelShowing,
  onRescheduleShowing,
  onConfirmShowing,
  onSignAgreement,
  fetchShowingRequests,
  onSendMessage,
  onJoinConsultation,
  onRescheduleConsultation
}: {
  pendingRequests: any[];
  activeShowings: any[];
  completedShowings: any[];
  consultations?: Consultation[];
  agreements: Record<string, boolean>;
  currentUser: any;
  profile: any;
  displayName: string;
  unreadCount: number;
  onRequestShowing: () => void;
  onCancelShowing: (id: string) => void;
  onRescheduleShowing: (showing: any) => void;
  onConfirmShowing: (showing: any) => void;
  onSignAgreement: (showing: any) => void;
  fetchShowingRequests: () => void;
  onSendMessage: (showing: any) => void;
  onJoinConsultation?: (consultationId: string) => void;
  onRescheduleConsultation?: (consultationId: string) => void;
}) => {
  const pendingCount = pendingRequests.length;
  const confirmedCount = activeShowings.length;
  const historyCount = completedShowings.length;

  const sections = [
    {
      id: "requested",
      title: "Requested",
      icon: Clock,
      count: pendingCount,
      color: "bg-orange-100 text-orange-700",
      component: (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Pending Requests</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {pendingCount > 0 ? (
              pendingRequests.map((showing) => (
                <div key={showing.id} className="mb-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">{showing.property_address}</div>
                    <Badge variant="secondary">{showing.status}</Badge>
                  </div>
                  <div className="text-xs text-gray-500">
                    Requested: {new Date(showing.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))
            ) : (
              <EmptyStateCard
                title="No Pending Requests"
                description="Start by requesting a property tour."
                buttonText="Request a Tour"
                onButtonClick={onRequestShowing}
                icon={Clock}
              />
            )}
          </CardContent>
        </Card>
      )
    },
    {
      id: "confirmed",
      title: "Confirmed",
      icon: Calendar,
      count: confirmedCount,
      color: "bg-blue-100 text-blue-700",
      component: (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Confirmed Tours</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {confirmedCount > 0 ? (
              activeShowings.map((showing) => (
                <div key={showing.id} className="mb-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">{showing.property_address}</div>
                    {agreements[showing.id] ? (
                      <Badge variant="outline">Agreement Signed</Badge>
                    ) : (
                      <Badge variant="default">Awaiting Agreement</Badge>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    Scheduled: {new Date(showing.preferred_date || '').toLocaleDateString()}
                  </div>
                </div>
              ))
            ) : (
              <EmptyStateCard
                title="No Confirmed Tours"
                description="Check back once your request is confirmed."
                buttonText=""
                onButtonClick={() => {}}
                icon={Calendar}
              />
            )}
          </CardContent>
        </Card>
      )
    },
    {
      id: "history",
      title: "History",
      icon: CheckCircle,
      count: historyCount,
      color: "bg-green-100 text-green-700",
      component: (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Tour History</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {historyCount > 0 ? (
              completedShowings.map((showing) => (
                <div key={showing.id} className="mb-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">{showing.property_address}</div>
                    <Badge variant="secondary">{showing.status}</Badge>
                  </div>
                  <div className="text-xs text-gray-500">
                    Completed: {new Date(showing.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))
            ) : (
              <EmptyStateCard
                title="No Past Tours"
                description="Your completed and cancelled tours will appear here."
                buttonText=""
                onButtonClick={() => {}}
                icon={CheckCircle}
              />
            )}
          </CardContent>
        </Card>
      )
    },
    
    // Add consultations section after the existing sections
    {
      id: "consultations",
      title: "Consultations",
      icon: Calendar,
      count: consultations.filter(c => c.status === 'scheduled' && new Date(c.scheduledAt) >= new Date()).length,
      color: "bg-purple-100 text-purple-700",
      component: (
        <ConsultationsSection
          consultations={consultations}
          onJoinCall={onJoinConsultation}
          onReschedule={onRescheduleConsultation}
        />
      )
    },
    {
      id: "messages",
      title: "Messages",
      icon: MessageSquare,
      count: unreadCount,
      color: "bg-red-100 text-red-700",
      component: <InlineMessagesPanel />
    },
    {
      id: "profile",
      title: "Profile",
      icon: MapPin,
      count: 0,
      color: "bg-indigo-100 text-indigo-700",
      component: (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Your Profile</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <p>Welcome, {displayName}!</p>
            {profile && (
              <>
                <p>Email: {currentUser?.email}</p>
                <p>Phone: {profile.phone}</p>
              </>
            )}
          </CardContent>
        </Card>
      )
    }
  ];

  return sections;
};
