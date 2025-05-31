
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Home } from "lucide-react";
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
      title: "RSVP Confirmed! 📅",
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
    <Card className="overflow-hidden hover:shadow-lg transition-shadow border-blue-100">
      <div className="relative">
        <img 
          src={house.image} 
          alt={house.address}
          className="w-full h-48 object-cover bg-gray-200"
        />
        <Badge className="absolute top-3 left-3 bg-blue-600">
          Open House
        </Badge>
      </div>
      
      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <div className="text-2xl font-bold text-blue-600 mb-1">{house.price}</div>
            <div className="flex items-start gap-1 text-gray-600">
              <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span className="text-sm">{house.address}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Home className="h-4 w-4" />
              <span>{house.beds} beds</span>
            </div>
            <div>{house.baths} baths</div>
            <div>{house.sqft} sqft</div>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(house.date)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{house.time}</span>
            </div>
          </div>
          
          <Button 
            onClick={handleRSVP}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            RSVP & Add to Calendar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OpenHouseCard;
