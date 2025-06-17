
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, MessageCircle, CheckCircle, Clock } from "lucide-react";

interface DashboardStatsProps {
  pendingCount: number;
  activeCount: number;
  completedCount: number;
  unreadCount: number;
}

const DashboardStats = ({ 
  pendingCount, 
  activeCount, 
  completedCount, 
  unreadCount 
}: DashboardStatsProps) => {
  const stats = [
    {
      title: "Pending Requests",
      value: pendingCount,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    },
    {
      title: "Active Showings",
      value: activeCount,
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Completed Tours",
      value: completedCount,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Unread Messages",
      value: unreadCount,
      icon: MessageCircle,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.title}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;
