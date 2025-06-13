
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

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

export const useHouseSelection = () => {
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

  return {
    houses,
    assignment,
    loading,
    assigning,
    error,
    assignHouse,
    removeAssignment
  }
}
