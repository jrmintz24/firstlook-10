
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface IHomefinderDebugPanelProps {
  debugInfo: string[];
  showInProduction?: boolean;
}

export const IHomefinderDebugPanel = ({ debugInfo, showInProduction = false }: IHomefinderDebugPanelProps) => {
  if (!showInProduction && process.env.NODE_ENV !== 'development') {
    return null;
  }

  if (debugInfo.length === 0) {
    return null;
  }

  return (
    <>
      {/* Debug information for error state */}
      <Card className="mt-4">
        <CardContent className="p-4">
          <h4 className="font-semibold mb-2">Debug Information:</h4>
          <div className="text-xs space-y-1 max-h-40 overflow-y-auto">
            {debugInfo.map((info, index) => (
              <div key={index} className="text-gray-600">{info}</div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Debug panel for success state */}
      <details className="mt-4">
        <summary className="cursor-pointer text-sm text-gray-500">Debug Information</summary>
        <div className="mt-2 text-xs space-y-1 max-h-32 overflow-y-auto bg-gray-50 p-2 rounded">
          {debugInfo.map((info, index) => (
            <div key={index} className="text-gray-600">{info}</div>
          ))}
        </div>
      </details>
    </>
  );
};
