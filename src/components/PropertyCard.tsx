
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Home, Heart, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PropertyCardProps {
  property: {
    id: string;
    address: string;
    price: string;
    beds: number;
    baths: number;
    sqft: string;
    propertyType: string;
    image: string;
  };
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  const { toast } = useToast();

  const handleContact = () => {
    toast({
      title: "Contact Request Sent! 📧",
      description: "We'll connect you with the listing agent shortly.",
    });
  };

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0 shadow-lg bg-white">
      <div className="relative">
        <img 
          src={property.image} 
          alt={property.address}
          className="w-full h-48 object-cover bg-gradient-to-br from-blue-100 to-green-100"
        />
        <Badge className="absolute top-3 left-3 bg-gradient-to-r from-blue-500 to-green-500 text-white border-0 px-3 py-1 shadow-lg">
          {property.propertyType}
        </Badge>
        <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-200">
          <Heart className="h-4 w-4 text-gray-600 hover:text-red-500" />
        </button>
      </div>
      
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-2">
              {property.price}
            </div>
            <div className="flex items-start gap-2 text-gray-600">
              <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-blue-500" />
              <span className="text-sm leading-relaxed">{property.address}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-full">
              <Home className="h-4 w-4 text-blue-500" />
              <span className="font-medium">{property.beds} beds</span>
            </div>
            <div className="bg-green-50 px-3 py-1 rounded-full font-medium text-green-700">
              {property.baths} baths
            </div>
            {property.sqft && (
              <div className="bg-orange-50 px-3 py-1 rounded-full font-medium text-orange-700">
                {property.sqft} sqft
              </div>
            )}
          </div>
          
          <Button 
            onClick={handleContact}
            className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 py-3 font-semibold"
          >
            Contact Agent
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
