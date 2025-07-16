import React, { useState } from 'react';
import { Calendar, Heart, MessageSquare } from 'lucide-react';
import { Button } from '../ui/button';
import PropertyRequestWizard from '../PropertyRequestWizard';
import { useIDXPropertyExtractor } from '../../hooks/useIDXPropertyExtractor';
import { PropertyEntry } from '../../types/propertyRequest';

interface PropertyToolbarProps {
  className?: string;
}

export const PropertyToolbar: React.FC<PropertyToolbarProps> = ({ className = '' }) => {
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const { propertyData, isLoading } = useIDXPropertyExtractor();

  const handleScheduleTour = () => {
    setIsScheduleOpen(true);
  };

  const handleScheduleSuccess = async () => {
    setIsScheduleOpen(false);
    // Could add toast notification here
  };

  if (isLoading) {
    return null; // Don't show toolbar while loading
  }

  return (
    <>
      <div className={`fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border shadow-lg ${className}`}>
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Property Info */}
            {propertyData && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {propertyData.address}
                </p>
                {propertyData.price && (
                  <p className="text-sm text-muted-foreground">
                    {propertyData.price}
                    {propertyData.beds && propertyData.baths && (
                      <span className="ml-2">
                        {propertyData.beds} bed • {propertyData.baths} bath
                      </span>
                    )}
                  </p>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="hidden sm:flex"
              >
                <Heart className="h-4 w-4 mr-2" />
                Save
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="hidden sm:flex"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Contact
              </Button>
              
              <Button
                onClick={handleScheduleTour}
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Tour
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Property Request Wizard */}
      <PropertyRequestWizard
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        onSuccess={handleScheduleSuccess}
      />
    </>
  );
};