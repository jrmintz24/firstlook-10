
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface ListingPageLayoutProps {
  children: React.ReactNode;
  showMlsCompliance?: boolean;
}

const ListingPageLayout = ({ children, showMlsCompliance = true }: ListingPageLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* IDX Info Alert */}
        <Alert className="mb-6 bg-blue-50 border-blue-200">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Live MLS Data:</strong> Browse real estate listings directly from the MLS. 
            All properties are current and updated in real-time.
          </AlertDescription>
        </Alert>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border">
          {children}
        </div>

        {/* MLS Compliance Footer */}
        {showMlsCompliance && (
          <div className="mt-8 text-center text-sm text-gray-600">
            <p>
              The data relating to real estate for sale on this website comes in part from the MLS. 
              All information deemed reliable but not guaranteed and should be independently verified.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListingPageLayout;
