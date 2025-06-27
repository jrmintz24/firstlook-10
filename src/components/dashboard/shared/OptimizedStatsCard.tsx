
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface OptimizedStatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  onClick?: () => void;
  subtitle?: string;
}

const OptimizedStatsCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  bgColor, 
  onClick,
  subtitle 
}: OptimizedStatsCardProps) => {
  return (
    <Card 
      className={`shadow-sm border-gray-200/60 hover:shadow-md transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:border-gray-300' : ''
      }`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 ${bgColor} rounded-xl flex items-center justify-center`}>
              <Icon className={`h-5 w-5 ${color}`} />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-700">{title}</div>
              {subtitle && (
                <div className="text-xs text-gray-500">{subtitle}</div>
              )}
            </div>
          </div>
          <div className={`text-2xl font-bold ${color}`}>{value}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OptimizedStatsCard;
