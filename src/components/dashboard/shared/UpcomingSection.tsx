
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin } from "lucide-react";

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
    <Card className="shadow-sm border-gray-200/60">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-600" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {displayShowings.length > 0 ? (
          <div className="space-y-3">
            {displayShowings.map((showing) => (
              <div key={showing.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 mb-1 truncate">
                      <MapPin className="h-3 w-3 inline mr-1" />
                      {showing.property_address}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      {showing.preferred_date && (
                        <span>
                          {new Date(showing.preferred_date).toLocaleDateString()}
                        </span>
                      )}
                      {showing.preferred_time && (
                        <span>{showing.preferred_time}</span>
                      )}
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs shrink-0">
                    {showing.status}
                  </Badge>
                </div>
              </div>
            ))}
            {showings.length > maxItems && onViewAll && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full text-blue-600 hover:bg-blue-50"
                onClick={onViewAll}
              >
                View All ({showings.length})
              </Button>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-500 text-center py-4">
            No upcoming showings
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingSection;
