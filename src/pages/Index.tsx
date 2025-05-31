
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Home, Star, Users, Shield, ChevronRight, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AuthModal from "@/components/AuthModal";
import PropertyRequestForm from "@/components/PropertyRequestForm";
import OpenHouseCard from "@/components/OpenHouseCard";
import HowItWorks from "@/components/HowItWorks";

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-4 bg-blue-100 text-blue-800">
            🏠 Launching in Washington D.C.
          </Badge>
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            See the home you want,<br />
            <span className="text-blue-600">when you want</span>,<br />
            without the commitment
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            ViewFree empowers homebuyers to request private showings on-demand, without requiring upfront buyer agreements. Your first showing is completely free.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg"
              onClick={handleRequestShowing}
            >
              Request Free Showing
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="px-8 py-4 text-lg border-blue-200"
              onClick={() => handleGetStarted('agent')}
            >
              Join as Showing Partner
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">100%</div>
              <div className="text-gray-600">Free First Showing</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">24hrs</div>
              <div className="text-gray-600">Average Response Time</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">Licensed</div>
              <div className="text-gray-600">Vetted Partners</div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <HowItWorks />

      {/* Open Houses Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Upcoming Open Houses in D.C.
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover open houses happening this weekend. RSVP with one click and add them to your calendar.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {openHouses.map((house) => (
              <OpenHouseCard key={house.id} house={house} />
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Button variant="outline" className="border-blue-200">
              View All Open Houses
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose ViewFree?
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="text-center border-blue-100 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>No Pressure</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Explore homes without sales pressure or commitment requirements. Your first showing is completely free.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center border-blue-100 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Clock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>On-Demand</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Request showings when it's convenient for you. No more waiting for scheduled open houses.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center border-blue-100 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Vetted Partners</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  All our showing partners are licensed, verified professionals committed to great service.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start House Hunting?
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of buyers discovering their dream homes with ViewFree. Your first private showing is on us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4"
              onClick={handleRequestShowing}
            >
              Get Your Free Showing
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4"
              onClick={() => handleGetStarted('buyer')}
            >
              Sign Up Now
            </Button>
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
