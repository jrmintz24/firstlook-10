
import React, { useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface IDXEmbedWidgetProps {
  className?: string;
}

const IDXEmbedWidget = ({ className = '' }: IDXEmbedWidgetProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptExecutedRef = useRef(false);

  useEffect(() => {
    // Only execute once and when the container is available
    if (scriptExecutedRef.current || !containerRef.current || !window.ihfKestrel) {
      return;
    }

    try {
      // Create and execute the embed script
      const script = document.createElement('script');
      script.innerHTML = 'document.currentScript.replaceWith(ihfKestrel.render());';
      
      // Append to container and execute
      containerRef.current.appendChild(script);
      scriptExecutedRef.current = true;
      
    } catch (error) {
      console.error('Failed to render IDX embed widget:', error);
    }
  }, []);

  // Show loading state while iHomeFinder loads
  if (!window.ihfKestrel) {
    return (
      <div className={className}>
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading IDX Property Search...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`idx-embed-widget ${className}`}>
      <div ref={containerRef} className="min-h-[500px] w-full" />
    </div>
  );
};

export default IDXEmbedWidget;
