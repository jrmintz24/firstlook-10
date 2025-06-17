
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface Stat {
  title: string;
  value: string | number;
  change?: {
    value: string;
    trend: 'up' | 'down' | 'neutral';
  };
  icon?: LucideIcon;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
}

interface ModernStatsGridProps {
  stats: Stat[];
  onStatClick?: (index: number) => void;
}

const ModernStatsGrid = ({ stats, onStatClick }: ModernStatsGridProps) => {
  const getColorClasses = (color: string = 'blue') => {
    const colors = {
      blue: 'text-blue-600 bg-blue-50',
      green: 'text-green-600 bg-green-50',
      purple: 'text-purple-600 bg-purple-50',
      orange: 'text-orange-600 bg-orange-50',
      red: 'text-red-600 bg-red-50'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
    if (trend === 'up') return <TrendingUp className="w-3 h-3 text-green-500" />;
    if (trend === 'down') return <TrendingDown className="w-3 h-3 text-red-500" />;
    return null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card 
          key={index} 
          className={`bg-white border-0 shadow-sm hover:shadow-md transition-shadow duration-200 ${
            onStatClick ? 'cursor-pointer' : ''
          }`}
          onClick={() => onStatClick?.(index)}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-2">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </p>
                {stat.change && (
                  <div className="flex items-center gap-1">
                    {getTrendIcon(stat.change.trend)}
                    <span className={`text-xs font-medium ${
                      stat.change.trend === 'up' ? 'text-green-600' : 
                      stat.change.trend === 'down' ? 'text-red-600' : 
                      'text-gray-500'
                    }`}>
                      {stat.change.value}
                    </span>
                  </div>
                )}
              </div>
              {stat.icon && (
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses(stat.color)}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ModernStatsGrid;
