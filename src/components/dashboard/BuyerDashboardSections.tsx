
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, CheckCircle } from "lucide-react";

interface BuyerDashboardSectionsProps {
  pendingCount: number;
  upcomingCount: number;
  completedCount: number;
  onSectionClick: (section: string) => void;
}

const BuyerDashboardSections = ({
  pendingCount,
  upcomingCount,
  completedCount,
  onSectionClick
}: BuyerDashboardSectionsProps) => {
  const sections = [
    {
      id: "pending",
      title: "Pending Tours",
      count: pendingCount,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      description: "Tours awaiting confirmation"
    },
    {
      id: "upcoming",
      title: "Upcoming Tours",
      count: upcomingCount,
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      description: "Confirmed tours scheduled"
    },
    {
      id: "completed",
      title: "Completed Tours", 
      count: completedCount,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
      description: "Tours you've finished"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {sections.map((section) => {
        const Icon = section.icon;
        return (
          <Card 
            key={section.id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => onSectionClick(section.id)}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {section.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${section.bgColor}`}>
                <Icon className={`h-4 w-4 ${section.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{section.count}</div>
                {section.count > 0 && (
                  <Badge variant="secondary">{section.count}</Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {section.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default BuyerDashboardSections;
