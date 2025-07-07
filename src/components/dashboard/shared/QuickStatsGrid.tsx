
import { Clock, Calendar, CheckCircle, AlertCircle, Users } from "lucide-react";
import OptimizedStatsCard from "./OptimizedStatsCard";

interface QuickStatsGridProps {
  userType: 'buyer' | 'agent';
  pendingCount: number;
  activeCount: number;
  completedCount: number;
  onStatClick?: (tab: string) => void;
}

const QuickStatsGrid = ({ 
  userType, 
  pendingCount, 
  activeCount, 
  completedCount,
  onStatClick 
}: QuickStatsGridProps) => {
  const getStatsConfig = () => {
    if (userType === 'agent') {
      return [
        {
          title: "Pending",
          value: pendingCount,
          icon: Clock,
          color: "text-orange-600",
          bgColor: "bg-orange-100",
          tabId: "pending"
        },
        {
          title: "Assigned",
          value: activeCount,
          icon: Calendar,
          color: "text-blue-600",
          bgColor: "bg-blue-100",
          tabId: "assigned"
        },
        {
          title: "History",
          value: completedCount,
          icon: CheckCircle,
          color: "text-green-600",
          bgColor: "bg-green-100",
          tabId: "completed"
        },
        {
          title: "Insights",
          value: 0,
          icon: AlertCircle,
          color: "text-purple-600",
          bgColor: "bg-purple-100",
          tabId: "insights"
        }
      ];
    } else {
      return [
        {
          title: "Requested",
          value: pendingCount,
          icon: Clock,
          color: "text-orange-600",
          bgColor: "bg-orange-100",
          tabId: "requested"
        },
        {
          title: "Confirmed",
          value: activeCount,
          icon: CheckCircle,
          color: "text-green-600",
          bgColor: "bg-green-100",
          tabId: "confirmed"
        },
        {
          title: "History",
          value: completedCount,
          icon: Calendar,
          color: "text-blue-600",
          bgColor: "bg-blue-100",
          tabId: "history"
        },
        {
          title: "Activity",
          value: 0,
          icon: Users,
          color: "text-purple-600",
          bgColor: "bg-purple-100",
          tabId: "activity"
        }
      ];
    }
  };

  const stats = getStatsConfig();

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => (
        <OptimizedStatsCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          color={stat.color}
          bgColor={stat.bgColor}
          onClick={onStatClick ? () => onStatClick(stat.tabId) : undefined}
        />
      ))}
    </div>
  );
};

export default QuickStatsGrid;
