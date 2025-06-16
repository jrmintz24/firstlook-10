
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useBuyerDashboard } from "@/hooks/useBuyerDashboard";
import { useShowingEligibility } from "@/hooks/useShowingEligibility";
import { useSubscriptionStatus } from "@/hooks/useSubscriptionStatus";
import { useMessages } from "@/hooks/useMessages";

interface EligibilityResult {
  eligible: boolean;
  reason: string;
  active_showing_count?: number;
  subscription_tier?: string;
}

export const useBuyerDashboardLogic = () => {
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [showAgreementModal, setShowAgreementModal] = useState(false);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("active");
  const { toast } = useToast();
  const { eligibility, checkEligibility } = useShowingEligibility();
  const { isSubscribed, subscriptionTier, refreshStatus } = useSubscriptionStatus();
  
  const {
    profile,
    selectedShowing,
    agreements,
    loading,
    authLoading,
    user,
    session,
    pendingRequests,
    activeShowings,
    completedShowings,
    handleCancelShowing,
    handleRescheduleShowing,
    handleConfirmShowing,
    handleAgreementSign,
    fetchUserData,
    fetchShowingRequests
  } = useBuyerDashboard();

  const currentUser = user || session?.user;
  const { unreadCount, sendMessage } = useMessages(currentUser?.id || '');

  const handleRequestShowing = async () => {
    const currentEligibility = await checkEligibility() as EligibilityResult | null;
    
    if (!currentEligibility?.eligible) {
      if (currentEligibility?.reason === 'active_showing_exists') {
        toast({
          title: "Active Showing Exists",
          description: "You already have a showing scheduled. Complete or cancel it before booking another.",
          variant: "destructive"
        });
        return;
      } else if (currentEligibility?.reason === 'free_showing_used') {
        return;
      }
    }
    
    setShowPropertyForm(true);
  };

  const handleUpgradeClick = () => {
    console.log('Upgrade button clicked', {
      userId: user?.id,
      email: user?.email,
      eligibilityReason: eligibility?.reason,
      timestamp: new Date().toISOString()
    });
    setShowSubscribeModal(true);
  };

  const handleSubscriptionComplete = async () => {
    console.log('Subscription completed from dashboard', {
      userId: user?.id,
      email: user?.email,
      timestamp: new Date().toISOString()
    });
    
    await refreshStatus();
    await fetchUserData();
    
    toast({
      title: "Welcome to FirstLook Premium! 🎉",
      description: "You can now book unlimited home tours!",
    });
  };

  const handleConfirmShowingWithModal = (showing: any) => {
    handleConfirmShowing(showing);
    setShowAgreementModal(true);
  };

  const handleAgreementSignWithModal = async (name: string) => {
    await handleAgreementSign(name);
    setShowAgreementModal(false);
  };

  const handleSendMessage = async (requestId: string) => {
    toast({
      title: "Coming Soon",
      description: "Direct messaging will be available soon!",
    });
  };

  const handleStatClick = (targetTab: string) => {
    setActiveTab(targetTab);
  };

  return {
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
    subscriptionTier,
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
  };
};
