
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatTile {
  value: number | string;
  label: string;
  icon: LucideIcon;
  iconColor: string;
  subtitle?: string;
  trend?: {
    value: string;
    direction: 'up' | 'down' | 'neutral';
  };
}

interface QuickStatsGridProps {
  stats: StatTile[];
}

const QuickStatsGrid = ({ stats }: QuickStatsGridProps) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card 
          key={index} 
          className="group bg-white/80 backdrop-blur-sm border border-gray-100/80 shadow-sm hover:shadow-lg hover:bg-white/90 transition-all duration-500 ease-out transform hover:-translate-y-1"
        >
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="p-2 sm:p-3 rounded-2xl bg-gray-50/80 group-hover:bg-gray-100/80 transition-colors duration-300">
                <stat.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.iconColor} transition-transform duration-300 group-hover:scale-110`} />
              </div>
              
              <div className="space-y-1">
                <div className="text-2xl sm:text-3xl font-light text-gray-900 transition-colors duration-300">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm font-medium text-gray-600">
                  {stat.label}
                </div>
                {stat.subtitle && (
                  <div className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {stat.subtitle}
                  </div>
                )}
              </div>

              {stat.trend && (
                <div className={`text-xs px-2 py-1 rounded-full ${
                  stat.trend.direction === 'up' ? 'bg-green-50 text-green-600' :
                  stat.trend.direction === 'down' ? 'bg-red-50 text-red-600' :
                  'bg-gray-50 text-gray-600'
                } opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                  {stat.trend.value}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default QuickStatsGrid;
