import React, { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
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
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="text-center text-3xl font-bold">Sign in to your account</h2>
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
            />
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              disabled={loading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Button type="button" variant="outline" onClick={() => handleOAuthLogin('google')} disabled={loading}>
              Google
            </Button>
            <Button type="button" variant="outline" onClick={() => handleOAuthLogin('github')} disabled={loading}>
              GitHub
            </Button>
            <Button type="button" variant="outline" onClick={() => handleOAuthLogin('discord')} disabled={loading}>
              Discord
            </Button>
          </div>
          <p className="text-center text-sm">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
