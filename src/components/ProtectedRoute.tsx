
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useState, useEffect } from 'react'
import { getUserTypeFromProfile, getUserRedirectPath } from '../utils/userTypeUtils'

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
  const [userType, setUserType] = useState<string | null>(null)
  const [userTypeLoading, setUserTypeLoading] = useState(true)

  // Get user type from profile when user is available
  useEffect(() => {
    const fetchUserType = async () => {
      if (!user) {
        setUserTypeLoading(false)
        return
      }

      // First try to get from metadata
      const metadataUserType = user.user_metadata?.user_type
      if (metadataUserType) {
        setUserType(metadataUserType)
        setUserTypeLoading(false)
        return
      }

      // Fallback to profile table
      try {
        const profileUserType = await getUserTypeFromProfile(user.id)
        setUserType(profileUserType || 'buyer')
      } catch (error) {
        console.error('Error fetching user type:', error)
        setUserType('buyer') // Safe default
      } finally {
        setUserTypeLoading(false)
      }
    }

    fetchUserType()
  }, [user])

  console.log('ProtectedRoute - Loading:', loading, 'UserTypeLoading:', userTypeLoading, 'User:', user?.email, 'Required type:', requiredUserType, 'Actual type:', userType);

  if (loading || userTypeLoading) {
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
  if (requiredUserType && userType) {
    // For buyer routes, allow users with buyer type or no specific type preference
    if (requiredUserType === 'buyer' && userType === 'buyer') {
      return <>{children}</>
    }
    
    // For other user types, require exact match
    if (requiredUserType !== 'buyer' && userType !== requiredUserType) {
      console.log('User type mismatch:', {
        required: requiredUserType,
        actual: userType
      });
      
      // Redirect to appropriate dashboard based on actual user type
      const correctPath = getUserRedirectPath(userType)
      return <Navigate to={correctPath} replace />
    }
    
    // Exact match for non-buyer types
    if (requiredUserType !== 'buyer' && userType === requiredUserType) {
      return <>{children}</>
    }
  }

  return <>{children}</>
}
