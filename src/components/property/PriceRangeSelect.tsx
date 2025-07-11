
import { DollarSign } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PriceRangeSelectProps {
  type: 'min' | 'max'
  value: number | undefined
  onChange: (value: number | undefined) => void
}

const priceRanges = {
  min: [
    { value: '100000', label: '$100K' },
    { value: '200000', label: '$200K' },
    { value: '300000', label: '$300K' },
    { value: '400000', label: '$400K' },
    { value: '500000', label: '$500K' },
    { value: '600000', label: '$600K' },
    { value: '700000', label: '$700K' },
    { value: '800000', label: '$800K' },
    { value: '900000', label: '$900K' },
    { value: '1000000', label: '$1M+' },
  ],
  max: [
    { value: '200000', label: '$200K' },
    { value: '300000', label: '$300K' },
    { value: '400000', label: '$400K' },
    { value: '500000', label: '$500K' },
    { value: '600000', label: '$600K' },
    { value: '700000', label: '$700K' },
    { value: '800000', label: '$800K' },
    { value: '900000', label: '$900K' },
    { value: '1000000', label: '$1M' },
    { value: '1500000', label: '$1.5M' },
    { value: '2000000', label: '$2M+' },
  ]
}

export const PriceRangeSelect = ({ type, value, onChange }: PriceRangeSelectProps) => {
  const handleChange = (selectedValue: string) => {
    const numericValue = parseInt(selectedValue)
    onChange(numericValue)
  }

  const handleClear = () => {
    onChange(undefined)
  }

  const placeholder = type === 'min' ? 'Min' : 'Max'
  const ranges = priceRanges[type]

  return (
    <div className="relative group">
      <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 transition-colors group-focus-within:text-indigo-500 z-10" />
      <Select
        value={value?.toString() || ''}
        onValueChange={handleChange}
      >
        <SelectTrigger className="h-12 pl-12 pr-4 border-gray-200 rounded-xl transition-all duration-200 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 hover:border-gray-300">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="bg-white border border-gray-200 rounded-xl shadow-lg z-50">
          {value && (
            <SelectItem 
              value=""
              className="hover:bg-indigo-50 focus:bg-indigo-50 cursor-pointer text-gray-500"
              onClick={handleClear}
            >
              Clear {placeholder}
            </SelectItem>
          )}
          {ranges.map((range) => (
            <SelectItem 
              key={range.value} 
              value={range.value}
              className="hover:bg-indigo-50 focus:bg-indigo-50 cursor-pointer"
            >
              {range.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
