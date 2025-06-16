
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon, TrendingUp, AlertCircle } from "lucide-react";

interface FocusedStat {
  value: number | string;
  label: string;
  icon: LucideIcon;
  iconColor: string;
  status?: 'urgent' | 'normal' | 'success';
  actionable?: boolean;
  subtitle?: string;
}

interface FocusedStatsGridProps {
  stats: FocusedStat[];
  onStatClick?: (statIndex: number) => void;
}

const FocusedStatsGrid = ({ stats, onStatClick }: FocusedStatsGridProps) => {
  const getStatusIndicator = (status?: string) => {
    switch (status) {
      case 'urgent':
        return <AlertCircle className="h-3 w-3 text-red-500" />;
      case 'success':
        return <TrendingUp className="h-3 w-3 text-green-500" />;
      default:
        return null;
    }
  };

  const getCardStyle = (status?: string, actionable?: boolean) => {
    const baseStyle = "group transition-all duration-300 border border-gray-100/50 bg-white/70 backdrop-blur-sm";
    
    if (actionable) {
      return `${baseStyle} cursor-pointer hover:shadow-lg hover:scale-105 hover:bg-white/90`;
    }
    
    switch (status) {
      case 'urgent':
        return `${baseStyle} border-orange-200 bg-orange-50/50`;
      case 'success':
        return `${baseStyle} border-green-200 bg-green-50/50`;
      default:
        return baseStyle;
    }
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {stats.map((stat, index) => (
        <Card 
          key={index} 
          className={getCardStyle(stat.status, stat.actionable)}
          onClick={() => stat.actionable && onStatClick && onStatClick(index)}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-lg bg-gray-50/80">
                <stat.icon className={`h-4 w-4 ${stat.iconColor}`} />
              </div>
              {stat.status && (
                <div className="flex items-center">
                  {getStatusIndicator(stat.status)}
                </div>
              )}
            </div>
            
            <div className="space-y-1">
              <div className="text-xl font-semibold text-gray-900">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">
                {stat.label}
              </div>
              {stat.subtitle && (
                <div className="text-xs text-gray-500">
                  {stat.subtitle}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FocusedStatsGrid;
