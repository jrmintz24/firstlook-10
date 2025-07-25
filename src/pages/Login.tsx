
import React, { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../contexts/SimpleAuth0Context'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Alert, AlertDescription } from '../components/ui/alert'

export const Login: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const { signIn, signInWithProvider } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  interface LocationState {
    from?: { pathname: string }
  }
  const state = location.state as LocationState | null
  const from = state?.from?.pathname || '/dashboard'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await signIn(email, password)
      navigate(from, { replace: true })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to sign in'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const handleOAuthLogin = async (provider: 'google' | 'github' | 'discord') => {
    setError(null)
    setLoading(true)

    try {
      await signInWithProvider(provider)
    } catch (error) {
      const message = error instanceof Error ? error.message : `Failed to sign in with ${provider}`
      setError(message)
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="w-full max-w-md space-y-8 p-8">
        <div className="text-center">
          <h2 className="text-3xl font-light text-gray-900 tracking-tight">Sign in to your account</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-4">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              required
              disabled={loading}
              className="border-gray-300 focus:border-gray-500 focus:ring-gray-500"
            />
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              disabled={loading}
              className="border-gray-300 focus:border-gray-500 focus:ring-gray-500"
            />
          </div>
          <Button type="submit" className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500 font-light">Or continue with</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Button type="button" variant="outline" onClick={() => handleOAuthLogin('google')} disabled={loading} className="border-gray-300 text-gray-700 hover:bg-gray-50">
              Google
            </Button>
            <Button type="button" variant="outline" onClick={() => handleOAuthLogin('github')} disabled={loading} className="border-gray-300 text-gray-700 hover:bg-gray-50">
              GitHub
            </Button>
            <Button type="button" variant="outline" onClick={() => handleOAuthLogin('discord')} disabled={loading} className="border-gray-300 text-gray-700 hover:bg-gray-50">
              Discord
            </Button>
          </div>
          <p className="text-center text-sm text-gray-600 font-light">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-gray-900 hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
