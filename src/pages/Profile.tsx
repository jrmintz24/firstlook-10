
import { useAuth } from "@/contexts/AuthContext";
import UserProfile from "@/components/UserProfile";
import { Navigate } from "react-router-dom";

const Profile = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/buyer-auth" replace />;
  }

  // Get user type from metadata
  const userType = user.user_metadata?.user_type;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile & Settings</h1>
          <p className="text-gray-600 mt-2">
            Manage your account information and preferences
            {userType === 'agent' && (
              <span className="block text-sm mt-1 text-blue-600">
                Complete your profile to build trust with potential buyers
              </span>
            )}
          </p>
        </div>
        <UserProfile />
      </div>
    </div>
  );
};

export default Profile;
