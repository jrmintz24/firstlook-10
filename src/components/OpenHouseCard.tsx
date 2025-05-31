
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Home, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface OpenHouseCardProps {
  house: {
    id: number;
    address: string;
    price: string;
    beds: number;
    baths: number;
    sqft: string;
    date: string;
    time: string;
    image: string;
  };
}

const OpenHouseCard = ({ house }: OpenHouseCardProps) => {
  const { toast } = useToast();

  const handleRSVP = () => {
    toast({
      title: "RSVP Confirmed! 🎉",
      description: "Open house added to your calendar. We'll send you a reminder.",
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0 shadow-lg bg-white">
      <div className="relative">
        <img 
          src={house.image} 
          alt={house.address}
          className="w-full h-48 object-cover bg-gradient-to-br from-purple-100 to-pink-100"
        />
        <Badge className="absolute top-3 left-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 px-3 py-1 shadow-lg">
          Open House
        </Badge>
        <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-200">
          <Heart className="h-4 w-4 text-gray-600 hover:text-red-500" />
        </button>
      </div>
      
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">{house.price}</div>
            <div className="flex items-start gap-2 text-gray-600">
              <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-purple-500" />
              <span className="text-sm leading-relaxed">{house.address}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-full">
              <Home className="h-4 w-4 text-blue-500" />
              <span className="font-medium">{house.beds} beds</span>
            </div>
            <div className="bg-green-50 px-3 py-1 rounded-full font-medium text-green-700">{house.baths} baths</div>
            <div className="bg-orange-50 px-3 py-1 rounded-full font-medium text-orange-700">{house.sqft} sqft</div>
          </div>
          
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1 text-purple-600">
              <Calendar className="h-4 w-4" />
              <span className="font-medium">{formatDate(house.date)}</span>
            </div>
            <div className="flex items-center gap-1 text-pink-600">
              <Clock className="h-4 w-4" />
              <span className="font-medium">{house.time}</span>
            </div>
          </div>
          
          <Button 
            onClick={handleRSVP}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 py-3 font-semibold"
          >
            RSVP & Add to Calendar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OpenHouseCard;
