import { useState } from 'react'
import { Search } from 'lucide-react'
import Input from './Input'
import Button from './Button'

interface DateRange {
  from: string
  to: string
}

interface TableFiltersProps {
  onSearch: (value: string) => void
  onDateChange?: (range: DateRange) => void
  showDateFilter?: boolean
  additionalFilters?: React.ReactNode
}

export function TableFilters({
  onSearch,
  onDateChange,
  showDateFilter = false,
  additionalFilters,
}: TableFiltersProps) {
  const [searchValue, setSearchValue] = useState('')
  const [dateRange, setDateRange] = useState<DateRange>({
    from: '',
    to: '',
  })

  const handleSearch = () => {
    onSearch(searchValue)
  }

  const handleDateChange = (field: keyof DateRange, value: string) => {
    const newRange = { ...dateRange, [field]: value }
    setDateRange(newRange)
    onDateChange?.(newRange)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[240px]">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-10"
            />
          </div>
        </div>

        {showDateFilter && (
          <div className="flex items-center gap-2">
            <Input
              type="date"
              value={dateRange.from}
              onChange={(e) => handleDateChange('from', e.target.value)}
              className="w-40"
            />
            <span className="text-gray-500">to</span>
            <Input
              type="date"
              value={dateRange.to}
              onChange={(e) => handleDateChange('to', e.target.value)}
              className="w-40"
            />
          </div>
        )}

        <Button onClick={handleSearch}>Search</Button>
      </div>

      {additionalFilters && (
        <div className="flex flex-wrap gap-4">
          {additionalFilters}
        </div>
      )}
    </div>
  )
}