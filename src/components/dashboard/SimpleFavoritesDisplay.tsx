import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Calendar, ExternalLink, Trash2 } from "lucide-react";
import { useBuyerFavorites } from '@/hooks/useBuyerFavorites';

interface SimpleFavoritesDisplayProps {
  buyerId: string;
  showScheduleButton?: boolean;
  showRemoveButton?: boolean;
  limit?: number;
}

const SimpleFavoritesDisplay = ({ 
  buyerId, 
  showScheduleButton = true, 
  showRemoveButton = true,
  limit 
}: SimpleFavoritesDisplayProps) => {
  const { favorites, loading, removeFavorite } = useBuyerFavorites(buyerId);
  const [isRemoving, setIsRemoving] = useState<string | null>(null);

  const handleRemove = async (favoriteId: string) => {
    if (!showRemoveButton) return;
    
    setIsRemoving(favoriteId);
    try {
      await removeFavorite(favoriteId);
    } catch (error) {
      console.error('Failed to remove favorite:', error);
    } finally {
      setIsRemoving(null);
    }
  };

  const handleScheduleTour = (mlsId: string) => {
    window.location.href = `/schedule-tour?listing=${mlsId}`;
  };

  const handleViewProperty = (pageUrl: string) => {
    if (pageUrl) {
      window.open(pageUrl, '_blank');
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading favorites...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const displayFavorites = limit ? favorites.slice(0, limit) : favorites;

  if (displayFavorites.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No favorites yet</h3>
          <p className="text-gray-600">
            Start exploring properties and save your favorites to see them here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {displayFavorites.map((favorite) => (
        <Card key={favorite.id} className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {(favorite.idx_property as any)?.address || favorite.property_address}
                  </h3>
                  {favorite.idx_property?.status === 'active' && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Active
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  {favorite.idx_property?.price && (
                    <span className="font-medium text-green-600">
                      ${parseFloat(favorite.idx_property.price.toString()).toLocaleString()}
                    </span>
                  )}
                  {favorite.idx_property?.beds && (
                    <span>{favorite.idx_property.beds} beds</span>
                  )}
                  {favorite.idx_property?.baths && (
                    <span>{favorite.idx_property.baths} baths</span>
                  )}
                  {favorite.idx_property?.sqft && (
                    <span>{favorite.idx_property.sqft} sqft</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {showScheduleButton && (
                    <Button 
                      size="sm" 
                      onClick={() => handleScheduleTour(favorite.mls_id)}
                      className="flex items-center gap-2"
                    >
                      <Calendar className="h-4 w-4" />
                      Schedule Tour
                    </Button>
                  )}
                  
                  {(favorite.idx_property as any)?.ihf_page_url && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleViewProperty((favorite.idx_property as any).ihf_page_url)}
                      className="flex items-center gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      View Details
                    </Button>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {favorite.idx_property?.images && favorite.idx_property.images.length > 0 && (
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                    <img 
                      src={favorite.idx_property.images[0]} 
                      alt="Property"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                {showRemoveButton && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRemove(favorite.id)}
                    disabled={isRemoving === favorite.id}
                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      {limit && favorites.length > limit && (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 text-center">
            <p className="text-gray-600">
              {favorites.length - limit} more favorites available
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SimpleFavoritesDisplay;