import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Home, Users, Shield, ArrowRight } from 'lucide-react'

export default function Index() {
  const { user } = useAuth()

  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome back!</h1>
          <p className="text-xl text-gray-600 mb-8">
            You're already signed in. Go to your dashboard to manage your house assignment.
          </p>
          <Link to="/dashboard">
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600">
              Go to Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Find Your Perfect Home
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Join our platform to get assigned to your ideal house. Simple, fast, and secure.
        </p>
        <div className="space-x-4">
          <Link to="/auth">
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link to="/auth">
            <Button variant="outline" size="lg">
              Sign In
            </Button>
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Platform?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader className="text-center">
              <Home className="h-12 w-12 mx-auto mb-4 text-purple-600" />
              <CardTitle>Quality Homes</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Carefully selected properties in prime locations with modern amenities and competitive pricing.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Users className="h-12 w-12 mx-auto mb-4 text-blue-600" />
              <CardTitle>Easy Assignment</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Simple one-click house assignment process. Browse available properties and get assigned instantly.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Shield className="h-12 w-12 mx-auto mb-4 text-green-600" />
              <CardTitle>Secure Platform</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Your data is protected with enterprise-grade security. Safe and reliable house assignment process.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Home?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of users who have found their perfect house through our platform.
          </p>
          <Link to="/auth">
            <Button size="lg" variant="secondary">
              Start Your Journey
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
