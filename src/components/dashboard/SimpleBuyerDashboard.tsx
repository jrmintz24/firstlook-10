
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle, Calendar, TrendingUp, Plus, FileText } from "lucide-react";
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
import BuyerPostShowingHub from "./BuyerPostShowingHub";

interface SimpleBuyerDashboardProps {
  userId: string;
  displayName: string;
  onRequestTour: () => void;
}

const SimpleBuyerDashboard = ({ userId, displayName, onRequestTour }: SimpleBuyerDashboardProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const isMobile = useIsMobile();
  
  // Add dummy onOpenChat handler
  const handleOpenChat = (defaultTab: 'property' | 'support' = 'property', showingId?: string) => {
    console.log('Chat opened', { defaultTab, showingId });
  };
  
  const {
    loading,
    pendingRequests,
    activeShowings,
    completedShowings,
    isSubscribed,
    agreements,
    handleCancelShowing,
    handleRescheduleShowing,
    handleConfirmShowingWithModal,
    handleSignAgreementFromCard,
    handleSendMessage,
    fetchShowingRequests
  } = useBuyerDashboardLogic({ onOpenChat: handleOpenChat });

  const pendingShowings = pendingRequests || [];
  const upcomingShowings = activeShowings || [];
  const completedShowingsList = completedShowings || [];

  // Combine all showings for SmartReminders
  const allShowings = [...pendingShowings, ...upcomingShowings, ...completedShowingsList];

  const handleMakeOffer = (propertyAddress?: string) => {
    console.log('Make offer button clicked for:', propertyAddress);
    if (propertyAddress) {
      const queryParams = new URLSearchParams({
        property: propertyAddress
      });
      window.location.href = `/offer-questionnaire?${queryParams.toString()}`;
    } else {
      // If no specific property, navigate to general make offer page
      window.location.href = '/make-offer';
    }
  };

  const handleChatWithAgent = (showing: any) => {
    console.log('Chat with agent for showing:', showing.id);
    handleSendMessage(showing.id);
  };

  const handleReschedule = (showing: any) => {
    console.log('Reschedule showing:', showing.id);
    handleRescheduleShowing(showing.id);
  };

  const handleConfirmShowing = (showing: any) => {
    console.log('Confirm showing:', showing.id);
    handleConfirmShowingWithModal(showing);
  };

  const tabs = [
    {
      id: "overview",
      title: isMobile ? "Home" : "Overview",
      icon: Calendar,
      count: 0,
      content: (
        <div className="space-y-4 sm:space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Pending Tours</p>
                    <p className="text-2xl sm:text-3xl font-bold text-orange-600 leading-none">
                      {pendingShowings.length}
                    </p>
                  </div>
                  <div className="flex-shrink-0 ml-3 sm:ml-4">
                    <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Upcoming Tours</p>
                    <p className="text-2xl sm:text-3xl font-bold text-blue-600 leading-none">
                      {upcomingShowings.length}
                    </p>
                  </div>
                  <div className="flex-shrink-0 ml-3 sm:ml-4">
                    <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Completed Tours</p>
                    <p className="text-2xl sm:text-3xl font-bold text-green-600 leading-none">
                      {completedShowingsList.length}
                    </p>
                  </div>
                  <div className="flex-shrink-0 ml-3 sm:ml-4">
                    <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Mobile-first layout: sidebar content first, then main content */}
          <div className="space-y-4 sm:space-y-6 lg:grid lg:grid-cols-3 lg:gap-6 lg:space-y-0">
            {/* Mobile: Show sidebar content first */}
            <div className="space-y-4 sm:space-y-6 lg:order-2">
              <SmartReminders 
                showingRequests={allShowings}
                userType="buyer"
              />
              
              <QuickActions 
                onRequestShowing={onRequestTour}
                onMakeOffer={handleMakeOffer}
              />
            </div>
            
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6 lg:order-1">
              <RecentTours 
                pendingRequests={pendingShowings}
                activeShowings={upcomingShowings}
                completedShowings={completedShowingsList}
                onChatWithAgent={handleChatWithAgent}
                onReschedule={handleReschedule}
                onMakeOffer={(address: string) => handleMakeOffer(address)}
                onConfirmShowing={handleConfirmShowing}
              />
              
              <Card>
                <CardHeader className="pb-3 sm:pb-6">
                  <CardTitle className="text-lg sm:text-xl">Tour Progress</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm sm:text-base text-gray-600">Track your tour progress here</p>
                </CardContent>
              </Card>
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
          onRescheduleShowing={handleRescheduleShowing}
          onConfirmShowing={handleConfirmShowing}
          onSendMessage={handleSendMessage}
          userType="buyer"
          currentUserId={userId}
          agreements={agreements}
        />
      )
    },
    {
      id: "upcoming",
      title: isMobile ? "Active" : "Upcoming",
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
          onRescheduleShowing={handleRescheduleShowing}
          onConfirmShowing={handleConfirmShowing}
          onSendMessage={handleSendMessage}
          userType="buyer"
          currentUserId={userId}
          agreements={agreements}
        />
      )
    },
    {
      id: "offers",
      title: isMobile ? "Offers" : "My Offers",
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
      id: "history",
      title: "History",
      icon: CheckCircle,
      count: completedShowingsList.length,
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-semibold">Tour History</h2>
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
            <div className="space-y-4 sm:space-y-6">
              {completedShowingsList.map((showing) => (
                <Card key={showing.id} className="border rounded-lg">
                  <div className="p-3 sm:p-4 border-b">
                    <h3 className="font-medium text-sm sm:text-base">{showing.property_address}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">
                      Completed: {showing.status_updated_at ? new Date(showing.status_updated_at).toLocaleDateString() : 'Recently'}
                    </p>
                  </div>
                  <div className="p-3 sm:p-4">
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
    <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
              Welcome back, {displayName}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Find your perfect home with personalized tours
            </p>
          </div>
          
          <div className="flex-shrink-0">
            <Button 
              onClick={onRequestTour} 
              className="w-full sm:w-auto flex items-center justify-center gap-2 h-10 sm:h-auto"
              size={isMobile ? "default" : "default"}
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm sm:text-base">Request Tour</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="border-b border-gray-200 mb-4 sm:mb-6">
          <TabsList className="bg-transparent border-0 p-0 h-auto w-full justify-start overflow-x-auto">
            <div className="flex space-x-1 min-w-max px-1">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="relative px-3 sm:px-4 py-2 sm:py-3 bg-transparent border-0 rounded-none text-gray-600 font-medium hover:text-gray-900 data-[state=active]:bg-transparent data-[state=active]:text-blue-600 data-[state=active]:shadow-none data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:h-0.5 data-[state=active]:after:bg-blue-600 whitespace-nowrap"
                >
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <tab.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="text-xs sm:text-sm">{tab.title}</span>
                    {tab.count > 0 && (
                      <Badge variant="secondary" className="ml-1 px-1 py-0 text-xs h-4 min-w-[16px] flex items-center justify-center">
                        {tab.count}
                      </Badge>
                    )}
                  </div>
                </TabsTrigger>
              ))}
            </div>
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
