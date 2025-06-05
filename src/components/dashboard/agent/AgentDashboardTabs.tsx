
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingState } from "@/components/ui/loading-states";
import UnassignedRequestsTab from "./UnassignedRequestsTab";
import MyRequestsTab from "./MyRequestsTab";
import ActiveShowingsTab from "./ActiveShowingsTab";
import AgentProfileTab from "./AgentProfileTab";

interface AgentDashboardTabsProps {
  unassignedRequests: any[];
  myRequests: any[];
  activeShowings: any[];
  profile: any;
  currentUser: any;
  displayName: string;
  isLoading: boolean;
  onAssignToSelf: (requestId: string) => void;
  onUpdateStatus: (requestId: string) => void;
}

const AgentDashboardTabs = ({
  unassignedRequests,
  myRequests,
  activeShowings,
  profile,
  currentUser,
  displayName,
  isLoading,
  onAssignToSelf,
  onUpdateStatus
}: AgentDashboardTabsProps) => {
  return (
    <Tabs defaultValue="unassigned" className="space-y-6">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="unassigned">Unassigned ({unassignedRequests.length})</TabsTrigger>
        <TabsTrigger value="my-requests">My Requests ({myRequests.length})</TabsTrigger>
        <TabsTrigger value="active">Active Showings ({activeShowings.length})</TabsTrigger>
        <TabsTrigger value="profile">Profile</TabsTrigger>
      </TabsList>

      <TabsContent value="unassigned">
        {isLoading ? (
          <LoadingState message="Loading unassigned requests..." />
        ) : (
          <UnassignedRequestsTab
            unassignedRequests={unassignedRequests}
            onAssignToSelf={onAssignToSelf}
            onUpdateStatus={onUpdateStatus}
          />
        )}
      </TabsContent>

      <TabsContent value="my-requests">
        {isLoading ? (
          <LoadingState message="Loading your requests..." />
        ) : (
          <MyRequestsTab
            myRequests={myRequests}
            onUpdateStatus={onUpdateStatus}
          />
        )}
      </TabsContent>

      <TabsContent value="active">
        {isLoading ? (
          <LoadingState message="Loading active showings..." />
        ) : (
          <ActiveShowingsTab
            activeShowings={activeShowings}
            onUpdateStatus={onUpdateStatus}
          />
        )}
      </TabsContent>

      <TabsContent value="profile">
        <AgentProfileTab
          profile={profile}
          currentUser={currentUser}
          displayName={displayName}
          myRequests={myRequests}
        />
      </TabsContent>
    </Tabs>
  );
};

export default AgentDashboardTabs;
