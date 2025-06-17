import ErrorBoundary from "@/components/ErrorBoundary";
import PropertyRequestForm from "@/components/PropertyRequestForm";
import SignAgreementModal from "@/components/dashboard/SignAgreementModal";
import { SubscribeModal } from "@/components/subscription/SubscribeModal";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ModernDashboardLayout from "@/components/dashboard/ModernDashboardLayout";
import ModernHeader from "@/components/dashboard/ModernHeader";
import ModernStatsGrid from "@/components/dashboard/ModernStatsGrid";
import ModernSidebar from "@/components/dashboard/ModernSidebar";
import { useBuyerDashboardLogic } from "@/hooks/useBuyerDashboardLogic";
import { usePendingTourHandler } from "@/hooks/usePendingTourHandler";
import { generateBuyerDashboardSections } from "@/components/dashboard/BuyerDashboardSections";
import { Calendar, CheckCircle, MessageCircle, TrendingUp, Clock, User } from "lucide-react";

const BuyerDashboard = () => {
  // Handle any pending tour requests from signup
  usePendingTourHandler();

  const {
    // State
    showPropertyForm,
    setShowPropertyForm,
    showAgreementModal,
    setShowAgreementModal,
    showSubscribeModal,
    setShowSubscribeModal,
    activeTab,
    setActiveTab,
    
    // Data
    profile,
    selectedShowing,
    agreements,
    loading,
    authLoading,
    user,
    session,
    currentUser,
    pendingRequests,
    activeShowings,
    completedShowings,
    eligibility,
    isSubscribed,
    unreadCount,
    
    // Handlers
    handleRequestShowing,
    handleUpgradeClick,
    handleSubscriptionComplete,
    handleConfirmShowingWithModal,
    handleAgreementSignWithModal,
    handleSendMessage,
    handleStatClick,
    handleCancelShowing,
    handleRescheduleShowing,
    fetchShowingRequests
  } = useBuyerDashboardLogic();

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-lg font-medium text-gray-900 mb-2">Loading your dashboard...</div>
          <div className="text-sm text-gray-500">
            {authLoading ? 'Checking authentication...' : 'Loading dashboard data...'}
          </div>
        </div>
      </div>
    );
  }

  if (!user && !session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-medium text-gray-900 mb-4">Please sign in to view your dashboard</div>
          <Link to="/">
            <Button className="bg-blue-600 hover:bg-blue-700">Go to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const displayName = profile?.first_name || currentUser?.user_metadata?.first_name || currentUser?.email?.split('@')[0] || 'User';
  const allShowings = [...pendingRequests, ...activeShowings, ...completedShowings];

  // Modern stats configuration
  const modernStats = [
    {
      title: "Pending Tours",
      value: pendingRequests.length,
      change: pendingRequests.length > 0 ? { value: "Action needed", trend: 'neutral' as const } : undefined,
      icon: Clock,
      color: 'orange' as const,
      targetTab: "requested"
    },
    {
      title: "Confirmed Tours",
      value: activeShowings.length,
      change: activeShowings.length > 0 ? { value: "Upcoming", trend: 'up' as const } : undefined,
      icon: Calendar,
      color: 'blue' as const,
      targetTab: "confirmed"
    },
    {
      title: "Messages",
      value: unreadCount || 0,
      change: unreadCount > 0 ? { value: "New messages", trend: 'up' as const } : undefined,
      icon: MessageCircle,
      color: 'purple' as const,
      targetTab: "messages"
    },
    {
      title: "Completed",
      value: completedShowings.filter(s => s.status === 'completed').length,
      change: completedShowings.length > 0 ? { value: "Tours done", trend: 'up' as const } : undefined,
      icon: CheckCircle,
      color: 'green' as const,
      targetTab: "history"
    }
  ];

  // Transform agreements to expected array format
  const agreementsArray = Object.entries(agreements).map(([showing_request_id, signed]) => ({
    id: showing_request_id,
    showing_request_id,
    signed
  }));

  // Generate dashboard sections
  const dashboardSections = generateBuyerDashboardSections({
    pendingRequests,
    activeShowings,
    completedShowings,
    agreements: agreementsArray,
    currentUser,
    profile,
    displayName,
    unreadCount,
    onRequestShowing: handleRequestShowing,
    onCancelShowing: handleCancelShowing,
    onRescheduleShowing: handleRescheduleShowing,
    onConfirmShowing: handleConfirmShowingWithModal,
    fetchShowingRequests,
    onSendMessage: handleSendMessage
  });

  // Convert array to object for DashboardLayout
  const sectionsObject = dashboardSections.reduce((acc, section) => {
    acc[section.id] = section;
    return acc;
  }, {} as Record<string, any>);

  // Header component
  const header = (
    <ModernHeader
      title="Dashboard"
      subtitle={`Welcome back, ${displayName}!`}
      displayName={displayName}
      onPrimaryAction={handleRequestShowing}
      primaryActionText="Request Tour"
      userType="buyer"
      notificationCount={unreadCount}
    />
  );

  // Stats component
  const stats = <ModernStatsGrid stats={modernStats} onStatClick={handleStatClick} />;

  // Simplified main content - remove redundant welcome section
  const mainContent = (
    <div>
      {!isSubscribed && eligibility?.reason === 'free_showing_used' && (
        <Card className="border-l-4 border-l-orange-500 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-orange-900">Upgrade to Premium</h3>
                <p className="text-sm text-orange-700 mt-1">Get unlimited property tours and priority support</p>
              </div>
              <Button onClick={handleUpgradeClick} className="bg-orange-600 hover:bg-orange-700">
                Upgrade Now
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  // Sidebar content
  const sidebar = (
    <ModernSidebar 
      quickStats={[
        { label: "Active Tours", value: activeShowings.length, icon: Calendar },
        { label: "Total Requests", value: allShowings.length, icon: TrendingUp },
        { label: "Profile Complete", value: profile ? "100%" : "60%", icon: User }
      ]}
      upcomingEvents={activeShowings.slice(0, 3).map(showing => ({
        id: showing.id,
        title: showing.property_address,
        date: showing.preferred_date ? new Date(showing.preferred_date).toLocaleDateString() : 'TBD',
        type: 'Property Tour'
      }))}
      activities={[
        ...pendingRequests.slice(0, 2).map(req => ({
          id: req.id,
          type: 'update' as const,
          title: 'Tour Request Submitted',
          description: req.property_address,
          time: new Date(req.created_at).toLocaleDateString(),
          unread: false
        })),
        ...completedShowings.slice(0, 2).map(req => ({
          id: req.id,
          type: 'update' as const,
          title: 'Tour Completed',
          description: req.property_address,
          time: req.status_updated_at ? new Date(req.status_updated_at).toLocaleDateString() : '',
          unread: false
        }))
      ]}
    />
  );

  return (
    <>
      <ModernDashboardLayout
        header={header}
        stats={stats}
        mainContent={mainContent}
        sidebar={sidebar}
        sections={sectionsObject}
        defaultSection="requested"
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <ErrorBoundary>
        <PropertyRequestForm
          isOpen={showPropertyForm}
          onClose={setShowPropertyForm}
        />
      </ErrorBoundary>

      {selectedShowing && (
        <SignAgreementModal
          isOpen={showAgreementModal}
          onClose={() => setShowAgreementModal(false)}
          onSign={handleAgreementSignWithModal}
        />
      )}

      <SubscribeModal
        isOpen={showSubscribeModal}
        onClose={() => setShowSubscribeModal(false)}
        onSubscriptionComplete={handleSubscriptionComplete}
      />
    </>
  );
};

export default BuyerDashboard;
