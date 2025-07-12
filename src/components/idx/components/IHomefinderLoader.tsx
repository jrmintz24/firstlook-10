
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface IHomefinderLoaderProps {
  isInitializing: boolean;
  scriptLoadAttempts: number;
  className?: string;
}

export const IHomefinderLoader = ({ isInitializing, scriptLoadAttempts, className = '' }: IHomefinderLoaderProps) => {
  return (
    <div className={className}>
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading iHomeFinder Property Search...</p>
            <p className="text-sm text-gray-500 mt-2">
              {isInitializing ? 'Initializing widget...' : 'Connecting to MLS data...'}
            </p>
            {scriptLoadAttempts > 0 && (
              <p className="text-xs text-gray-400 mt-1">Attempt {scriptLoadAttempts + 1}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
