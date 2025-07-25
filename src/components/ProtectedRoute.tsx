
import { useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/Auth0AuthContext'
import { Auth0Redirect } from './Auth0Redirect'

interface ProtectedRouteProps {
  children: React.ReactNode
  redirectTo?: string
  requiredUserType?: string
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  redirectTo = '/buyer-auth', 
  requiredUserType 
}) => {
  const { user, loading, isAuthenticated } = useAuth()
  const location = useLocation()

  console.log('ProtectedRoute - Loading:', loading, 'Authenticated:', isAuthenticated, 'User:', user?.email, 'Required type:', requiredUserType, 'User type:', user?.user_metadata?.user_type);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  // Check if user is authenticated
  if (!isAuthenticated || !user) {
    console.log('ProtectedRoute - User not authenticated, using Auth0 redirect');
    return <Auth0Redirect returnTo={location.pathname + location.search} />
  }

  // If no specific user type is required, allow access
  if (!requiredUserType) {
    return <>{children}</>
  }

  // Check for specific user type requirement
  const userType = user.user_metadata?.user_type;
  
  console.log('ProtectedRoute - User type check:', {
    required: requiredUserType,
    actual: userType,
    userId: user.id
  });
  
  // For buyer routes, allow users with no user_type (legacy users) or explicit buyer type
  if (requiredUserType === 'buyer' && (!userType || userType === 'buyer')) {
    return <>{children}</>
  }
  
  // For agent routes, require exact match to 'agent'
  if (requiredUserType === 'agent' && userType === 'agent') {
    return <>{children}</>
  }
  
  // For admin routes, require exact match to 'admin'  
  if (requiredUserType === 'admin' && userType === 'admin') {
    return <>{children}</>
  }
  
  // If we reach here, there's a user type mismatch
  console.log('ProtectedRoute - User type mismatch, user type:', userType, 'required:', requiredUserType);
  
  // Only redirect if we have a clear user type mismatch (not during loading states)
  if (userType) {
    // Redirect to appropriate dashboard based on actual user type
    if (userType === 'admin') {
      return <Navigate to="/admin-dashboard" replace />
    } else if (userType === 'agent') {
      return <Navigate to="/agent-dashboard" replace />
    } else {
      return <Navigate to="/buyer-dashboard" replace />
    }
  }
  
  // If userType is undefined/null, allow render and let auth context sort it out
  console.log('ProtectedRoute - User type is undefined, allowing render');
  return <>{children}</>
}
