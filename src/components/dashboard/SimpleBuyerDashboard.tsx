
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle, Calendar, MessageSquare, TrendingUp, Plus } from "lucide-react";
import { useBuyerDashboardLogic } from "@/hooks/useBuyerDashboardLogic";
import { useIsMobile } from "@/hooks/use-mobile";

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
    showings,
    loading,
    unreadCount,
    handleCancelShowing,
    subscriptionStatus,
    profile
  } = useBuyerDashboardLogic(userId);

  const pendingShowings = showings.filter(s => s.status === 'pending');
  const upcomingShowings = showings.filter(s => 
    ['agent_assigned', 'confirmed', 'agent_confirmed', 'scheduled'].includes(s.status)
  );
  const completedShowings = showings.filter(s => 
    ['completed', 'cancelled'].includes(s.status)
  );

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
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Pending Tours</p>
                    <p className="text-2xl font-bold text-orange-600">{pendingShowings.length}</p>
                  </div>
                  <Clock className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Upcoming Tours</p>
                    <p className="text-2xl font-bold text-blue-600">{upcomingShowings.length}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Completed Tours</p>
                    <p className="text-2xl font-bold text-green-600">{completedShowings.length}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Dashboard Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <RecentTours 
                userId={userId}
                onRequestTour={onRequestTour}
              />
              
              <TourProgressTracker 
                userId={userId}
                subscriptionStatus={subscriptionStatus}
              />
            </div>
            
            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              <SmartReminders userId={userId} />
              
              <QuickActions 
                onRequestTour={onRequestTour}
                hasActiveShowing={pendingShowings.length > 0 || upcomingShowings.length > 0}
                subscriptionStatus={subscriptionStatus}
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
      count: unreadCount,
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
      count: completedShowings.length,
      content: (
        <ShowingListTab
          title="Tour History"
          showings={completedShowings}
          emptyIcon={CheckCircle}
          emptyTitle="No Tour History"
          emptyDescription="You haven't completed any tours yet."
          emptyButtonText="Request a Tour"
          onRequestShowing={onRequestTour}
          onCancelShowing={() => {}}
          onRescheduleShowing={() => {}}
          showActions={false}
          userType="buyer"
          currentUserId={userId}
        />
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
