import React, { useState } from 'react';
import { Heart, FileText, Users, ChevronRight, Star, Calendar, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { useBuyerFavorites } from '@/hooks/useBuyerFavorites';
import { useBuyerAgentConnections } from '@/hooks/useBuyerAgentConnections';
import OfferTabContent from './OfferTabContent';
import AgentConnectionCard from './AgentConnectionCard';
import ModernTourSchedulingModal from '@/components/ModernTourSchedulingModal';

interface PortfolioTabProps {
  buyerId?: string;
  onScheduleTour?: (propertyAddress: string, mlsId?: string) => void;
}

export const PortfolioTab: React.FC<PortfolioTabProps> = ({ buyerId, onScheduleTour }) => {
  const [activeSection, setActiveSection] = useState('favorites');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const navigate = useNavigate();
  const { favorites, loading: favoritesLoading } = useBuyerFavorites(buyerId);
  const { connections, loading: connectionsLoading, handleContactAgent } = useBuyerAgentConnections(buyerId);

  // Handlers for property card actions
  const handleViewDetails = (favorite: any) => {
    // Navigate to property details page using MLS ID
    if (favorite.mls_id) {
      navigate(`/listing/${favorite.mls_id}`);
    } else if (favorite.property_address) {
      // Fallback: search for property by address
      navigate(`/listings?search=${encodeURIComponent(favorite.property_address)}`);
    }
  };

  const handleScheduleTourClick = (favorite: any) => {
    // Open the modal with the selected property
    setSelectedProperty(favorite);
    setShowScheduleModal(true);
  };

  const handleScheduleModalClose = () => {
    setShowScheduleModal(false);
    setSelectedProperty(null);
  };

  const handleScheduleSuccess = async () => {
    // Handle successful scheduling
    setShowScheduleModal(false);
    setSelectedProperty(null);
  };

  const sections = [
    {
      id: 'favorites',
      label: 'Favorites',
      icon: Heart,
      count: favorites?.length || 0,
      color: 'text-red-600 bg-red-50 border-red-200',
      description: 'Properties you\'ve saved'
    },
    {
      id: 'offers',
      label: 'Offers',
      icon: FileText,
      count: 0, // Will be populated by OfferTabContent
      color: 'text-blue-600 bg-blue-50 border-blue-200',
      description: 'Active offer intents'
    },
    {
      id: 'agents',
      label: 'Agents',
      icon: Users,
      count: connections?.length || 0,
      color: 'text-purple-600 bg-purple-50 border-purple-200',
      description: 'Your agent connections'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Portfolio Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sections.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;
          
          return (
            <Card 
              key={section.id}
              className={`
                cursor-pointer transition-all duration-200 hover:shadow-md
                ${isActive ? `${section.color} ring-2 ring-offset-2` : 'hover:bg-gray-50'}
              `}
              onClick={() => setActiveSection(section.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-lg ${section.color.split(' ')[1]} ${section.color.split(' ')[2]}`}>
                      <Icon className={`h-6 w-6 ${section.color.split(' ')[0]}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{section.label}</h3>
                      <p className="text-sm text-gray-600">{section.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="text-lg font-bold px-3 py-1">
                      {section.count}
                    </Badge>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Portfolio Content */}
      <Tabs value={activeSection} onValueChange={setActiveSection}>
        <TabsList className="hidden" /> {/* Hide since we're using cards for navigation */}
        
        <TabsContent value="favorites" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-600" />
                Favorite Properties
              </CardTitle>
            </CardHeader>
            <CardContent>
              {favoritesLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-24 bg-gray-200 rounded-lg"></div>
                    </div>
                  ))}
                </div>
              ) : favorites && favorites.length > 0 ? (
                <div className="space-y-4">
                  {favorites.map((favorite) => (
                    <FavoritePropertyCard 
                      key={favorite.id} 
                      favorite={favorite}
                      onViewDetails={() => handleViewDetails(favorite)}
                      onScheduleTour={() => handleScheduleTourClick(favorite)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No favorites yet</h3>
                  <p className="text-gray-600 mb-4">
                    Start saving properties you're interested in to see them here
                  </p>
                  <Button variant="outline">
                    Browse Properties
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="offers" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                My Offers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <OfferTabContent buyerId={buyerId || ''} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="agents" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600" />
                Agent Connections
              </CardTitle>
            </CardHeader>
            <CardContent>
              {connectionsLoading ? (
                <div className="space-y-4">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-32 bg-gray-200 rounded-lg"></div>
                    </div>
                  ))}
                </div>
              ) : connections && connections.length > 0 ? (
                <div className="space-y-4">
                  {connections.map((connection) => (
                    <AgentConnectionCard
                      key={connection.id}
                      connection={connection}
                      onContactAgent={handleContactAgent}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No agent connections yet</h3>
                  <p className="text-gray-600 mb-4">
                    When you request tours, you'll be matched with local agents who will appear here
                  </p>
                  <Button variant="outline" onClick={() => window.location.href = '/listings'}>
                    Browse Properties
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Tour Scheduling Modal */}
      {showScheduleModal && selectedProperty && (
        <ModernTourSchedulingModal
          isOpen={showScheduleModal}
          onClose={handleScheduleModalClose}
          onSuccess={handleScheduleSuccess}
          initialAddress={selectedProperty.property_address}
          propertyId={selectedProperty.mls_id}
          propertyDetails={{
            address: selectedProperty.property_address,
            mlsId: selectedProperty.mls_id,
            price: selectedProperty.idx_property?.price,
            beds: selectedProperty.idx_property?.beds,
            baths: selectedProperty.idx_property?.baths,
            sqft: selectedProperty.idx_property?.sqft,
            imageUrl: selectedProperty.idx_property?.images?.[0]?.url
          }}
          skipNavigation={true}
        />
      )}
    </div>
  );
};

// Favorite Property Card Component
interface FavoritePropertyCardProps {
  favorite: any;
  onViewDetails: () => void;
  onScheduleTour: () => void;
}

const FavoritePropertyCard: React.FC<FavoritePropertyCardProps> = ({ 
  favorite, 
  onViewDetails, 
  onScheduleTour 
}) => {
  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex items-center space-x-4">
        {favorite.property_image && (
          <img 
            src={favorite.property_image} 
            alt="Property"
            className="w-16 h-16 object-cover rounded-lg"
          />
        )}
        <div className="flex-1">
          <h4 className="font-medium text-gray-900">{favorite.property_address}</h4>
          <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
            {favorite.property_price && (
              <span className="font-medium text-green-600">
                ${favorite.property_price.toLocaleString()}
              </span>
            )}
            {favorite.property_beds && (
              <span>{favorite.property_beds} beds</span>
            )}
            {favorite.property_baths && (
              <span>{favorite.property_baths} baths</span>
            )}
            {favorite.property_sqft && (
              <span>{favorite.property_sqft.toLocaleString()} sqft</span>
            )}
          </div>
          <div className="flex items-center space-x-2 mt-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span className="text-xs text-gray-500">
              Saved {new Date(favorite.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" onClick={onViewDetails}>
          View Details
        </Button>
        <Button variant="default" size="sm" onClick={onScheduleTour}>
          Schedule Tour
        </Button>
      </div>
    </div>
  );
};