import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Home, Star, Users, Shield, ChevronRight, MapPin, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AuthModal from "@/components/AuthModal";
import PropertyRequestForm from "@/components/PropertyRequestForm";
import OpenHouseCard from "@/components/OpenHouseCard";
import HowItWorks from "@/components/HowItWorks";
import { Link } from "react-router-dom";

const Index = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authType, setAuthType] = useState<'buyer' | 'agent'>('buyer');
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const { toast } = useToast();

  const handleGetStarted = (userType: 'buyer' | 'agent') => {
    setAuthType(userType);
    setShowAuthModal(true);
  };

  const handleRequestShowing = () => {
    setShowPropertyForm(true);
  };

  // Mock data for open houses
  const openHouses = [
    {
      id: 1,
      address: "123 Capitol Hill Dr, Washington, DC",
      price: "$750,000",
      beds: 3,
      baths: 2,
      sqft: "1,850",
      date: "2025-06-01",
      time: "2:00 PM - 4:00 PM",
      image: "/placeholder.svg"
    },
    {
      id: 2,
      address: "456 Dupont Circle NW, Washington, DC",
      price: "$950,000",
      beds: 2,
      baths: 2,
      sqft: "1,200",
      date: "2025-06-01",
      time: "1:00 PM - 3:00 PM",
      image: "/placeholder.svg"
    },
    {
      id: 3,
      address: "789 Georgetown Ave, Washington, DC",
      price: "$1,200,000",
      beds: 4,
      baths: 3,
      sqft: "2,100",
      date: "2025-06-02",
      time: "11:00 AM - 1:00 PM",
      image: "/placeholder.svg"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 relative">
        {/* Decorative background elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-10 blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-10 blur-xl"></div>
        
        <div className="text-center max-w-4xl mx-auto relative z-10">
          <Badge variant="secondary" className="mb-6 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border-purple-200 px-4 py-2 text-sm">
            ✨ Launching in Washington D.C.
          </Badge>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent mb-6 leading-tight">
            See the home you want,<br />
            <span className="text-4xl md:text-6xl">when you want</span>,<br />
            without the commitment
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed">
            ViewFree empowers homebuyers to request private showings on-demand, without requiring upfront buyer agreements. Your first showing is completely free. 🏠✨
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              onClick={handleRequestShowing}
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Request Free Showing
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="px-8 py-4 text-lg border-2 border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 transition-all duration-300"
              onClick={() => handleGetStarted('agent')}
            >
              Join as Showing Partner
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-purple-100">
              <div className="text-4xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">100%</div>
              <div className="text-gray-600 font-medium">Free First Showing</div>
            </div>
            <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-pink-100">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-cyan-600 bg-clip-text text-transparent">24hrs</div>
              <div className="text-gray-600 font-medium">Average Response Time</div>
            </div>
            <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-orange-100">
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">Licensed</div>
              <div className="text-gray-600 font-medium">Vetted Partners</div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <HowItWorks />

      {/* Open Houses Section */}
      <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Upcoming Open Houses in D.C.
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Discover open houses happening this weekend. RSVP with one click and add them to your calendar.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {openHouses.map((house) => (
              <OpenHouseCard key={house.id} house={house} />
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Button variant="outline" className="border-2 border-purple-200 text-purple-700 hover:bg-purple-50 px-6 py-3">
              View All Open Houses
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-orange-500 bg-clip-text text-transparent mb-4">
              Why Choose ViewFree?
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="text-center border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-gray-800">No Pressure</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  Explore homes without sales pressure or commitment requirements. Your first showing is completely free.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center">
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-gray-800">On-Demand</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  Request showings when it's convenient for you. No more waiting for scheduled open houses.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-gray-800">Vetted Partners</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  All our showing partners are licensed, verified professionals committed to great service.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Start House Hunting?
          </h2>
          <p className="text-purple-100 mb-8 max-w-2xl mx-auto text-lg">
            Join thousands of buyers discovering their dream homes with ViewFree. Your first private showing is on us. ✨
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Button 
              size="lg" 
              variant="secondary"
              className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              onClick={handleRequestShowing}
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Get Your Free Showing
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 font-semibold transition-all duration-300"
              onClick={() => handleGetStarted('buyer')}
            >
              Sign Up Now
            </Button>
          </div>
          
          <div className="text-center">
            <Link to="/faq">
              <Button variant="ghost" className="text-white hover:bg-white/10 underline">
                Questions about the NAR settlement? Read our FAQ →
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        userType={authType}
      />
      
      <PropertyRequestForm 
        isOpen={showPropertyForm}
        onClose={() => setShowPropertyForm(false)}
      />
    </div>
  );
};

export default Index;
