
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from 'react-router-dom';

interface PlaceholderSearchWidgetProps {
  className?: string;
}

const PlaceholderSearchWidget = ({ className = "" }: PlaceholderSearchWidgetProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    setIsSearching(true);
    
    // Navigate to listings page with search parameter
    const searchParams = searchTerm.trim() ? `?search=${encodeURIComponent(searchTerm.trim())}` : '';
    navigate(`/listings${searchParams}`);
    
    // Reset loading state after a brief delay
    setTimeout(() => setIsSearching(false), 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
          <Button 
            size="lg" 
            className="bg-gray-900 hover:bg-black text-white px-8 h-12 text-base font-medium shadow-lg rounded-lg disabled:opacity-50"
            onClick={handleSearch}
            disabled={isSearching}
          >
            {isSearching ? 'Searching...' : 'Search Properties'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PlaceholderSearchWidget;
