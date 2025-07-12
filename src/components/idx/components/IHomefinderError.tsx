
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface IHomefinderErrorProps {
  error: string;
  onRetry: () => void;
  className?: string;
}

export const IHomefinderError = ({ error, onRetry, className = '' }: IHomefinderErrorProps) => {
  return (
    <div className={className}>
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-2">
            <p><strong>iHomeFinder Widget Error:</strong></p>
            <p>{error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRetry}
              className="mt-2"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry Loading
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};
