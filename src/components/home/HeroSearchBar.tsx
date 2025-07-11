
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search, Loader2, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGooglePlaces } from "@/hooks/useGooglePlaces";
import { searchProperties } from "@/services/propertySearchService";
import { useToast } from "@/hooks/use-toast";

const HeroSearchBar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const {
    searchTerm,
    setSearchTerm,
    debouncedSearchTerm,
    results,
    isLoading,
    error,
    fetchLocations,
    clearResults,
    clearError
  } = useGooglePlaces({ debounceMs: 1200 }); // Longer debounce for hero search

  // Handle debounced search - removed clearResults from dependencies
  useEffect(() => {
    if (debouncedSearchTerm && debouncedSearchTerm.length > 2) {
      fetchLocations(debouncedSearchTerm);
    } else {
      clearResults();
      setShowResults(false);
    }
  }, [debouncedSearchTerm, fetchLocations]);

  useEffect(() => {
    if (results.length > 0) {
      setShowResults(true);
    }
  }, [results]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current && 
        resultsRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        !resultsRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (query?: string) => {
    const searchQuery = query || searchTerm;
    if (!searchQuery.trim()) {
      navigate('/search');
      return;
    }

    setIsSearching(true);
    try {
      // Execute search before navigation
      const searchResult = await searchProperties({
        cities: searchQuery.trim(),
        limit: 20
      });

      // Navigate with pre-loaded results
      navigate('/search', {
        state: {
          searchResult,
          fromHomePage: true
        }
      });

      toast({
        title: "Search Complete",
        description: `Found ${searchResult.totalCount} properties`,
      });

    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search Error",
        description: "Failed to search properties. Please try again.",
        variant: "destructive"
      });
      // Still navigate to search page on error
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
      setShowResults(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    clearError();
  };

  const handleSelect = (location: string) => {
    setSearchTerm(location);
    setShowResults(false);
    clearResults();
    handleSearch(location);
  };

  const handleInputFocus = () => {
    if (results.length > 0) {
      setShowResults(true);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-12 px-4 sm:px-0 relative">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center bg-white rounded-2xl shadow-lg border border-gray-200 p-2 hover:shadow-xl transition-shadow duration-300 gap-2 sm:gap-0">
        <div className="flex-1 px-2 sm:px-4 relative">
          <div className="absolute inset-y-0 left-2 sm:left-4 flex items-center pointer-events-none">
            {isLoading || isSearching ? (
              <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 animate-spin" />
            ) : (
              <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            )}
          </div>
          <Input
            ref={inputRef}
            type="text"
            placeholder="Enter city, neighborhood, or ZIP code"
            value={searchTerm}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            onFocus={handleInputFocus}
            disabled={isSearching}
            className="border-0 text-sm sm:text-base md:text-lg placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent h-10 sm:h-12 pl-8 sm:pl-10"
          />
        </div>
        <Button
          onClick={() => handleSearch()}
          disabled={isLoading || isSearching}
          className="bg-gray-900 hover:bg-black text-white rounded-xl px-4 sm:px-6 md:px-8 py-3 h-10 sm:h-12 font-medium transition-all duration-300 hover:scale-105 text-sm sm:text-base w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <Search className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
          {isSearching ? 'Searching...' : 'Search'}
        </Button>
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center gap-2 px-4">
          <MapPin className="h-4 w-4" />
          {error}
        </p>
      )}

      {showResults && results.length > 0 && !isSearching && (
        <Card 
          ref={resultsRef}
          className="absolute z-50 w-full mt-2 border-2 border-gray-200 rounded-xl shadow-xl bg-white max-h-60 overflow-y-auto"
        >
          <div className="py-2">
            {results.map((result, index) => (
              <button
                key={index}
                onClick={() => handleSelect(result)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors flex items-center gap-3 group"
              >
                <MapPin className="h-4 w-4 text-gray-400 group-hover:text-black transition-colors flex-shrink-0" />
                <span className="text-sm sm:text-base text-gray-900 group-hover:text-black transition-colors">
                  {result}
                </span>
              </button>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default HeroSearchBar;
