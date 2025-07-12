
import React from 'react';
import { Property } from '@/types/simplyrets';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { useIHomefinderWidget } from './hooks/useIHomefinderWidget';
import { IHomefinderError } from './components/IHomefinderError';
import { IHomefinderLoader } from './components/IHomefinderLoader';
import { IHomefinderDebugPanel } from './components/IHomefinderDebugPanel';

interface IHomefinderWidgetProps {
  onPropertySelect?: (property: Property) => void;
  className?: string;
}

const IHomefinderWidget = ({ onPropertySelect, className = '' }: IHomefinderWidgetProps) => {
  const { containerRef, state, retryInitialization } = useIHomefinderWidget(onPropertySelect);

  if (state.error) {
    return (
      <div className={className}>
        <IHomefinderError 
          error={state.error} 
          onRetry={retryInitialization} 
        />
        <IHomefinderDebugPanel debugInfo={state.debugInfo} />
      </div>
    );
  }

  if (!state.isLoaded) {
    return (
      <IHomefinderLoader 
        isInitializing={state.isInitializing}
        scriptLoadAttempts={state.scriptLoadAttempts}
        className={className}
      />
    );
  }

  return (
    <div className={className}>
      <div className="space-y-4">
        <Alert className="bg-blue-50 border-blue-200">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Live MLS Data:</strong> You're now viewing real property listings via iHomeFinder. 
            Select any property to add it to your tour request.
          </AlertDescription>
        </Alert>
        
        <div ref={containerRef} className="min-h-[400px] bg-white rounded-lg border" />
        
        <IHomefinderDebugPanel debugInfo={state.debugInfo} />
      </div>
    </div>
  );
};

export default IHomefinderWidget;
