
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, TrendingUp } from "lucide-react";

interface ShowingActionsSummaryProps {
  completedShowings: any[];
  actionsSummary: {
    totalActions: number;
    favoritedProperties: number;
    agentConnections: number;
    offerIntents: number;
  };
}

const ShowingActionsSummary = ({ completedShowings, actionsSummary }: ShowingActionsSummaryProps) => {
  const recentCompletedCount = completedShowings.filter(
    showing => new Date(showing.status_updated_at || showing.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ).length;

  return (
    <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-blue-900">
          <TrendingUp className="h-5 w-5" />
          Tour Activity Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-900">{completedShowings.length}</div>
            <div className="text-sm text-blue-600">Completed Tours</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-900">{actionsSummary.totalActions}</div>
            <div className="text-sm text-green-600">Total Actions</div>
          </div>
        </div>

        {recentCompletedCount > 0 && (
          <div className="p-3 bg-white rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Recent Activity</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {actionsSummary.favoritedProperties > 0 && (
                <Badge variant="outline" className="border-red-200 text-red-700">
                  {actionsSummary.favoritedProperties} Favorited
                </Badge>
              )}
              {actionsSummary.agentConnections > 0 && (
                <Badge variant="outline" className="border-purple-200 text-purple-700">
                  {actionsSummary.agentConnections} Agent Connections
                </Badge>
              )}
              {actionsSummary.offerIntents > 0 && (
                <Badge variant="outline" className="border-green-200 text-green-700">
                  {actionsSummary.offerIntents} Offer Intents
                </Badge>
              )}
            </div>
          </div>
        )}

        {actionsSummary.totalActions === 0 && completedShowings.length > 0 && (
          <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-sm text-yellow-800">
              💡 Take action on your completed tours to get the most out of your home search!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ShowingActionsSummary;
