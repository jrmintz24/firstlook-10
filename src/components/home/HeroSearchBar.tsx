
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
    <div className="w-full max-w-2xl mx-auto mb-12">
      <div className="flex items-center bg-white rounded-2xl shadow-lg border border-gray-200 p-2 hover:shadow-xl transition-shadow duration-300">
        <div className="flex-1 px-4">
          <Input
            type="text"
            placeholder="Enter an address, neighborhood, city, or ZIP code"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="border-0 text-lg placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent h-12"
          />
        </div>
        <Button
          onClick={handleSearch}
          className="bg-gray-900 hover:bg-black text-white rounded-xl px-8 py-3 h-12 font-medium transition-all duration-300 hover:scale-105"
        >
          <Search className="h-5 w-5 mr-2" />
          Search
        </Button>
      </div>
    </div>
  );
};

export default HeroSearchBar;
