
import React from 'react'
import { Alert, AlertDescription } from './ui/alert'
import { Loader2 } from 'lucide-react'
import { useHouseSelection } from '../hooks/useHouseSelection'
import HouseAssignmentCard from './houses/HouseAssignmentCard'
import HouseGrid from './houses/HouseGrid'

export default function HouseSelection() {
  const {
    houses,
    assignment,
    loading,
    assigning,
    error,
    assignHouse,
    removeAssignment
  } = useHouseSelection()

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
    return (
      <HouseAssignmentCard
        assignment={assignment}
        assigning={assigning}
        onRemoveAssignment={removeAssignment}
      />
    )
  }

  // No assignment, show available houses
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Choose Your House</h2>
        <p className="text-gray-600">Select from our available properties:</p>
      </div>

      <HouseGrid
        houses={houses}
        assigning={assigning}
        onAssignHouse={assignHouse}
      />
    </div>
  )
}
