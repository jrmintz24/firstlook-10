
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Heart, Edit3, Save, X, MapPin, Calendar, Home, Bed, Bath, Square } from "lucide-react";

interface FavoriteProperty {
  id: string;
  buyer_id: string;
  showing_request_id: string | null;
  property_address: string;
  notes: string | null;
  created_at: string;
  mls_id?: string;
  idx_property_id?: string;
  // IDX property details
  idx_property?: {
    id: string;
    price: number | null;
    beds: number | null;
    baths: number | null;
    sqft: number | null;
    images: any;
    property_type: string | null;
    status: string | null;
    city: string | null;
    state: string | null;
  };
}

interface FavoritePropertyCardProps {
  favorite: FavoriteProperty;
  onRemove: (id: string) => void;
  onUpdateNotes: (id: string, notes: string) => void;
}

const FavoritePropertyCard = ({ favorite, onRemove, onUpdateNotes }: FavoritePropertyCardProps) => {
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [noteText, setNoteText] = useState(favorite.notes || '');

  const handleSaveNotes = () => {
    onUpdateNotes(favorite.id, noteText);
    setIsEditingNotes(false);
  };

  const handleCancelEdit = () => {
    setNoteText(favorite.notes || '');
    setIsEditingNotes(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatPrice = (price: number | null) => {
    if (!price) return 'Price not available';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);
  };

  const property = favorite.idx_property;

  return (
    <Card className="border rounded-lg hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        {/* Property Image */}
        {property?.images && Array.isArray(property.images) && property.images.length > 0 && (
          <div className="mb-3 rounded-lg overflow-hidden">
            <img 
              src={property.images[0]} 
              alt={favorite.property_address}
              className="w-full h-48 object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}

        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <h3 className="font-semibold text-gray-900 line-clamp-2">
                {favorite.property_address}
              </h3>
            </div>

            {/* Property Details */}
            {property && (
              <div className="space-y-2 mb-3">
                {property.price && (
                  <div className="text-xl font-bold text-primary">
                    {formatPrice(property.price)}
                  </div>
                )}
                
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  {property.beds && (
                    <div className="flex items-center gap-1">
                      <Bed className="h-3 w-3" />
                      <span>{property.beds} bed{property.beds > 1 ? 's' : ''}</span>
                    </div>
                  )}
                  {property.baths && (
                    <div className="flex items-center gap-1">
                      <Bath className="h-3 w-3" />
                      <span>{property.baths} bath{property.baths > 1 ? 's' : ''}</span>
                    </div>
                  )}
                  {property.sqft && (
                    <div className="flex items-center gap-1">
                      <Square className="h-3 w-3" />
                      <span>{property.sqft.toLocaleString()} sqft</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {property.property_type && (
                    <Badge variant="secondary" className="text-xs">
                      {property.property_type}
                    </Badge>
                  )}
                  {property.status && (
                    <Badge 
                      variant={property.status === 'active' ? 'default' : 'outline'} 
                      className="text-xs"
                    >
                      {property.status}
                    </Badge>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="h-3 w-3" />
              <span>Added {formatDate(favorite.created_at)}</span>
              {favorite.showing_request_id && (
                <Badge variant="outline" className="text-xs">
                  From Tour
                </Badge>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(favorite.id)}
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <Heart className="h-4 w-4 fill-current" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Notes</span>
              {!isEditingNotes && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditingNotes(true)}
                  className="h-7 px-2 text-gray-500 hover:text-gray-700"
                >
                  <Edit3 className="h-3 w-3" />
                </Button>
              )}
            </div>
            
            {isEditingNotes ? (
              <div className="space-y-2">
                <Textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Add notes about this property..."
                  className="min-h-[80px] text-sm"
                />
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCancelEdit}
                    className="h-7 px-3"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSaveNotes}
                    className="h-7 px-3"
                  >
                    <Save className="h-3 w-3 mr-1" />
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-600 bg-gray-50 rounded-md p-3 min-h-[60px]">
                {favorite.notes || (
                  <span className="italic text-gray-400">
                    No notes added yet. Click the edit icon to add some.
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FavoritePropertyCard;
