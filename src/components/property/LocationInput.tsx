
import { MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"

interface LocationInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export const LocationInput = ({ value, onChange, placeholder = "Enter address, neighborhood, city, or ZIP" }: LocationInputProps) => {
  return (
    <div className="relative group">
      <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 transition-colors group-focus-within:text-indigo-500 z-10" />
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 pl-12 pr-4 text-sm border-gray-200 rounded-xl transition-all duration-200 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 hover:border-gray-300"
      />
    </div>
  )
}
