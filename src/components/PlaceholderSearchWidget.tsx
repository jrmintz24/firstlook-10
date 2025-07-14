
import React from 'react';
import { Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PlaceholderSearchWidgetProps {
  className?: string;
}

const PlaceholderSearchWidget = ({ className = "" }: PlaceholderSearchWidgetProps) => {
  return (
    <div className={`w-full max-w-2xl mx-auto ${className}`}>
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Enter city, address, or ZIP code"
              className="pl-10 h-12 text-base"
              disabled
            />
          </div>
          <Button 
            size="lg" 
            className="bg-gray-900 hover:bg-black text-white px-8 h-12 text-base font-medium shadow-lg rounded-lg"
            disabled
          >
            Search Properties
          </Button>
        </div>
        <p className="text-sm text-gray-500 mt-3 text-center">
          Property search functionality coming soon
        </p>
      </div>
    </div>
  );
};

export default PlaceholderSearchWidget;
