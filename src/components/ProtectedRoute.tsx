
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

  // Check for specific user type requirement
  if (requiredUserType) {
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
    
    // For other user types, require exact match
    if (requiredUserType !== 'buyer' && userType !== requiredUserType) {
      console.log('ProtectedRoute - User type mismatch, redirecting based on actual type:', userType);
      // Redirect to appropriate dashboard based on user type
      if (userType === 'admin') {
        return <Navigate to="/admin-dashboard" replace />
      } else if (userType === 'agent') {
        return <Navigate to="/agent-dashboard" replace />
      } else {
        return <Navigate to="/buyer-dashboard" replace />
      }
    }
  }

  return <>{children}</>
}
