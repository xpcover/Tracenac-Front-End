import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  isEditable?: boolean
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, isEditable = true, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          'flex h-10 w-full rounded-md border border-gray-200 px-3 py-2 text-sm ring-offset-white',
          'file:border-0 file:bg-transparent file:text-sm file:font-medium',
          'placeholder:text-gray-500',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          isEditable && 'bg-gray-50',
          !isEditable && 'bg-white',
          className
        )}
        {...props}
      />
    )
  }
)

Input.displayName = 'Input'

export default Input