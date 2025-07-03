
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Wifi, WifiOff } from "lucide-react";

interface StableLoadingStateProps {
  isLoading: boolean;
  hasError: boolean;
  connectionStatus?: 'connected' | 'connecting' | 'disconnected' | 'error';
  children: React.ReactNode;
}

const StableLoadingState = ({ 
  isLoading, 
  hasError, 
  connectionStatus = 'connected',
  children 
}: StableLoadingStateProps) => {
  // Show stable skeleton during initial load or connection issues
  if (isLoading && connectionStatus === 'connecting') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header skeleton */}
          <div className="mb-8">
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          
          {/* Stats skeleton */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-xl" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-3 w-12" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Content skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Skeleton className="w-12 h-12 rounded-full" />
                      <div className="flex-1 space-y-3">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                        <div className="space-y-2">
                          <Skeleton className="h-3 w-full" />
                          <Skeleton className="h-3 w-2/3" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="space-y-6">
              <Card>
                <CardContent className="p-4 space-y-4">
                  <Skeleton className="h-6 w-32" />
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <Skeleton className="w-8 h-8 rounded" />
                        <div className="space-y-1 flex-1">
                          <Skeleton className="h-3 w-full" />
                          <Skeleton className="h-2 w-2/3" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show connection status when there are issues
  if (hasError || connectionStatus === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <WifiOff className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Connection Issues</h3>
            <p className="text-gray-600 mb-6">
              We're having trouble connecting to live updates. Your data may not be current.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Attempting to reconnect...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default StableLoadingState;
