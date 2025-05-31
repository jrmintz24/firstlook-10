
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Home, Star, Users, Shield, ChevronRight, MapPin, Sparkles, Building2, TreePine, Landmark } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AuthModal from "@/components/AuthModal";
import PropertyRequestForm from "@/components/PropertyRequestForm";
import { Link } from "react-router-dom";

const DCBuyers = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const { toast } = useToast();

  const handleRequestShowing = () => {
    setShowPropertyForm(true);
  };

  const dcNeighborhoods = [
    { name: "Capitol Hill", icon: Landmark, description: "Historic charm near the Capitol" },
    { name: "Dupont Circle", icon: Building2, description: "Vibrant nightlife and dining" },
    { name: "Georgetown", icon: TreePine, description: "Upscale waterfront living" },
    { name: "Adams Morgan", icon: Star, description: "Diverse cultural hub" },
    { name: "Logan Circle", icon: Home, description: "Victorian architecture & trendy spots" },
    { name: "Shaw", icon: Users, description: "Emerging neighborhood with character" }
  ];

  const benefits = [
    {
      title: "No Upfront Buyer Agreements",
      description: "Tour homes without signing lengthy buyer representation agreements. Your first showing is completely free.",
      icon: Shield
    },
    {
      title: "Same-Day Showings Available",
      description: "See properties when it works for your schedule. Many showings available within 24 hours in DC metro area.",
      icon: Clock
    },
    {
      title: "Licensed DC Real Estate Partners",
      description: "All showing partners are licensed in Washington DC and know the local market inside and out.",
      icon: Users
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* SEO-optimized Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6 bg-blue-100 text-blue-800 border-blue-200 px-4 py-2">
              🏛️ Serving Washington DC Metro Area
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Home Showings in Washington DC 
              <span className="block text-blue-600">Without the Commitment</span>
            </h1>
            
            <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
              Tour homes in Capitol Hill, Dupont Circle, Georgetown, and throughout Washington DC without signing upfront buyer agreements. FirstLook connects DC homebuyers with licensed showing partners for on-demand property tours.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg shadow-lg"
                onClick={handleRequestShowing}
              >
                <MapPin className="mr-2 h-5 w-5" />
                Request DC Home Showing
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
              <Link to="/">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="px-8 py-4 text-lg border-2 border-blue-200 text-blue-700 hover:bg-blue-50"
                >
                  Learn More About FirstLook
                </Button>
              </Link>
            </div>

            {/* Local stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-blue-100">
                <div className="text-3xl font-bold text-blue-600">500+</div>
                <div className="text-gray-600">DC Properties Available</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-green-100">
                <div className="text-3xl font-bold text-green-600">24hrs</div>
                <div className="text-gray-600">Average Response Time</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-purple-100">
                <div className="text-3xl font-bold text-purple-600">FREE</div>
                <div className="text-gray-600">First Showing</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DC Neighborhoods Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Explore Washington DC Neighborhoods
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From historic Capitol Hill to trendy Shaw, find your perfect neighborhood in the nation's capital. 
              Our local showing partners know every corner of DC.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {dcNeighborhoods.map((neighborhood, index) => {
              const IconComponent = neighborhood.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-all duration-300 border-gray-200">
                  <CardHeader className="text-center pb-4">
                    <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center">
                      <IconComponent className="h-6 w-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl text-gray-900">{neighborhood.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <CardDescription className="text-gray-600">
                      {neighborhood.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why DC Homebuyers Choose FirstLook
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Navigate the competitive DC real estate market with flexibility and freedom. 
              No pressure, no commitments, just quality home showings when you need them.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <Card key={index} className="text-center border-0 shadow-lg bg-white hover:shadow-xl transition-all duration-300">
                  <CardHeader className="pb-4">
                    <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-2xl flex items-center justify-center">
                      <IconComponent className="h-8 w-8 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl text-gray-900">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 leading-relaxed">
                      {benefit.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Local SEO Content */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Home Buying in Washington DC Made Simple
            </h2>
            
            <div className="prose prose-lg mx-auto text-gray-700">
              <p className="text-xl leading-relaxed mb-6">
                Washington DC's real estate market moves fast, but that doesn't mean you should rush into commitments. 
                FirstLook revolutionizes how you tour homes in the District, giving you the freedom to explore 
                properties from Capitol Hill to Adams Morgan without the pressure of traditional buyer agreements.
              </p>
              
              <h3 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                How FirstLook Works in Washington DC
              </h3>
              <p className="mb-4">
                Our platform connects you with licensed real estate professionals who specialize in DC neighborhoods. 
                Whether you're interested in a historic rowhouse in Dupont Circle, a modern condo in Navy Yard, 
                or a family home in Petworth, our showing partners know the local market and can provide valuable insights.
              </p>
              
              <h3 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                DC Market Expertise
              </h3>
              <p className="mb-4">
                Our showing partners understand DC's unique characteristics: from navigating historic district 
                regulations to understanding metro accessibility and neighborhood development trends. Get local 
                expertise without the long-term commitment.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="bg-blue-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Start Your DC Home Search Today
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto text-lg">
            Join hundreds of DC homebuyers who have discovered their perfect home with FirstLook. 
            Your first showing is completely free.
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 font-semibold text-lg shadow-lg"
            onClick={handleRequestShowing}
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Request Your Free DC Home Showing
          </Button>
        </div>
      </div>

      {/* Modals */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        userType="buyer"
      />
      
      <PropertyRequestForm 
        isOpen={showPropertyForm}
        onClose={() => setShowPropertyForm(false)}
      />
    </div>
  );
};

export default DCBuyers;
