import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Star, Heart, Bell, User, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PropertyRequestForm from "@/components/PropertyRequestForm";

const BuyerDashboard = () => {
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const { toast } = useToast();

  // Mock data for user's showings
  const upcomingShowings = [
    {
      id: 1,
      address: "123 Capitol Hill Dr, Washington, DC",
      date: "2025-06-02",
      time: "2:00 PM",
      agent: "Sarah Johnson",
      status: "confirmed",
      type: "free"
    },
    {
      id: 2,
      address: "456 Dupont Circle NW, Washington, DC",
      date: "2025-06-05",
      time: "10:00 AM",
      agent: "Mike Chen",
      status: "pending",
      type: "paid"
    }
  ];

  const pastShowings = [
    {
      id: 3,
      address: "789 Georgetown Ave, Washington, DC",
      date: "2025-05-28",
      agent: "Emily Davis",
      rating: 5,
      notes: "Great property, loved the kitchen!"
    }
  ];

  const savedProperties = [
    {
      id: 1,
      address: "321 H Street NE, Washington, DC",
      price: "$850,000",
      beds: 3,
      baths: 2,
      savedDate: "2025-05-30"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Welcome back! 👋
              </h1>
              <p className="text-gray-600 mt-2">Track your showings and discover new properties</p>
            </div>
            <Button 
              onClick={() => setShowPropertyForm(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Request Showing
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upcoming Showings */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-purple-600" />
                  Upcoming Showings
                </CardTitle>
                <CardDescription>Your scheduled property viewings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingShowings.map((showing) => (
                  <div key={showing.id} className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{showing.address}</h4>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(showing.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {showing.time}
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {showing.agent}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge 
                          variant={showing.status === 'confirmed' ? 'default' : 'secondary'}
                          className={showing.status === 'confirmed' ? 'bg-green-100 text-green-800' : ''}
                        >
                          {showing.status === 'confirmed' ? (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          ) : (
                            <AlertCircle className="h-3 w-3 mr-1" />
                          )}
                          {showing.status}
                        </Badge>
                        <Badge variant="outline" className={showing.type === 'free' ? 'border-green-200 text-green-700' : 'border-blue-200 text-blue-700'}>
                          {showing.type === 'free' ? 'FREE' : 'PAID'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
                {upcomingShowings.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No upcoming showings scheduled</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => setShowPropertyForm(true)}
                    >
                      Schedule Your First Showing
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Past Showings */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Past Showings
                </CardTitle>
                <CardDescription>Properties you've visited</CardDescription>
              </CardHeader>
              <CardContent>
                {pastShowings.map((showing) => (
                  <div key={showing.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-800">{showing.address}</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Viewed on {new Date(showing.date).toLocaleDateString()} with {showing.agent}
                        </p>
                        {showing.notes && (
                          <p className="text-sm text-gray-700 mt-2 italic">"{showing.notes}"</p>
                        )}
                      </div>
                      <div className="flex">
                        {[...Array(showing.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-100 to-pink-100">
              <CardHeader>
                <CardTitle className="text-purple-800">Your Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Total Showings</span>
                    <span className="font-bold text-purple-800">{upcomingShowings.length + pastShowings.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Free Showings Used</span>
                    <span className="font-bold text-green-600">1</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Saved Properties</span>
                    <span className="font-bold text-blue-600">{savedProperties.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Saved Properties */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  Saved Properties
                </CardTitle>
              </CardHeader>
              <CardContent>
                {savedProperties.map((property) => (
                  <div key={property.id} className="p-3 border rounded-lg mb-3 last:mb-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h5 className="font-medium text-sm">{property.address}</h5>
                        <p className="text-purple-600 font-bold">{property.price}</p>
                        <p className="text-xs text-gray-500">{property.beds}bd • {property.baths}ba</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <MapPin className="h-3 w-3 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setShowPropertyForm(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Request Another Showing
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="mr-2 h-4 w-4" />
                  Browse Open Houses
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Heart className="mr-2 h-4 w-4" />
                  View Saved Properties
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <PropertyRequestForm 
        isOpen={showPropertyForm}
        onClose={() => setShowPropertyForm(false)}
      />
    </div>
  );
};

export default BuyerDashboard;
