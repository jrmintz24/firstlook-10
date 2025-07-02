
import { Heart } from "lucide-react";
import { useBuyerFavorites } from "@/hooks/useBuyerFavorites";
import FavoritePropertyCard from "./FavoritePropertyCard";
import EmptyStateCard from "./EmptyStateCard";

interface FavoritesSectionProps {
  buyerId?: string;
}

const FavoritesSection = ({ buyerId }: FavoritesSectionProps) => {
  const { favorites, loading, removeFavorite, updateNotes } = useBuyerFavorites(buyerId);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <EmptyStateCard
        icon={Heart}
        title="No Favorite Properties"
        description="Properties you save as favorites will appear here. Visit properties and save the ones you love!"
        buttonText=""
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          Your Favorite Properties ({favorites.length})
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((favorite) => (
          <FavoritePropertyCard
            key={favorite.id}
            favorite={favorite}
            onRemove={removeFavorite}
            onUpdateNotes={updateNotes}
          />
        ))}
      </div>
    </div>
  );
};

export default FavoritesSection;
