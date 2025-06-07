
import { Card, CardContent } from "@/components/ui/card";

interface QuickStatsGridProps {
  pendingCount: number;
  activeCount: number;
  completedCount: number;
}

const QuickStatsGrid = ({ pendingCount, activeCount, completedCount }: QuickStatsGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 border-0 shadow-lg">
        <CardContent className="p-6 text-center">
          <div className="text-3xl font-bold text-orange-600 mb-2">{pendingCount}</div>
          <div className="text-gray-600">Pending Requests</div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-0 shadow-lg">
        <CardContent className="p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">{activeCount}</div>
          <div className="text-gray-600">Confirmed Showings</div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-lg">
        <CardContent className="p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">{completedCount}</div>
          <div className="text-gray-600">Completed</div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-0 shadow-lg">
        <CardContent className="p-6 text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">1</div>
          <div className="text-gray-600">Free Shows Left</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickStatsGrid;
