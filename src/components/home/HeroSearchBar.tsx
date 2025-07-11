
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeroSearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Navigate to search page with the query
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      // If no query, just go to search page
      navigate('/search');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-12 px-4 sm:px-0">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center bg-white rounded-2xl shadow-lg border border-gray-200 p-2 hover:shadow-xl transition-shadow duration-300 gap-2 sm:gap-0">
        <div className="flex-1 px-2 sm:px-4">
          <Input
            type="text"
            placeholder="Enter address, neighborhood, city, or ZIP"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="border-0 text-sm sm:text-base md:text-lg placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent h-10 sm:h-12"
          />
        </div>
        <Button
          onClick={handleSearch}
          className="bg-gray-900 hover:bg-black text-white rounded-xl px-4 sm:px-6 md:px-8 py-3 h-10 sm:h-12 font-medium transition-all duration-300 hover:scale-105 text-sm sm:text-base w-full sm:w-auto"
        >
          <Search className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
          Search
        </Button>
      </div>
    </div>
  );
};

export default HeroSearchBar;
