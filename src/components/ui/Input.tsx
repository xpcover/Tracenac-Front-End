import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { ErrorMessage } from './ErrorMessage'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  isEditable?: boolean
  label?: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      isEditable = true,
      error,
      ...props
    },
    ref
  ) => {
    const inputElement = (
      <input
        ref={ref}
        className={cn(
          'flex h-10 w-full rounded-md border border-gray-200 px-3 py-2 text-sm ring-offset-white',
          'file:border-0 file:bg-transparent file:text-sm file:font-medium',
          'placeholder:text-gray-500',
          'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-1',
          'disabled:cursor-not-allowed disabled:opacity-50',
          isEditable ? 'bg-gray-50' : 'bg-white',
          error && 'border-red-500 focus-visible:ring-0',
          className
        )}
        {...props}
      />
    )

    if (label) {
      return (
        <div className="space-y-1">
          <label htmlFor={props?.id} className="block text-sm font-medium text-gray-700">
            {label}
          </label>
          {inputElement}
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </div>
      )
    }

    return inputElement
  }
)

Input.displayName = 'Input'

export default Input