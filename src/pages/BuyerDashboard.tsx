
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Home, MapPin, Phone, Mail, User, Plus, CheckCircle, AlertCircle, Star, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PropertyRequestForm from "@/components/PropertyRequestForm";
import { Link } from "react-router-dom";

const BuyerDashboard = () => {
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const { toast } = useToast();

  // Mock data
  const upcomingShowings = [
    {
      id: 1,
      address: "123 Capitol Hill Dr, Washington, DC",
      date: "2025-06-02",
      time: "2:00 PM",
      agent: "Sarah Johnson",
      agentPhone: "(202) 555-0123",
      status: "confirmed",
      notes: "First floor unit, bring ID"
    },
    {
      id: 2,
      address: "456 Dupont Circle NW, Washington, DC",
      date: "2025-06-03",
      time: "11:00 AM",
      agent: "Mike Chen",
      agentPhone: "(202) 555-0456",
      status: "pending",
      notes: "Parking available on street"
    }
  ];

  const showingHistory = [
    {
      id: 3,
      address: "789 Georgetown Ave, Washington, DC",
      date: "2025-05-28",
      time: "3:00 PM",
      agent: "Lisa Rodriguez",
      status: "completed",
      rating: 5,
      feedback: "Great property! Loved the kitchen and natural light."
    },
    {
      id: 4,
      address: "321 Adams Morgan St, Washington, DC",
      date: "2025-05-25",
      time: "1:00 PM",
      agent: "David Kim",
      status: "completed",
      rating: 4,
      feedback: "Nice layout but a bit small for our needs."
    }
  ];

  const handleRequestShowing = () => {
    setShowPropertyForm(true);
  };

  const handleCancelShowing = (showingId: number) => {
    toast({
      title: "Showing Cancelled",
      description: "We've notified your showing partner. You can reschedule anytime.",
    });
  };

  const handleRescheduleShowing = (showingId: number) => {
    toast({
      title: "Reschedule Request Sent",
      description: "Your showing partner will contact you with new available times.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                FirstLook
              </Link>
              <p className="text-gray-600 mt-1">Your Dashboard</p>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                onClick={handleRequestShowing}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Request Showing
              </Button>
              <div className="flex items-center gap-2 text-gray-600">
                <User className="h-5 w-5" />
                <span>Welcome, John!</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">2</div>
              <div className="text-gray-600">Upcoming Showings</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">4</div>
              <div className="text-gray-600">Total Showings</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">4.5</div>
              <div className="text-gray-600">Avg Rating</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">1</div>
              <div className="text-gray-600">Free Shows Left</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upcoming">Upcoming Showings</TabsTrigger>
            <TabsTrigger value="history">Showing History</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Upcoming Showings</h2>
              <Button 
                onClick={handleRequestShowing}
                variant="outline"
                className="border-purple-200 text-purple-700 hover:bg-purple-50"
              >
                <Plus className="h-4 w-4 mr-2" />
                Schedule New Showing
              </Button>
            </div>

            {upcomingShowings.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No upcoming showings</h3>
                  <p className="text-gray-500 mb-6">Ready to find your dream home? Schedule your first showing!</p>
                  <Button 
                    onClick={handleRequestShowing}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    Request Your Free Showing
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {upcomingShowings.map((showing) => (
                  <Card key={showing.id} className="shadow-lg border-0">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge 
                              variant={showing.status === 'confirmed' ? 'default' : 'secondary'}
                              className={showing.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                            >
                              {showing.status === 'confirmed' ? (
                                <CheckCircle className="h-3 w-3 mr-1" />
                              ) : (
                                <AlertCircle className="h-3 w-3 mr-1" />
                              )}
                              {showing.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                            </Badge>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-purple-500" />
                            {showing.address}
                          </h3>
                          <div className="flex items-center gap-6 text-gray-600 mb-3">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(showing.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{showing.time}</span>
                            </div>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg mb-4">
                            <div className="text-sm font-medium text-gray-800 mb-1">Showing Partner</div>
                            <div className="text-gray-600">{showing.agent}</div>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <Phone className="h-3 w-3" />
                              {showing.agentPhone}
                            </div>
                          </div>
                          {showing.notes && (
                            <div className="bg-blue-50 p-3 rounded-lg">
                              <div className="text-sm font-medium text-blue-800 mb-1">Notes</div>
                              <div className="text-blue-600 text-sm">{showing.notes}</div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleRescheduleShowing(showing.id)}
                        >
                          Reschedule
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleCancelShowing(showing.id)}
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          Cancel
                        </Button>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          <Phone className="h-3 w-3 mr-1" />
                          Contact Agent
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Showing History</h2>
            
            <div className="grid gap-6">
              {showingHistory.map((showing) => (
                <Card key={showing.id} className="shadow-lg border-0">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-purple-500" />
                          {showing.address}
                        </h3>
                        <div className="flex items-center gap-6 text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(showing.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{showing.time}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-green-600 font-medium">Completed</span>
                          </div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg mb-4">
                          <div className="text-sm font-medium text-gray-800 mb-1">Showing Partner</div>
                          <div className="text-gray-600">{showing.agent}</div>
                        </div>
                        {showing.rating && (
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-sm font-medium text-gray-700">Your Rating:</span>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`h-4 w-4 ${i < showing.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                                />
                              ))}
                            </div>
                          </div>
                        )}
                        {showing.feedback && (
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <div className="text-sm font-medium text-blue-800 mb-1">Your Feedback</div>
                            <div className="text-blue-600 text-sm">{showing.feedback}</div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button 
                        onClick={handleRequestShowing}
                        size="sm" 
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Book Another Showing
                      </Button>
                      <Button variant="outline" size="sm">
                        View Property Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Your Preferences</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Preferences</CardTitle>
                  <CardDescription>How would you like us to contact you?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-blue-500" />
                    <div>
                      <div className="font-medium">Email</div>
                      <div className="text-sm text-gray-500">john.doe@email.com</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-green-500" />
                    <div>
                      <div className="font-medium">Phone</div>
                      <div className="text-sm text-gray-500">(202) 555-0199</div>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    Update Contact Info
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Search Preferences</CardTitle>
                  <CardDescription>Tell us what you're looking for</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Preferred Areas</div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">Capitol Hill</Badge>
                      <Badge variant="secondary">Dupont Circle</Badge>
                      <Badge variant="secondary">Georgetown</Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-medium">Price Range</div>
                      <div className="text-gray-500">$600K - $1M</div>
                    </div>
                    <div>
                      <div className="font-medium">Bedrooms</div>
                      <div className="text-gray-500">2-3 beds</div>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    Update Preferences
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>FirstLook Benefits</CardTitle>
                <CardDescription>Your current membership status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-green-800">Free Tier</h3>
                      <p className="text-green-600 text-sm">1 free showing remaining</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-green-700">
                      <CheckCircle className="h-4 w-4" />
                      <span>First showing completely free</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-green-700">
                      <CheckCircle className="h-4 w-4" />
                      <span>Licensed, vetted showing partners</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-green-700">
                      <CheckCircle className="h-4 w-4" />
                      <span>No pressure, no commitment</span>
                    </div>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    Learn About Additional Services
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <PropertyRequestForm 
        isOpen={showPropertyForm}
        onClose={() => setShowPropertyForm(false)}
      />
    </div>
  );
};

export default BuyerDashboard;
