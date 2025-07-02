
import { Card, CardContent } from "@/components/ui/card";

interface StatTile {
  title: string;
  value: number | string;
  targetTab?: string;
}

interface ModernStatsGridProps {
  stats: StatTile[];
  onStatClick?: (tab: string) => void;
}

const ModernStatsGrid = ({ stats, onStatClick }: ModernStatsGridProps) => {
  const handleStatClick = (targetTab: string) => {
    if (onStatClick && targetTab) {
      onStatClick(targetTab);
    }
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <Card 
          key={index}
          className={`hover:shadow-md transition-all duration-200 ${
            stat.targetTab && onStatClick ? 'cursor-pointer hover:scale-105' : ''
          }`}
          onClick={() => stat.targetTab && handleStatClick(stat.targetTab)}
        >
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-gray-600">
              {stat.title}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ModernStatsGrid;
