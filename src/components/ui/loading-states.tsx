
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const LoadingSpinner = ({ size = "md", className }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8"
  };

  return (
    <Loader2 className={cn("animate-spin", sizeClasses[size], className)} />
  );
};

interface LoadingStateProps {
  message?: string;
  size?: "sm" | "md" | "lg";
}

export const LoadingState = ({ message = "Loading...", size = "md" }: LoadingStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <LoadingSpinner size={size} />
      <p className="text-sm text-gray-600">{message}</p>
    </div>
  );
};

export const FullPageLoading = ({ message = "Loading..." }: { message?: string }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" className="mb-4" />
        <div className="text-lg font-medium text-gray-700 mb-2">{message}</div>
        <div className="text-sm text-gray-500">Please wait while we load your content</div>
      </div>
    </div>
  );
};

interface SkeletonProps {
  className?: string;
}

export const Skeleton = ({ className }: SkeletonProps) => {
  return (
    <div className={cn("animate-pulse rounded-md bg-gray-200", className)} />
  );
};

export const CardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg border p-6 space-y-4">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-10 w-full" />
    </div>
  );
};
