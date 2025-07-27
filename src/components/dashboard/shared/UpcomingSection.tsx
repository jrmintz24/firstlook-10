
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock, ArrowRight } from "lucide-react";
import AnimatedNumber from "@/components/ui/AnimatedNumber";
import MagneticButton from "@/components/ui/MagneticButton";
import { cn } from "@/lib/utils";

interface ShowingRequest {
  id: string;
  property_address: string;
  preferred_date: string | null;
  preferred_time: string | null;
  status: string;
  created_at: string;
}

interface UpcomingSectionProps {
  title: string;
  showings: ShowingRequest[];
  onViewAll?: () => void;
  maxItems?: number;
}

const UpcomingSection = ({ 
  title, 
  showings, 
  onViewAll, 
  maxItems = 3 
}: UpcomingSectionProps) => {
  const displayShowings = showings.slice(0, maxItems);

  return (
    <Card className="shadow-sm border-gray-200/60 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center shadow-md">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent font-semibold">
              {title}
            </span>
          </div>
          {showings.length > 0 && (
            <AnimatedNumber
              value={showings.length}
              className="text-base text-gray-600 font-medium"
              duration={800}
            />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {displayShowings.length > 0 ? (
          <div className="space-y-4">
            {displayShowings.map((showing) => (
              <div 
                key={showing.id} 
                className={cn(
                  "group p-4 rounded-xl border transition-all duration-300",
                  "bg-gradient-to-br from-gray-50/50 to-white/50 backdrop-blur-sm",
                  "border-gray-200/60 hover:border-blue-200/60",
                  "hover:shadow-md hover:scale-[1.02] cursor-pointer"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="text-base font-medium text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gradient-to-br from-red-400 to-pink-400 rounded-full flex items-center justify-center shrink-0">
                          <MapPin className="h-4 w-4 text-white" />
                        </div>
                        <span className="truncate">{showing.property_address}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      {showing.preferred_date && (
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4" />
                          {new Date(showing.preferred_date).toLocaleDateString()}
                        </span>
                      )}
                      {showing.preferred_time && (
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4" />
                          {showing.preferred_time}
                        </span>
                      )}
                    </div>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "text-sm px-3 py-1 shrink-0 transition-all duration-300 font-medium",
                      "group-hover:scale-105",
                      showing.status === 'confirmed' && "border-green-200 bg-green-50 text-green-700",
                      showing.status === 'pending' && "border-orange-200 bg-orange-50 text-orange-700"
                    )}
                  >
                    {showing.status}
                  </Badge>
                </div>
              </div>
            ))}
            {showings.length > maxItems && onViewAll && (
              <MagneticButton
                variant="ghost" 
                size="default" 
                className="w-full text-blue-600 hover:bg-blue-50 group mt-4 py-3"
                onClick={onViewAll}
                magneticStrength={0.1}
              >
                <span className="text-base">View All ({showings.length})</span>
                <ArrowRight className="h-5 w-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </MagneticButton>
            )}
          </div>
        ) : (
          <p className="text-base text-gray-500 text-center py-6">
            No upcoming showings
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingSection;
