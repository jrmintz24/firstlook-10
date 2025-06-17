
import { Card } from "@/components/ui/card";
import { Clock, CheckCircle, TrendingUp, Home } from "lucide-react";

interface DashboardStatsProps {
  pendingCount: number;
  activeCount: number;
  completedCount: number;
  totalCount: number;
}

const DashboardStats = ({ pendingCount, activeCount, completedCount, totalCount }: DashboardStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
            <Clock className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <div className="text-2xl font-bold">{pendingCount}</div>
            <div className="text-sm text-gray-600">Pending Tours</div>
          </div>
        </div>
      </Card>
      
      <Card className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <div className="text-2xl font-bold">{activeCount}</div>
            <div className="text-sm text-gray-600">Confirmed Tours</div>
          </div>
        </div>
      </Card>
      
      <Card className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <div className="text-2xl font-bold">{completedCount}</div>
            <div className="text-sm text-gray-600">Completed Tours</div>
          </div>
        </div>
      </Card>
      
      <Card className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <Home className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <div className="text-2xl font-bold">{totalCount}</div>
            <div className="text-sm text-gray-600">Total Properties</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DashboardStats;
