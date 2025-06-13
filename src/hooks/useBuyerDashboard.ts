
import { useBuyerAuth } from "./useBuyerAuth";
import { useBuyerShowings } from "./useBuyerShowings";
import { usePendingTourHandler } from "./usePendingTourHandler";
import { supabase } from "@/integrations/supabase/client";

export const useBuyerDashboard = () => {
  const {
    profile,
    setProfile,
    loading: authLoading,
    user,
    session,
    currentUser,
    displayName
  } = useBuyerAuth();

  const fetchUserData = async () => {
    if (!currentUser) {
      console.log('No current user available for fetchUserData');
      return;
    }

    try {
      console.log('Starting to fetch user data for:', currentUser.id);
      
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();

      console.log('Profile fetch result:', { profileData, profileError });

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Profile error:', profileError);
        if (profileError.code === 'PGRST116') {
          console.log('No profile found, using user metadata');
          const defaultProfile = {
            id: currentUser.id,
            first_name: currentUser.user_metadata?.first_name || currentUser.email?.split('@')[0] || 'User',
            last_name: currentUser.user_metadata?.last_name || '',
            phone: currentUser.user_metadata?.phone || '',
            user_type: 'buyer'
          };
          setProfile(defaultProfile);
        }
      } else if (profileData) {
        setProfile(profileData);
        console.log('Profile set:', profileData);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const {
    showingRequests,
    selectedShowing,
    agreements,
    loading: showingsLoading,
    pendingRequests,
    activeShowings,
    completedShowings,
    handleCancelShowing,
    handleRescheduleShowing,
    handleConfirmShowing,
    handleAgreementSign,
    fetchShowingRequests
  } = useBuyerShowings(currentUser, profile);

  usePendingTourHandler(currentUser, fetchUserData);

  const loading = authLoading || showingsLoading;

  return {
    profile,
    showingRequests,
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
    fetchUserData
  };
};
