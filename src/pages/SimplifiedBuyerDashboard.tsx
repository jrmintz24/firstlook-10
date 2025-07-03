
import { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, CheckCircle, Plus, MapPin, User, Phone, Mail, RefreshCw, Wifi, WifiOff, AlertCircle, Timer, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useSimplifiedBuyerData } from "@/hooks/useSimplifiedBuyerData";
import ModernTourSchedulingModal from "@/components/ModernTourSchedulingModal";
import AgreementSigningCard from "@/components/dashboard/AgreementSigningCard";
import SignAgreementModal from "@/components/dashboard/SignAgreementModal";
import { getStatusInfo, type ShowingStatus } from "@/utils/showingStatus";

const SimplifiedBuyerDashboard = () => {
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [showAgreementModal, setShowAgreementModal] = useState(false);
  const [selectedShowing, setSelectedShowing] = useState<any>(null);
  
  const {
    profile,
    loading,
    isRefreshing,
    authLoading,
    currentUser,
    connectionStatus,
    isConnected,
    currentPollingInterval,
    consecutiveErrors,
    pendingRequests,
    awaitingAgreement,
    activeShowings,
    completedShowings,
    agreements,
    signAgreement,
    refreshData,
    fetchShowingRequests,
    reconnect
  } = useSimplifiedBuyerData();

  // Handle successful form submission with optimistic updates
  const handleFormSuccess = useCallback(async () => {
    console.log('SimplifiedBuyerDashboard: Tour submitted, refreshing data');
    setShowPropertyForm(false);
    
    // Immediate refresh to show new request
    await fetchShowingRequests();
    console.log('SimplifiedBuyerDashboard: Data refresh completed');
  }, [fetchShowingRequests]);

  // Handle agreement signing
  const handleSignAgreement = useCallback(async (showingId: string, signerName: string) => {
    const success = await signAgreement(showingId, signerName);
    if (success) {
      setShowAgreementModal(false);
      setSelectedShowing(null);
    }
    return success;
  }, [signAgreement]);

  // Open agreement modal
  const handleOpenAgreementModal = useCallback((showing: any) => {
    setSelectedShowing(showing);
    setShowAgreementModal(true);
  }, []);

  const displayName = profile ? `${profile.first_name} ${profile.last_name}`.trim() : 
                     currentUser?.email?.split('@')[0] || 'User';

  // Show loading state
  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <div className="text-lg">Loading your dashboard...</div>
        </div>
      </div>
    );
  }

  const getConnectionStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <Wifi className="h-4 w-4 text-green-500" />;
      case 'connecting':
        return <Timer className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'polling':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <WifiOff className="h-4 w-4 text-red-500" />;
      default:
        return <Wifi className="h-4 w-4 text-gray-400" />;
    }
  };

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Live updates active';
      case 'connecting':
        return 'Connecting to live updates...';
      case 'polling':
        return `Checking for updates every ${Math.round(currentPollingInterval / 1000)}s`;
      case 'error':
        return consecutiveErrors > 3 ? 'Connection issues - manual refresh available' : 'Retrying connection...';
      default:
        return 'Connecting...';
    }
  };

  const renderShowingCard = (showing: any) => {
    const statusInfo = getStatusInfo(showing.status as ShowingStatus);
    
    // If this showing requires agreement signing, use the AgreementSigningCard
    if (showing.status === 'awaiting_agreement') {
      const showingWithAgreement = {
        ...showing,
        tour_agreement: {
          id: `agreement_${showing.id}`,
          showing_request_id: showing.id,
          signed: agreements[showing.id] || false,
          signed_at: null,
          agreement_type: 'single_tour',
          created_at: showing.created_at
        }
      };

      return (
        <AgreementSigningCard
          key={showing.id}
          showing={showingWithAgreement}
          onSign={handleSignAgreement}
        />
      );
    }
    
    return (
      <Card key={showing.id} className="hover:shadow-soft-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-purple-500 flex-shrink-0" />
                <span className="truncate">{showing.property_address}</span>
              </h3>
              <Badge className={`${statusInfo.bgColor} ${statusInfo.color} border-0 text-xs mb-2`}>
                <span className="mr-1">{statusInfo.icon}</span>
                {statusInfo.label}
              </Badge>
            </div>
          </div>

          {/* Date/Time Info */}
          {showing.preferred_date && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-gray-600 mb-3">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">{new Date(showing.preferred_date).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              {showing.preferred_time && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm">{showing.preferred_time}</span>
                </div>
              )}
            </div>
          )}

          {/* Agent Information */}
          {showing.assigned_agent_name && (
            <div className="bg-green-50 border border-green-200 p-3 rounded-lg mb-3">
              <div className="text-sm font-medium text-green-800 mb-2 flex items-center gap-1">
                <User className="h-4 w-4" />
                Assigned Agent
              </div>
              <div className="text-green-700 font-medium">{showing.assigned_agent_name}</div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2">
                {showing.assigned_agent_phone && (
                  <div className="flex items-center gap-1 text-green-600 text-sm">
                    <Phone className="h-3 w-3" />
                    <span>{showing.assigned_agent_phone}</span>
                  </div>
                )}
                {showing.assigned_agent_email && (
                  <div className="flex items-center gap-1 text-green-600 text-sm">
                    <Mail className="h-3 w-3" />
                    <span className="truncate">{showing.assigned_agent_email}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Notes */}
          {showing.message && (
            <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg mb-3">
              <div className="text-sm font-medium text-gray-800 mb-1">Your Notes</div>
              <div className="text-gray-600 text-sm">{showing.message}</div>
            </div>
          )}

          <p className="text-xs text-gray-400">
            Requested on {new Date(showing.created_at).toLocaleDateString()}
          </p>
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-6xl mx-auto">
          {/* Enhanced Header with Connection Status */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <h1 className="text-3xl font-bold text-gray-900">Welcome back, {displayName}!</h1>
              <div className="flex items-center gap-4">
                {/* Enhanced Connection Status */}
                <div className="flex items-center gap-2 text-sm">
                  {getConnectionStatusIcon()}
                  <div className="flex flex-col">
                    <span className="hidden sm:inline text-gray-600">{getConnectionStatusText()}</span>
                    {consecutiveErrors > 0 && (
                      <span className="text-xs text-red-500">
                        {consecutiveErrors} connection errors
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Enhanced Refresh Button */}
                <div className="flex items-center gap-2">
                  {!isConnected && (
                    <Button 
                      onClick={reconnect} 
                      variant="outline" 
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Wifi className="h-4 w-4" />
                      <span className="hidden sm:inline">Reconnect</span>
                    </Button>
                  )}
                  <Button 
                    onClick={refreshData} 
                    variant="outline" 
                    size="sm"
                    disabled={isRefreshing}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                    <span className="hidden sm:inline">Refresh</span>
                  </Button>
                </div>
              </div>
            </div>
            <p className="text-gray-600">Manage your property tours and requests</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <Clock className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{pendingRequests.length}</div>
                <div className="text-sm text-gray-600">Pending Requests</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <FileText className="h-8 w-8 text-amber-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{awaitingAgreement.length}</div>
                <div className="text-sm text-gray-600">Need Agreement</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Calendar className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{activeShowings.length}</div>
                <div className="text-sm text-gray-600">Confirmed Tours</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{completedShowings.length}</div>
                <div className="text-sm text-gray-600">Completed Tours</div>
              </CardContent>
            </Card>
          </div>

          {/* Request New Tour Button */}
          <div className="mb-8">
            <Button 
              onClick={() => setShowPropertyForm(true)}
              className="bg-black hover:bg-gray-800 text-white"
              size="lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              Request New Tour
            </Button>
          </div>

          {/* Tours Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Pending Requests */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-500" />
                Pending Requests ({pendingRequests.length})
              </h2>
              <div className="space-y-4">
                {pendingRequests.length === 0 ? (
                  <Card>
                    <CardContent className="p-6 text-center text-gray-500">
                      No pending requests. Ready to tour your next home?
                    </CardContent>
                  </Card>
                ) : (
                  pendingRequests.map(renderShowingCard)
                )}
              </div>
            </div>

            {/* Active Tours */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-500" />
                Confirmed Tours ({activeShowings.length})
              </h2>
              <div className="space-y-4">
                {activeShowings.length === 0 ? (
                  <Card>
                    <CardContent className="p-6 text-center text-gray-500">
                      No confirmed tours yet.
                    </CardContent>
                  </Card>
                ) : (
                  activeShowings.map(renderShowingCard)
                )}
              </div>
            </div>
          </div>

          {/* Awaiting Agreement Section */}
          {awaitingAgreement.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-amber-500" />
                Agreement Required ({awaitingAgreement.length})
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {awaitingAgreement.map(renderShowingCard)}
              </div>
            </div>
          )}

          {/* Completed Tours */}
          {completedShowings.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Recent History ({completedShowings.length})
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {completedShowings.slice(0, 4).map(renderShowingCard)}
              </div>
            </div>
          )}
        </div>
      </div>

      <ModernTourSchedulingModal
        isOpen={showPropertyForm}
        onClose={() => setShowPropertyForm(false)}
        onSuccess={handleFormSuccess}
        skipNavigation={true}
      />

      {showAgreementModal && selectedShowing && (
        <SignAgreementModal
          isOpen={showAgreementModal}
          onClose={() => setShowAgreementModal(false)}
          onSign={(signerName: string) => handleSignAgreement(selectedShowing.id, signerName)}
          showingDetails={{
            propertyAddress: selectedShowing.property_address,
            date: selectedShowing.preferred_date,
            time: selectedShowing.preferred_time,
            agentName: selectedShowing.assigned_agent_name
          }}
        />
      )}
    </>
  );
};

export default SimplifiedBuyerDashboard;
