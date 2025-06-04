
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight } from "lucide-react";

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  user_type: string;
}

interface ProfileTabProps {
  profile: Profile | null;
  displayName: string;
  userEmail: string;
}

const ProfileTab = ({ profile, displayName, userEmail }: ProfileTabProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Your Profile</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Name</label>
                <p className="text-lg">{displayName} {profile?.last_name || ''}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-lg">{userEmail}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Phone</label>
                <p className="text-lg">{profile?.phone || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Account Type</label>
                <p className="text-lg capitalize">{profile?.user_type || 'Buyer'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

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
      </div>
    </div>
  );
};

export default ProfileTab;
