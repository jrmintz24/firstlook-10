
import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Alert, AlertDescription } from './ui/alert'
import { Loader2, Home, MapPin, Bed, Bath, Square } from 'lucide-react'

interface House {
  id: string
  address: string
  city: string
  state: string
  zip_code: string | null
  beds: number
  baths: number
  sqft: number | null
  price: number
  description: string | null
  image_url: string | null
  available: boolean
}

interface HouseAssignment {
  id: string
  house_id: string
  assigned_at: string
  status: string
  houses: House
}

export default function HouseSelection() {
  const [houses, setHouses] = useState<House[]>([])
  const [assignment, setAssignment] = useState<HouseAssignment | null>(null)
  const [loading, setLoading] = useState(true)
  const [assigning, setAssigning] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const { user } = useAuth()

  useEffect(() => {
    fetchData()
  }, [user])

  const fetchData = async () => {
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      // Check if user already has a house assignment
      const { data: assignmentData, error: assignmentError } = await supabase
        .from('house_assignments')
        .select(`
          *,
          houses (*)
        `)
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single()

      if (assignmentError && assignmentError.code !== 'PGRST116') {
        throw assignmentError
      }

      setAssignment(assignmentData)

      // If no assignment, fetch available houses
      if (!assignmentData) {
        const { data: housesData, error: housesError } = await supabase
          .from('houses')
          .select('*')
          .eq('available', true)
          .order('price')

        if (housesError) throw housesError
        setHouses(housesData || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      setError('Failed to load house information')
    } finally {
      setLoading(false)
    }
  }

  const assignHouse = async (houseId: string) => {
    if (!user) return

    setAssigning(houseId)
    setError(null)

    try {
      const { error } = await supabase
        .from('house_assignments')
        .insert({
          user_id: user.id,
          house_id: houseId,
          status: 'active'
        })

      if (error) throw error

      // Refresh data to show the assignment
      await fetchData()
    } catch (error) {
      console.error('Error assigning house:', error)
      setError('Failed to assign house. Please try again.')
    } finally {
      setAssigning(null)
    }
  }

  const removeAssignment = async () => {
    if (!user || !assignment) return

    setAssigning('removing')
    setError(null)

    try {
      const { error } = await supabase
        .from('house_assignments')
        .update({ status: 'inactive' })
        .eq('id', assignment.id)

      if (error) throw error

      // Refresh data
      await fetchData()
    } catch (error) {
      console.error('Error removing assignment:', error)
      setError('Failed to remove house assignment. Please try again.')
    } finally {
      setAssigning(null)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading houses...</span>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  // User has an active assignment
  if (assignment) {
    const house = assignment.houses
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-green-600 mb-2">Your Assigned House</h2>
          <p className="text-gray-600">You have been assigned to the following property:</p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                {house.address}
              </CardTitle>
              <Badge variant="secondary">Assigned</Badge>
            </div>
            <CardDescription className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {house.city}, {house.state} {house.zip_code}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {house.image_url && (
              <img
                src={house.image_url}
                alt={house.address}
                className="w-full h-48 object-cover rounded-lg"
              />
            )}
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <Bed className="h-4 w-4 text-gray-500" />
                <span>{house.beds} beds</span>
              </div>
              <div className="flex items-center gap-2">
                <Bath className="h-4 w-4 text-gray-500" />
                <span>{house.baths} baths</span>
              </div>
              {house.sqft && (
                <div className="flex items-center gap-2">
                  <Square className="h-4 w-4 text-gray-500" />
                  <span>{house.sqft.toLocaleString()} sq ft</span>
                </div>
              )}
              <div className="font-semibold text-lg">
                {formatPrice(house.price)}
              </div>
            </div>

            {house.description && (
              <p className="text-gray-600">{house.description}</p>
            )}

            <div className="text-sm text-gray-500">
              Assigned on: {new Date(assignment.assigned_at).toLocaleDateString()}
            </div>

            <Button 
              variant="outline" 
              onClick={removeAssignment}
              disabled={assigning === 'removing'}
              className="w-full"
            >
              {assigning === 'removing' ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Removing Assignment...
                </>
              ) : (
                'Remove Assignment'
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // No assignment, show available houses
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Choose Your House</h2>
        <p className="text-gray-600">Select from our available properties:</p>
      </div>

      {houses.length === 0 ? (
        <Alert>
          <AlertDescription>
            No houses are currently available for assignment. Please check back later.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {houses.map((house) => (
            <Card key={house.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{house.address}</CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {house.city}, {house.state} {house.zip_code}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {house.image_url && (
                  <img
                    src={house.image_url}
                    alt={house.address}
                    className="w-full h-32 object-cover rounded"
                  />
                )}
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-1">
                    <Bed className="h-3 w-3" />
                    {house.beds} beds
                  </div>
                  <div className="flex items-center gap-1">
                    <Bath className="h-3 w-3" />
                    {house.baths} baths
                  </div>
                  {house.sqft && (
                    <div className="flex items-center gap-1 col-span-2">
                      <Square className="h-3 w-3" />
                      {house.sqft.toLocaleString()} sq ft
                    </div>
                  )}
                </div>

                <div className="font-bold text-lg text-green-600">
                  {formatPrice(house.price)}
                </div>

                {house.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {house.description}
                  </p>
                )}

                <Button 
                  onClick={() => assignHouse(house.id)}
                  disabled={assigning === house.id}
                  className="w-full"
                >
                  {assigning === house.id ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Assigning...
                    </>
                  ) : (
                    'Select This House'
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
