
import { useState } from "react";
import { useBuyerDashboardLogic } from "@/hooks/useBuyerDashboardLogic";
import { usePendingTourHandler } from "@/hooks/usePendingTourHandler";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Home, 
  Calendar, 
  Clock, 
  CheckCircle, 
  MessageCircle, 
  Gift,
  Settings,
  Plus,
  MapPin,
  TrendingUp
} from "lucide-react";

// Import modals
import ErrorBoundary from "@/components/ErrorBoundary";
import PropertyRequestForm from "@/components/PropertyRequestForm";
import SignAgreementModal from "@/components/dashboard/SignAgreementModal";
import { SubscribeModal } from "@/components/subscription/SubscribeModal";
import MakeOfferModal from "@/components/dashboard/MakeOfferModal";
import ChatInitiator from "@/components/messaging/ChatInitiator";
import RescheduleModal from "@/components/dashboard/RescheduleModal";

// Import dashboard components
import DashboardStats from "./DashboardStats";
import QuickActions from "./QuickActions";
import RecentTours from "./RecentTours";

const SimpleBuyerDashboard = () => {
  // Handle any pending tour requests from signup
  usePendingTourHandler();

  // Chat and reschedule state
  const [chatShowing, setChatShowing] = useState<any>(null);
  const [rescheduleShowing, setRescheduleShowing] = useState<any>(null);

  const {
    // State
    showPropertyForm,
    setShowPropertyForm,
    showAgreementModal,
    setShowAgreementModal,
    showSubscribeModal,
    setShowSubscribeModal,
    
    // Data
    profile,
    selectedShowing,
    loading,
    authLoading,
    user,
    session,
    currentUser,
    pendingRequests = [],
    activeShowings = [],
    completedShowings = [],
    unreadCount = 0,
    
    // Handlers
    handleRequestShowing,
    handleSubscriptionComplete,
    handleConfirmShowingWithModal,
    handleAgreementSignWithModal,
    fetchShowingRequests
  } = useBuyerDashboardLogic();

  // Make offer state
  const [showMakeOfferModal, setShowMakeOfferModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<string>("");

  // Show loading while auth is being determined
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <div className="text-lg mb-4">Checking authentication...</div>
        </div>
      </div>
    );
  }

  if (!user && !session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-lg mb-4">Please sign in to view your dashboard</div>
          <Link to="/">
            <Button>Go to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <div className="text-lg mb-4">Loading your dashboard...</div>
        </div>
      </div>
    );
  }

  // Safe fallbacks for first-time users
  const displayName = profile?.first_name || 
                     currentUser?.user_metadata?.first_name || 
                     currentUser?.email?.split('@')[0] || 
                     'User';

  const handleMakeOffer = (propertyAddress: string) => {
    setSelectedProperty(propertyAddress);
    setShowMakeOfferModal(true);
  };

  const handleChatWithAgent = (showing: any) => {
    if (!showing.assigned_agent_id) {
      return; // No agent assigned yet
    }
    setChatShowing(showing);
  };

  const handleReschedule = (showing: any) => {
    setRescheduleShowing(showing);
  };

  const handleRescheduleSuccess = () => {
    fetchShowingRequests();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/30 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {displayName}! 👋
              </h1>
              <p className="text-gray-600 mt-1">
                Let's find your dream home together
              </p>
            </div>
            <div className="flex items-center gap-4">
              {unreadCount > 0 && (
                <div className="flex items-center gap-2 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                  <MessageCircle className="w-4 h-4" />
                  {unreadCount} new message{unreadCount !== 1 ? 's' : ''}
                </div>
              )}
              <Button 
                onClick={handleRequestShowing}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Request Showing
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Stats */}
        <DashboardStats 
          pendingCount={pendingRequests.length}
          activeCount={activeShowings.length}
          completedCount={completedShowings.length}
          unreadCount={unreadCount || 0}
        />

        {/* Quick Actions */}
        <QuickActions 
          onRequestShowing={handleRequestShowing}
          onMakeOffer={() => handleMakeOffer("")}
        />

        {/* Recent Tours */}
        <RecentTours 
          pendingRequests={pendingRequests}
          activeShowings={activeShowings}
          completedShowings={completedShowings}
          onChatWithAgent={handleChatWithAgent}
          onReschedule={handleReschedule}
          onMakeOffer={handleMakeOffer}
          onConfirmShowing={handleConfirmShowingWithModal}
        />
      </div>

      {/* Modals */}
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

      <MakeOfferModal
        isOpen={showMakeOfferModal}
        onClose={() => setShowMakeOfferModal(false)}
        propertyAddress={selectedProperty}
      />

      {chatShowing && (
        <ChatInitiator
          showingRequestId={chatShowing.id}
          agentId={chatShowing.assigned_agent_id}
          buyerId={currentUser?.id || ''}
          propertyAddress={chatShowing.property_address}
          isOpen={!!chatShowing}
          onClose={() => setChatShowing(null)}
        />
      )}

      {rescheduleShowing && (
        <RescheduleModal
          showingRequest={rescheduleShowing}
          isOpen={!!rescheduleShowing}
          onClose={() => setRescheduleShowing(null)}
          onSuccess={handleRescheduleSuccess}
        />
      )}
    </div>
  );
};

export default SimpleBuyerDashboard;
