
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface EnhancedStat {
  value: number | string;
  label: string;
  icon: LucideIcon;
  iconColor: string;
  subtitle?: string;
  trend?: {
    value: string;
    direction: 'up' | 'down' | 'neutral';
    description?: string;
  };
  progress?: {
    current: number;
    max: number;
    color: string;
  };
  actionable?: boolean;
}

interface EnhancedStatsGridProps {
  stats: EnhancedStat[];
  onStatClick?: (statIndex: number) => void;
}

const EnhancedStatsGrid = ({ stats, onStatClick }: EnhancedStatsGridProps) => {
  const getTrendIcon = (direction: 'up' | 'down' | 'neutral') => {
    switch (direction) {
      case 'up':
        return <TrendingUp className="h-3 w-3" />;
      case 'down':
        return <TrendingDown className="h-3 w-3" />;
      default:
        return <Minus className="h-3 w-3" />;
    }
  };

  const getTrendColor = (direction: 'up' | 'down' | 'neutral') => {
    switch (direction) {
      case 'up':
        return 'text-green-600 bg-green-50';
      case 'down':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <Card 
          key={index} 
          className={`group bg-white/90 backdrop-blur-sm border border-gray-100/80 shadow-sm hover:shadow-md transition-all duration-300 ${
            stat.actionable || onStatClick ? 'cursor-pointer hover:-translate-y-1' : ''
          }`}
          onClick={() => onStatClick && onStatClick(index)}
        >
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col space-y-3">
              {/* Header with icon and trend */}
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-xl bg-gray-50/80 group-hover:bg-gray-100/80 transition-colors">
                  <stat.icon className={`h-5 w-5 ${stat.iconColor} transition-transform group-hover:scale-110`} />
                </div>
                {stat.trend && (
                  <Badge className={`text-xs px-2 py-1 ${getTrendColor(stat.trend.direction)}`}>
                    <div className="flex items-center gap-1">
                      {getTrendIcon(stat.trend.direction)}
                      <span>{stat.trend.value}</span>
                    </div>
                  </Badge>
                )}
              </div>

              {/* Main value */}
              <div className="space-y-1">
                <div className="text-2xl sm:text-3xl font-light text-gray-900 transition-colors">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-gray-600">
                  {stat.label}
                </div>
              </div>

              {/* Progress bar if present */}
              {stat.progress && (
                <div className="space-y-1">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${stat.progress.color}`}
                      style={{ width: `${(stat.progress.current / stat.progress.max) * 100}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500">
                    {stat.progress.current} of {stat.progress.max}
                  </div>
                </div>
              )}

              {/* Subtitle and trend description */}
              <div className="space-y-1">
                {stat.subtitle && (
                  <div className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    {stat.subtitle}
                  </div>
                )}
                {stat.trend?.description && (
                  <div className="text-xs text-gray-400">
                    {stat.trend.description}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default EnhancedStatsGrid;
