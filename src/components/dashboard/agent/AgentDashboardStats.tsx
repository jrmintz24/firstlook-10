
import { Card, CardContent } from "@/components/ui/card";

interface AgentDashboardStatsProps {
  unassignedCount: number;
  myRequestsCount: number;
  activeShowingsCount: number;
  completedCount: number;
}

const AgentDashboardStats = ({ 
  unassignedCount, 
  myRequestsCount, 
  activeShowingsCount, 
  completedCount 
}: AgentDashboardStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 border-0 shadow-lg">
        <CardContent className="p-6 text-center">
          <div className="text-3xl font-bold text-orange-600 mb-2">{unassignedCount}</div>
          <div className="text-gray-600">Unassigned Requests</div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-0 shadow-lg">
        <CardContent className="p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">{myRequestsCount}</div>
          <div className="text-gray-600">My Requests</div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-lg">
        <CardContent className="p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">{activeShowingsCount}</div>
          <div className="text-gray-600">Active Showings</div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-0 shadow-lg">
        <CardContent className="p-6 text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">{completedCount}</div>
          <div className="text-gray-600">Completed</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentDashboardStats;
