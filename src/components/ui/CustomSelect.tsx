import React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import { ErrorMessage } from './ErrorMessage';

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps {
  // Required props
  label: string;
  options: SelectOption[];
  
  // Optional props
  error?: string;
  register?: UseFormRegisterReturn;
  isLoading?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  required?: boolean;
}

const CustomSelect: React.FC<SelectProps> = ({
  label,
  options,
  error,
  isLoading = false,
  placeholder = 'Select an option',
  className = '',
  ...rest
}) => {

  const isDisabled = rest.disabled || isLoading;
  
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {rest.required && <span className="text-red-500">*</span>}
      </label>
      
      <select
        {...rest}
        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
          isDisabled ? 'bg-gray-100 cursor-not-allowed' : ''
        }`}
      >
        <option value="">{placeholder}</option>
        
        {isLoading ? (
          <option value="" disabled>
            Loading...
          </option>
        ) : options?.length === 0 ? (
          <option value="" disabled>
            No options available
          </option>
        ) : (
          options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))
        )}
      </select>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </div>
  );
};

export default CustomSelect;