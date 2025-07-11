
import { Home, Bath } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface BedroomBathroomSelectProps {
  type: 'beds' | 'baths'
  value: number | undefined
  onChange: (value: number | undefined) => void
}

export const BedroomBathroomSelect = ({ type, value, onChange }: BedroomBathroomSelectProps) => {
  const handleChange = (selectedValue: string) => {
    const numericValue = selectedValue === 'any' ? undefined : parseInt(selectedValue)
    onChange(numericValue)
  }

  const placeholder = type === 'beds' ? 'Beds' : 'Baths'
  const Icon = type === 'beds' ? Home : Bath
  const maxOptions = type === 'beds' ? 5 : 4

  return (
    <div className="relative group">
      <Icon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 transition-colors group-focus-within:text-indigo-500 z-10" />
      <Select
        value={value?.toString() || 'any'}
        onValueChange={handleChange}
      >
        <SelectTrigger className="h-12 pl-12 pr-4 border-gray-200 rounded-xl transition-all duration-200 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 hover:border-gray-300">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="bg-white border border-gray-200 rounded-xl shadow-lg z-50">
          <SelectItem value="any" className="hover:bg-indigo-50 focus:bg-indigo-50 cursor-pointer">
            Any
          </SelectItem>
          {Array.from({ length: maxOptions }, (_, i) => i + 1).map((num) => (
            <SelectItem 
              key={num} 
              value={num.toString()}
              className="hover:bg-indigo-50 focus:bg-indigo-50 cursor-pointer"
            >
              {num}+
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
