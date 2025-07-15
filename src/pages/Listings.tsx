
import React, { useEffect, useRef, useState } from 'react';
import { useDocumentHead } from '../hooks/useDocumentHead';
import { LoadingSpinner } from '../components/dashboard/shared/LoadingStates';
import { ListingsPageSkeleton } from '../components/listings/ListingsPageSkeleton';
import { Search, MapPin, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Listings = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Set document head with static title as specified
  useDocumentHead({
    title: 'Property Search',
    description: 'Search and browse available properties with advanced filtering options and detailed listings.',
  });

  useEffect(() => {
    console.log('[Listings] Starting IDX load process');

    const loadIDX = async () => {
      try {
        // Ensure the IDX script is loaded
        if (window.ihfKestrel && containerRef.current) {
          console.log('[Listings] IDX Kestrel found, rendering...');
          
          // Clear any existing content
          containerRef.current.innerHTML = '';
          
          // Create and execute the embed script using the working pattern from Idx.tsx
          const renderedElement = window.ihfKestrel.render();
          if (renderedElement) {
            containerRef.current.appendChild(renderedElement);
            console.log('[Listings] IDX content successfully rendered');
          } else {
            console.error('[Listings] IDX render returned null/undefined');
            setHasError(true);
          }
          
          // Set loading to false after content renders
          setTimeout(() => {
            console.log('[Listings] IDX load complete');
            setIsLoading(false);
          }, 1000);
          
        } else {
          console.log('[Listings] IDX Kestrel not available, showing error');
          // If IDX is not available, show error after a delay
          setTimeout(() => {
            setIsLoading(false);
            setHasError(true);
          }, 2000);
        }
      } catch (error) {
        console.error('[Listings] Error loading IDX content:', error);
        setIsLoading(false);
        setHasError(true);
      }
    };

    loadIDX();
  }, []);

  if (hasError) {
    return (
      <div className="min-h-screen bg-background pt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto text-center space-y-6">
            <div className="w-16 h-16 mx-auto bg-destructive/10 rounded-full flex items-center justify-center">
              <Search className="w-8 h-8 text-destructive" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground">Unable to Load Property Search</h2>
              <p className="text-muted-foreground">
                We're having trouble connecting to the property database. Please try again.
              </p>
            </div>
            <Button 
              onClick={() => window.location.reload()}
              className="w-full sm:w-auto"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-16">
      {/* Page Header */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Search className="w-4 h-4 text-primary" />
            </div>
            <h1 className="text-2xl font-semibold text-foreground">Property Search</h1>
          </div>
          <p className="text-muted-foreground flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Search and browse available properties with live MLS data
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 py-8">
        {isLoading && (
          <div className="space-y-8">
            {/* Quick loading message */}
            <div className="text-center py-8">
              <LoadingSpinner size="lg" text="Loading property search..." />
            </div>
            
            {/* Skeleton placeholder */}
            <ListingsPageSkeleton />
          </div>
        )}
        
        {/* IDX Content Container */}
        <div 
          ref={containerRef} 
          className={`
            ${isLoading ? 'opacity-0 absolute -z-10' : 'opacity-100'} 
            transition-opacity duration-500
            bg-card rounded-lg border border-border overflow-hidden
            shadow-sm
          `}
        />
      </div>
    </div>
  );
};

export default Listings;
