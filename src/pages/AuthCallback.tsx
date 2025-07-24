
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export const AuthCallback: React.FC = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        console.log('Auth callback - user signed in:', session.user.email)
        
        // Check if this was a tour booking sign-in
        const isFromTourBooking = localStorage.getItem('newUserFromPropertyRequest') === 'true'
        const pendingTourRequest = localStorage.getItem('pendingTourRequest')
        
        if (isFromTourBooking && pendingTourRequest) {
          console.log('Redirecting to continue tour booking after OAuth')
          // Clear the flag
          localStorage.removeItem('newUserFromPropertyRequest')
          // Navigate to buyer dashboard where they can continue the tour
          navigate('/buyer-dashboard', { replace: true })
        } else {
          // Default redirect to dashboard
          navigate('/dashboard', { replace: true })
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [navigate])

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>
  )
}
