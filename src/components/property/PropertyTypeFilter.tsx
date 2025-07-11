
import { useState } from "react"
import { Home, Building2, Building, Users } from "lucide-react"

interface PropertyTypeFilterProps {
  selectedTypes: string[]
  onChange: (types: string[]) => void
}

const propertyTypes = [
  { value: 'Residential', label: 'House', icon: Home },
  { value: 'Condo', label: 'Condo', icon: Building2 },
  { value: 'Townhouse', label: 'Townhouse', icon: Building },
  { value: 'Multi-Family', label: 'Multi-Family', icon: Users },
]

export const PropertyTypeFilter = ({ selectedTypes, onChange }: PropertyTypeFilterProps) => {
  const handleToggle = (type: string) => {
    const newTypes = selectedTypes.includes(type)
      ? selectedTypes.filter(t => t !== type)
      : [...selectedTypes, type]
    onChange(newTypes)
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
        Property Type
      </h3>
      <div className="flex flex-wrap gap-2">
        {propertyTypes.map((type) => {
          const isSelected = selectedTypes.includes(type.value)
          const IconComponent = type.icon
          
          return (
            <button
              key={type.value}
              onClick={() => handleToggle(type.value)}
              className={`
                inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium 
                transition-all duration-200 border-2 min-h-[40px]
                ${isSelected
                  ? 'bg-indigo-500 text-white border-indigo-500 shadow-md hover:bg-indigo-600 hover:border-indigo-600'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700'
                }
              `}
            >
              <IconComponent className="h-4 w-4" />
              {type.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
