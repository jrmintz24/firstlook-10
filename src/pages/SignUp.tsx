
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/Auth0AuthContext'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Alert, AlertDescription } from '../components/ui/alert'

export const SignUp: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const { signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await signUp(email, password)
      navigate('/login', { replace: true })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to sign up'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="w-full max-w-md space-y-8 p-8">
        <div className="text-center">
          <h2 className="text-3xl font-light text-gray-900 tracking-tight">Create an account</h2>
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
            {loading ? 'Creating account...' : 'Sign up'}
          </Button>
          <p className="text-center text-sm text-gray-600 font-light">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-gray-900 hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
