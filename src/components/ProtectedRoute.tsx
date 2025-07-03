
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

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
  const { user, session, loading } = useAuth()
  const location = useLocation()

  console.log('ProtectedRoute - Loading:', loading, 'User:', user?.email, 'Required type:', requiredUserType, 'User type:', user?.user_metadata?.user_type);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  // Check for both user and session to ensure we have a valid auth state
  if (!user || !session) {
    console.log('ProtectedRoute - No user or session, redirecting to:', redirectTo);
    return <Navigate to={redirectTo} state={{ from: location }} replace />
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
  
  // If userType is undefined/null, don't redirect - this might be a temporary state
  // Let the component render and let auth context sort it out
  console.log('ProtectedRoute - User type is undefined, allowing render to prevent redirect loops');
  return <>{children}</>
}
