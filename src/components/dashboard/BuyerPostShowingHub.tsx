
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, TrendingUp, FileText } from "lucide-react";
import { usePostShowingDashboardData } from "@/hooks/usePostShowingDashboardData";
import PostShowingActionsPanel from "@/components/post-showing/PostShowingActionsPanel";
import AgentConnectionCard from "@/components/dashboard/AgentConnectionCard";

interface BuyerPostShowingHubProps {
  buyerId: string;
}

const BuyerPostShowingHub = ({ buyerId }: BuyerPostShowingHubProps) => {
  const { 
    completedShowings, 
    postShowingActions, 
    favorites, 
    agentConnections,
    loading,
    refreshData
  } = usePostShowingDashboardData(buyerId);

  const [selectedShowing, setSelectedShowing] = useState<any>(null);

  const handleContactAgent = (agentId: string, method: 'phone' | 'email' | 'message') => {
    console.log(`Contacting agent ${agentId} via ${method}`);
    // TODO: Implement contact functionality
    switch (method) {
      case 'phone':
        // Open phone dialer or show phone number
        break;
      case 'email':
        // Open email client or show email form
        break;
      case 'message':
        // Open messaging interface
        break;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your tour activity...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const recentShowings = completedShowings.slice(0, 5);
  const showingStats = {
    total: completedShowings.length,
    withActions: postShowingActions.length,
    favorites: favorites.length,
    agentConnections: agentConnections.length
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-900 leading-none mb-1">
                {showingStats.total}
              </div>
              <div className="text-sm text-gray-600">Tours Completed</div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-900 leading-none mb-1">
                {showingStats.favorites}
              </div>
              <div className="text-sm text-gray-600">Properties Favorited</div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-900 leading-none mb-1">
                {showingStats.agentConnections}
              </div>
              <div className="text-sm text-gray-600">Agent Connections</div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-900 leading-none mb-1">
                {showingStats.withActions}
              </div>
              <div className="text-sm text-gray-600">Actions Taken</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>Your Tour Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="recent" className="space-y-6">
            <TabsList>
              <TabsTrigger value="recent">Recent Tours</TabsTrigger>
              <TabsTrigger value="favorites">Favorites ({showingStats.favorites})</TabsTrigger>
              <TabsTrigger value="connections">Agent Connections ({showingStats.agentConnections})</TabsTrigger>
            </TabsList>

            <TabsContent value="recent" className="space-y-4">
              {recentShowings.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No completed tours yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentShowings.map((showing) => {
                    const showingActions = postShowingActions.filter(
                      action => action.showing_request_id === showing.id
                    );
                    const showingFavorites = favorites.filter(
                      fav => fav.showing_request_id === showing.id
                    );
                    const showingConnections = agentConnections.filter(
                      conn => conn.showing_request_id === showing.id
                    );

                    return (
                      <Card key={showing.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-medium text-gray-900">{showing.property_address}</h4>
                              <p className="text-sm text-gray-600">
                                Completed {new Date(showing.status_updated_at).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              {showingFavorites.length > 0 && (
                                <Badge variant="secondary" className="bg-red-100 text-red-800">
                                  <Heart className="w-3 h-3 mr-1" />
                                  Favorited
                                </Badge>
                              )}
                              {showingConnections.length > 0 && (
                                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                                  <MessageCircle className="w-3 h-3 mr-1" />
                                  Agent Connected
                                </Badge>
                              )}
                            </div>
                          </div>

                          {(showingActions.length === 0 && showingFavorites.length === 0 && showingConnections.length === 0) ? (
                            <div className="border-t pt-3">
                              <PostShowingActionsPanel
                                showingId={showing.id}
                                buyerId={buyerId}
                                agentId={showing.assigned_agent_id}
                                agentName={showing.assigned_agent_name}
                                agentEmail={showing.assigned_agent_email}
                                agentPhone={showing.assigned_agent_phone}
                                propertyAddress={showing.property_address}
                                onActionCompleted={() => {}}
                                onDataRefresh={refreshData}
                              />
                            </div>
                          ) : (
                            <div className="border-t pt-3">
                              <p className="text-sm text-green-600 font-medium">
                                ✓ Actions completed for this property
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            <TabsContent value="favorites" className="space-y-4">
              {favorites.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Heart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No favorite properties yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {favorites.map((favorite) => (
                    <Card key={favorite.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">{favorite.property_address}</h4>
                            <p className="text-sm text-gray-600">
                              Favorited {new Date(favorite.created_at).toLocaleDateString()}
                            </p>
                            {favorite.notes && (
                              <p className="text-sm text-gray-700 mt-2 italic">"{favorite.notes}"</p>
                            )}
                          </div>
                          <Badge className="bg-red-100 text-red-800">
                            <Heart className="w-3 h-3 mr-1" />
                            Favorite
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="connections" className="space-y-4">
              {agentConnections.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No agent connections yet</p>
                  <p className="text-sm mt-2">Connect with agents after your tours to get expert guidance</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {agentConnections.map((connection) => (
                    <AgentConnectionCard
                      key={connection.id}
                      connection={connection}
                      onContactAgent={handleContactAgent}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default BuyerPostShowingHub;
