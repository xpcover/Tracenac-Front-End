import { FC } from "react"

interface CheckBoxProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  error?: string
}

const Checkbox: FC<CheckBoxProps>= ({ 
  label, 
  checked, 
  onChange, 
  error,
  ...props 
}) => (
  <div className="space-y-1">
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        {...props}
      />
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </label>
    {error && <p className="text-red-500 text-xs">{error}</p>}
  </div>
)

export default Checkbox