
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Home, Star, Users, Shield, ChevronRight, MapPin, Sparkles, Building2, TreePine, Landmark, CheckCircle, ArrowRight, Quote, Phone, Mail } from "lucide-react";
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

  const handleSignUp = () => {
    setShowAuthModal(true);
  };

  const dcNeighborhoods = [
    { name: "Capitol Hill", icon: Landmark, description: "Historic charm near the Capitol", avgPrice: "$850K" },
    { name: "Dupont Circle", icon: Building2, description: "Vibrant nightlife and dining", avgPrice: "$720K" },
    { name: "Georgetown", icon: TreePine, description: "Upscale waterfront living", avgPrice: "$1.2M" },
    { name: "Adams Morgan", icon: Star, description: "Diverse cultural hub", avgPrice: "$650K" },
    { name: "Logan Circle", icon: Home, description: "Victorian architecture & trendy spots", avgPrice: "$780K" },
    { name: "Shaw", icon: Users, description: "Emerging neighborhood with character", avgPrice: "$600K" }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      neighborhood: "Capitol Hill",
      quote: "FirstLook made house hunting so much easier. I saw 8 homes in one weekend without any pressure to sign with an agent. Found my dream rowhouse!",
      rating: 5
    },
    {
      name: "Marcus Johnson",
      neighborhood: "Dupont Circle",
      quote: "The flexibility was amazing. I could schedule showings around my work schedule, and the showing partner knew everything about the neighborhood.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      neighborhood: "Georgetown",
      quote: "No pushy sales tactics, just great service. The showing partner answered all my questions and never made me feel rushed to make a decision.",
      rating: 5
    }
  ];

  const benefits = [
    "No upfront buyer agreements required",
    "Same-day showing availability",
    "Licensed DC real estate professionals",
    "Complete neighborhood expertise",
    "Free first showing guaranteed",
    "No hidden fees or surprises"
  ];

  const problemPoints = [
    {
      problem: "Traditional agents require lengthy buyer agreements before showing any homes",
      solution: "FirstLook lets you tour homes immediately without any commitments"
    },
    {
      problem: "Open houses are crowded and only available on weekends",
      solution: "Get private showings 7 days a week at times that work for you"
    },
    {
      problem: "Agents pressure you to make quick decisions",
      solution: "Take your time, see multiple properties, make informed decisions"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6 bg-blue-100 text-blue-800 border-blue-200 px-6 py-3 text-lg">
              🏛️ Now Serving Washington DC Metro Area
            </Badge>
            
            <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
              Tour DC Homes
              <span className="block text-blue-600">Without the Hassle</span>
            </h1>
            
            <p className="text-2xl text-gray-700 mb-10 max-w-3xl mx-auto leading-relaxed">
              Stop dealing with pushy agents and restrictive buyer agreements. FirstLook gives you instant access to home showings across Washington DC - from Capitol Hill to Georgetown - with zero commitment required.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-6 text-xl shadow-xl transform hover:scale-105 transition-all duration-300"
                onClick={handleRequestShowing}
              >
                <MapPin className="mr-3 h-6 w-6" />
                Get Your FREE DC Home Tour
                <ChevronRight className="ml-3 h-6 w-6" />
              </Button>
              <Link to="/">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="px-10 py-6 text-xl border-3 border-blue-200 text-blue-700 hover:bg-blue-50"
                >
                  See How FirstLook Works
                </Button>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-blue-100 shadow-lg">
                <div className="text-4xl font-bold text-blue-600">500+</div>
                <div className="text-gray-600 font-medium">Available Properties</div>
              </div>
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-green-100 shadow-lg">
                <div className="text-4xl font-bold text-green-600">2hrs</div>
                <div className="text-gray-600 font-medium">Average Response</div>
              </div>
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-purple-100 shadow-lg">
                <div className="text-4xl font-bold text-purple-600">100%</div>
                <div className="text-gray-600 font-medium">Free First Tour</div>
              </div>
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-orange-100 shadow-lg">
                <div className="text-4xl font-bold text-orange-600">Licensed</div>
                <div className="text-gray-600 font-medium">DC Professionals</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Problem/Solution Section */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold text-gray-900 mb-6">
                House Hunting in DC Shouldn't Be This Hard
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                The traditional real estate process is broken. We're fixing it, one showing at a time.
              </p>
            </div>
            
            <div className="space-y-12">
              {problemPoints.map((point, index) => (
                <div key={index} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div className={`${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                    <div className="bg-red-50 border-l-4 border-red-400 p-8 rounded-lg">
                      <h3 className="text-2xl font-bold text-red-800 mb-4">The Problem:</h3>
                      <p className="text-red-700 text-lg">{point.problem}</p>
                    </div>
                  </div>
                  <div className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                    <div className="bg-green-50 border-l-4 border-green-400 p-8 rounded-lg">
                      <h3 className="text-2xl font-bold text-green-800 mb-4">FirstLook Solution:</h3>
                      <p className="text-green-700 text-lg">{point.solution}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Checklist */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              What You Get With FirstLook
            </h2>
            <p className="text-xl text-gray-600 mb-12">
              Everything you need to find your perfect DC home, without the traditional hassles.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-4 p-6 bg-gray-50 rounded-lg">
                  <CheckCircle className="h-8 w-8 text-green-600 flex-shrink-0" />
                  <span className="text-lg text-gray-800 font-medium">{benefit}</span>
                </div>
              ))}
            </div>
            
            <Button 
              size="lg" 
              className="bg-green-600 hover:bg-green-700 text-white px-12 py-6 text-xl shadow-xl"
              onClick={handleSignUp}
            >
              <Sparkles className="mr-3 h-6 w-6" />
              Start Your DC Home Search Today
            </Button>
          </div>
        </div>
      </div>

      {/* DC Neighborhoods with Pricing */}
      <div className="py-20 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Find Your Perfect DC Neighborhood
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From historic Capitol Hill to trendy Shaw, explore every corner of the nation's capital with local experts who know each neighborhood inside and out.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {dcNeighborhoods.map((neighborhood, index) => {
              const IconComponent = neighborhood.icon;
              return (
                <Card key={index} className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white">
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                      <IconComponent className="h-8 w-8 text-blue-600" />
                    </div>
                    <CardTitle className="text-2xl text-gray-900">{neighborhood.name}</CardTitle>
                    <div className="text-3xl font-bold text-blue-600">{neighborhood.avgPrice}</div>
                    <div className="text-sm text-gray-500">Average Home Price</div>
                  </CardHeader>
                  <CardContent className="text-center">
                    <CardDescription className="text-gray-600 text-lg">
                      {neighborhood.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              What DC Homebuyers Are Saying
            </h2>
            <p className="text-xl text-gray-600">
              Real stories from real people who found their dream homes with FirstLook.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
                <CardHeader>
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <Quote className="h-8 w-8 text-blue-300 mb-4" />
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 text-lg mb-6 italic">"{testimonial.quote}"</p>
                  <div className="border-t pt-4">
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-blue-600">{testimonial.neighborhood} Homeowner</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              How FirstLook Works in DC
            </h2>
            <p className="text-xl text-gray-600">
              Three simple steps to your perfect home tour.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold text-white">1</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Request a Showing</h3>
              <p className="text-gray-600 text-lg">
                Tell us which DC property you want to see. No registration required for your first tour.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold text-white">2</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Get Matched</h3>
              <p className="text-gray-600 text-lg">
                We connect you with a licensed showing partner who knows your target neighborhood.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-purple-600 rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold text-white">3</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Tour Your Home</h3>
              <p className="text-gray-600 text-lg">
                Visit the property at your convenience. No pressure, no commitments, just expertise.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Local SEO Content */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">
              Your Trusted Partner for DC Real Estate
            </h2>
            
            <div className="prose prose-xl mx-auto text-gray-700">
              <p className="text-xl leading-relaxed mb-8">
                Washington DC's real estate market is unique, complex, and moves at lightning speed. With median home prices reaching $650,000 and inventory changing daily, you need more than just access to listings - you need expert guidance and the flexibility to move quickly when the right property appears.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 my-12">
                <div>
                  <h3 className="text-3xl font-semibold text-gray-900 mb-6">DC Market Expertise</h3>
                  <p className="mb-4">
                    Our showing partners don't just know real estate - they know DC. From understanding historic district regulations in Georgetown to navigating the competitive bidding wars in Capitol Hill, they provide insights you won't get from generic online platforms.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-600 mr-2" />Metro accessibility analysis</li>
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-600 mr-2" />Neighborhood development trends</li>
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-600 mr-2" />School district insights</li>
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-600 mr-2" />Local market pricing strategy</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-3xl font-semibold text-gray-900 mb-6">No Commitment Required</h3>
                  <p className="mb-4">
                    Traditional real estate requires you to commit to an agent before seeing a single property. FirstLook flips this model - experience our service first, then decide if you want to work together long-term.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-600 mr-2" />Free first showing guaranteed</li>
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-600 mr-2" />No buyer representation agreements</li>
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-600 mr-2" />Transparent pricing always</li>
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-600 mr-2" />Work with multiple partners if needed</li>
                  </ul>
                </div>
              </div>
              
              <h3 className="text-3xl font-semibold text-gray-900 mt-12 mb-6 text-center">
                Ready to Experience the Difference?
              </h3>
              <p className="text-center text-xl mb-8">
                Join hundreds of DC homebuyers who have discovered a better way to house hunt. Your dream home is waiting, and your first showing is completely free.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-5xl font-bold text-white mb-6">
            Your Perfect DC Home Awaits
          </h2>
          <p className="text-blue-100 mb-12 max-w-3xl mx-auto text-xl leading-relaxed">
            Stop waiting for the perfect open house or dealing with pushy agents. Get instant access to any property in Washington DC with FirstLook. Your first private showing is completely free - no strings attached.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
            <Button 
              size="lg" 
              variant="secondary"
              className="bg-white text-blue-600 hover:bg-gray-100 px-12 py-6 font-bold text-xl shadow-xl transform hover:scale-105 transition-all duration-300"
              onClick={handleRequestShowing}
            >
              <Sparkles className="mr-3 h-6 w-6" />
              Request Your FREE DC Home Tour
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-3 border-white text-white hover:bg-white hover:text-blue-600 px-12 py-6 font-bold text-xl transition-all duration-300"
              onClick={handleSignUp}
            >
              Sign Up & Start Browsing
              <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto text-white">
            <div className="flex items-center justify-center space-x-2">
              <Phone className="h-5 w-5" />
              <span>Available 7 Days a Week</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="h-5 w-5" />
              <span>100% Free First Tour</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Licensed DC Professionals</span>
            </div>
          </div>
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
