
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatTile {
  value: number | string;
  label: string;
  icon: LucideIcon;
  gradient: string;
  textColor: string;
}

interface QuickStatsGridProps {
  stats: StatTile[];
}

const QuickStatsGrid = ({ stats }: QuickStatsGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className={`${stat.gradient} border-0 shadow-lg`}>
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center mb-3">
              <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
            </div>
            <div className={`text-3xl font-bold ${stat.textColor} mb-2`}>
              {stat.value}
            </div>
            <div className="text-gray-600">{stat.label}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default QuickStatsGrid;
