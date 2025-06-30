import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle, Calendar, MessageSquare, TrendingUp, Plus, FileText } from "lucide-react";
import { useBuyerDashboardLogic } from "@/hooks/useBuyerDashboardLogic";
import { useIsMobile } from "@/hooks/use-mobile";
import OfferManagementDashboard from "@/components/offer-management/OfferManagementDashboard";
import PostShowingActionsPanel from "@/components/post-showing/PostShowingActionsPanel";

// Components
import RecentTours from "./RecentTours";
import TourProgressTracker from "./TourProgressTracker";
import SmartReminders from "./SmartReminders";
import QuickActions from "./QuickActions";
import ShowingListTab from "./ShowingListTab";
import EmptyStateCard from "./EmptyStateCard";
import MessagingInterface from "@/components/messaging/MessagingInterface";
import BuyerPostShowingHub from "./BuyerPostShowingHub";

interface SimpleBuyerDashboardProps {
  userId: string;
  displayName: string;
  onRequestTour: () => void;
}

const SimpleBuyerDashboard = ({ userId, displayName, onRequestTour }: SimpleBuyerDashboardProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const isMobile = useIsMobile();
  
  const {
    loading,
    pendingRequests,
    activeShowings,
    completedShowings,
    unreadCount,
    isSubscribed,
    handleCancelShowing,
    fetchShowingRequests
  } = useBuyerDashboardLogic();

  const pendingShowings = pendingRequests || [];
  const upcomingShowings = activeShowings || [];
  const completedShowingsList = completedShowings || [];

  // Combine all showings for SmartReminders
  const allShowings = [...pendingShowings, ...upcomingShowings, ...completedShowingsList];

  const handleMakeOffer = () => {
    console.log('Make offer button clicked');
    // Implement make offer logic - could open a modal or navigate to make offer page
  };

  const handleChatWithAgent = (showing: any) => {
    console.log('Chat with agent for showing:', showing.id);
    // Implement chat logic
  };

  const handleReschedule = (showing: any) => {
    console.log('Reschedule showing:', showing.id);
    // Implement reschedule logic
  };

  const handleConfirmShowing = (showing: any) => {
    console.log('Confirm showing:', showing.id);
    // Implement confirm logic
  };

  const tabs = [
    {
      id: "overview",
      title: "Overview",
      icon: Calendar,
      count: 0,
      content: (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">Pending Tours</p>
                    <p className="text-3xl font-bold text-orange-600 leading-none">
                      {pendingShowings.length}
                    </p>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    <Clock className="h-8 w-8 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">Upcoming Tours</p>
                    <p className="text-3xl font-bold text-blue-600 leading-none">
                      {upcomingShowings.length}
                    </p>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    <Calendar className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">Completed Tours</p>
                    <p className="text-3xl font-bold text-green-600 leading-none">
                      {completedShowingsList.length}
                    </p>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Dashboard Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <RecentTours 
                pendingRequests={pendingShowings}
                activeShowings={upcomingShowings}
                completedShowings={completedShowingsList}
                onChatWithAgent={handleChatWithAgent}
                onReschedule={handleReschedule}
                onMakeOffer={(address: string) => handleMakeOffer()}
                onConfirmShowing={handleConfirmShowing}
              />
              
              <Card>
                <CardHeader>
                  <CardTitle>Tour Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Track your tour progress here</p>
                </CardContent>
              </Card>
            </div>
            
            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              <SmartReminders 
                showingRequests={allShowings}
                userType="buyer"
              />
              
              <QuickActions 
                onRequestShowing={onRequestTour}
                onMakeOffer={handleMakeOffer}
              />
            </div>
          </div>
        </div>
      )
    },
    {
      id: "pending",
      title: "Pending",
      icon: Clock,
      count: pendingShowings.length,
      content: (
        <ShowingListTab
          title="Pending Tour Requests"
          showings={pendingShowings}
          emptyIcon={Clock}
          emptyTitle="No Pending Tours"
          emptyDescription="You don't have any pending tour requests."
          emptyButtonText="Request a Tour"
          onRequestShowing={onRequestTour}
          onCancelShowing={handleCancelShowing}
          onRescheduleShowing={() => {}}
          userType="buyer"
          currentUserId={userId}
        />
      )
    },
    {
      id: "upcoming",
      title: "Upcoming",
      icon: Calendar,
      count: upcomingShowings.length,
      content: (
        <ShowingListTab
          title="Upcoming Tours"
          showings={upcomingShowings}
          emptyIcon={Calendar}
          emptyTitle="No Upcoming Tours"
          emptyDescription="You don't have any upcoming tours scheduled."
          emptyButtonText="Request a Tour"
          onRequestShowing={onRequestTour}
          onCancelShowing={handleCancelShowing}
          onRescheduleShowing={() => {}}
          userType="buyer"
          currentUserId={userId}
        />
      )
    },
    {
      id: "offers",
      title: "My Offers",
      icon: FileText,
      count: 0,
      content: (
        <OfferManagementDashboard 
          buyerId={userId} 
          onCreateOffer={onRequestTour}
        />
      )
    },
    {
      id: "activity",
      title: "Activity",
      icon: TrendingUp,
      count: 0,
      content: (
        <BuyerPostShowingHub buyerId={userId} />
      )
    },
    {
      id: "messages",
      title: "Messages",
      icon: MessageSquare,
      count: unreadCount || 0,
      content: (
        <MessagingInterface
          userId={userId}
          userType="buyer"
        />
      )
    },
    {
      id: "history",
      title: "History",
      icon: CheckCircle,
      count: completedShowingsList.length,
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Tour History</h2>
          </div>
          {completedShowingsList.length === 0 ? (
            <EmptyStateCard
              icon={CheckCircle}
              title="No Tour History"
              description="You haven't completed any tours yet."
              buttonText="Request a Tour"
              onButtonClick={onRequestTour}
            />
          ) : (
            <div className="space-y-6">
              {completedShowingsList.map((showing) => (
                <Card key={showing.id} className="border rounded-lg">
                  <div className="p-4 border-b">
                    <h3 className="font-medium">{showing.property_address}</h3>
                    <p className="text-sm text-gray-600">
                      Completed: {showing.status_updated_at ? new Date(showing.status_updated_at).toLocaleDateString() : 'Recently'}
                    </p>
                  </div>
                  <div className="p-4">
                    <PostShowingActionsPanel
                      showingId={showing.id}
                      buyerId={userId}
                      agentId={showing.assigned_agent_email || ''} // Use email as fallback since assigned_agent_id doesn't exist
                      agentName={showing.assigned_agent_name}
                      agentEmail={showing.assigned_agent_email}
                      agentPhone={showing.assigned_agent_phone}
                      propertyAddress={showing.property_address}
                      onActionCompleted={() => {
                        // Refresh data when actions are completed
                        fetchShowingRequests();
                      }}
                    />
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {displayName}
            </h1>
            <p className="text-gray-600 mt-1">
              Find your perfect home with personalized tours
            </p>
          </div>
          
          <Button onClick={onRequestTour} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Request Tour
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="border-b border-gray-200 mb-6">
          <TabsList className="bg-transparent border-0 p-0 h-auto">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="relative px-4 py-3 bg-transparent border-0 rounded-none text-gray-600 font-medium hover:text-gray-900 data-[state=active]:bg-transparent data-[state=active]:text-blue-600 data-[state=active]:shadow-none data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:h-0.5 data-[state=active]:after:bg-blue-600"
              >
                <div className="flex items-center gap-2">
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.title}</span>
                  {tab.count > 0 && (
                    <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">
                      {tab.count}
                    </Badge>
                  )}
                </div>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {tabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className="mt-0">
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default SimpleBuyerDashboard;
