
import React from 'react';
import { Link } from 'react-router-dom';
import { useDocumentHead } from '../hooks/useDocumentHead';
import { Button } from '@/components/ui/button';
import { Search, Home, Heart } from 'lucide-react';

const Index = () => {
  useDocumentHead({
    title: 'Home Finder Platform - Find Your Perfect Home',
    description: 'Discover your dream home with our comprehensive property search platform. Browse listings, schedule tours, and find the perfect place to call home.',
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl font-light text-gray-900 mb-6">
              Find Your Perfect Home
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Discover thousands of properties with our advanced search tools and expert guidance. 
              Your dream home is just a search away.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/listings">
                <Button size="lg" className="px-8 py-3">
                  <Search className="h-5 w-5 mr-2" />
                  Start Searching
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="px-8 py-3">
                <Heart className="h-5 w-5 mr-2" />
                Browse Favorites
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light text-gray-900 mb-4">
              Why Choose Home Finder?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We make finding your next home simple, fast, and enjoyable with cutting-edge tools and personalized service.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Advanced Search</h3>
              <p className="text-gray-600">
                Filter by location, price, size, and features to find exactly what you're looking for.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Home className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Detailed Listings</h3>
              <p className="text-gray-600">
                High-quality photos, virtual tours, and comprehensive property information.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Save Favorites</h3>
              <p className="text-gray-600">
                Create your wishlist and get notified when similar properties become available.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
