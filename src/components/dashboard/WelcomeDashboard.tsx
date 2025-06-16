
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Star, TrendingUp, Clock, Home, ArrowRight } from "lucide-react";

interface WelcomeDashboardProps {
  userType: 'buyer' | 'agent';
  displayName: string;
  onRequestShowing?: () => void;
  hasActiveShowings?: boolean;
  completedCount?: number;
  pendingCount?: number;
}

const WelcomeDashboard = ({ 
  userType, 
  displayName, 
  onRequestShowing, 
  hasActiveShowings = false,
  completedCount = 0,
  pendingCount = 0
}: WelcomeDashboardProps) => {
  const isBuyer = userType === 'buyer';

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800">
            Welcome back, {displayName}! 👋
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 mb-4">
                {isBuyer 
                  ? hasActiveShowings 
                    ? "Your home tours are ready! Check your active tours below."
                    : "Ready to find your dream home? Start with a free showing."
                  : "Manage your showing requests and help buyers find their perfect home."
                }
              </p>
              {isBuyer && !hasActiveShowings && onRequestShowing && (
                <Button 
                  onClick={onRequestShowing}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Book Your Free Tour
                </Button>
              )}
            </div>
            <div className="hidden md:block">
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-600">
                  {isBuyer ? pendingCount + (hasActiveShowings ? 1 : 0) : pendingCount}
                </div>
                <div className="text-sm text-gray-500">
                  {isBuyer ? 'Active Tours' : 'Pending Requests'}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium text-gray-700 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              {isBuyer ? 'Your Journey' : 'Your Impact'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {isBuyer ? 'Properties viewed' : 'Tours completed'}
                </span>
                <span className="font-semibold text-gray-800">{completedCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {isBuyer ? 'Active tours' : 'Active requests'}
                </span>
                <span className="font-semibold text-gray-800">
                  {isBuyer ? (hasActiveShowings ? 1 : 0) : pendingCount}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium text-gray-700 flex items-center gap-2">
              <Clock className="h-4 w-4 text-green-500" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {isBuyer ? (
                <>
                  <Button variant="ghost" size="sm" className="w-full justify-start h-8 text-left">
                    <Calendar className="h-3 w-3 mr-2" />
                    View upcoming tours
                    <ArrowRight className="h-3 w-3 ml-auto" />
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start h-8 text-left">
                    <Star className="h-3 w-3 mr-2" />
                    Browse tour history
                    <ArrowRight className="h-3 w-3 ml-auto" />
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" size="sm" className="w-full justify-start h-8 text-left">
                    <Calendar className="h-3 w-3 mr-2" />
                    Check available requests
                    <ArrowRight className="h-3 w-3 ml-auto" />
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start h-8 text-left">
                    <TrendingUp className="h-3 w-3 mr-2" />
                    View tour history
                    <ArrowRight className="h-3 w-3 ml-auto" />
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WelcomeDashboard;
