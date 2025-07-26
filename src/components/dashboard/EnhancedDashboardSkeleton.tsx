import { cn } from "@/lib/utils";

const EnhancedDashboardSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-white">
      {/* Header Skeleton */}
      <div className="bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-6">
              <div className="space-y-2">
                <div className="h-7 w-48 bg-gray-200 rounded-lg animate-pulse" />
                <div className="h-4 w-64 bg-gray-100 rounded animate-pulse hidden sm:block" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse" />
              <div className="h-8 w-20 bg-gray-100 rounded-full animate-pulse" />
              <div className="h-10 w-32 bg-gray-100 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className={cn(
                "bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-6",
                "animate-pulse shadow-sm"
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-xl" />
                  <div className="h-4 w-24 bg-gray-200 rounded" />
                </div>
              </div>
              <div className="h-8 w-16 bg-gray-300 rounded" />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Main Content Skeleton */}
          <div className="lg:col-span-3">
            {/* Tabs Skeleton */}
            <div className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-xl p-1.5 mb-6">
              <div className="grid grid-cols-6 gap-1">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <div
                    key={index}
                    className="h-10 bg-gray-100 rounded-lg animate-pulse"
                    style={{ animationDelay: `${index * 50}ms` }}
                  />
                ))}
              </div>
            </div>

            {/* Content Cards Skeleton */}
            <div className="space-y-4">
              {[0, 1, 2].map((index) => (
                <div
                  key={index}
                  className={cn(
                    "bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-6",
                    "animate-pulse shadow-sm"
                  )}
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="space-y-2 flex-1">
                      <div className="h-5 w-3/4 bg-gray-200 rounded" />
                      <div className="h-4 w-1/2 bg-gray-100 rounded" />
                    </div>
                    <div className="h-6 w-20 bg-gray-200 rounded-full" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 w-full bg-gray-100 rounded" />
                    <div className="h-3 w-5/6 bg-gray-100 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar Skeleton */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {[0, 1].map((index) => (
                <div
                  key={index}
                  className={cn(
                    "bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6",
                    "animate-pulse shadow-sm"
                  )}
                  style={{ animationDelay: `${300 + index * 100}ms` }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-gray-200 rounded-lg" />
                    <div className="h-5 w-32 bg-gray-200 rounded" />
                  </div>
                  <div className="space-y-3">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="p-3 bg-gray-50 rounded-xl">
                        <div className="h-4 w-full bg-gray-200 rounded mb-2" />
                        <div className="h-3 w-2/3 bg-gray-100 rounded" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedDashboardSkeleton;