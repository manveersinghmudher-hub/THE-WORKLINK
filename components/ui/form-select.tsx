'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * Simple native <select> with label, error, placeholder, and options props.
 * Works seamlessly with react-hook-form's register().
 */
const FormSelect = React.forwardRef<
  HTMLSelectElement,
  React.ComponentProps<'select'> & {
    label?: string
    error?: string
    placeholder?: string
    options: { value: string; label: string }[]
  }
>(({ className, label, error, placeholder, options, ...props }, ref) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <select
        ref={ref}
        className={cn(
          'border-input h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
          error ? 'border-destructive ring-destructive/20' : '',
          className,
        )}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
})

FormSelect.displayName = 'FormSelect'

export { FormSelect }
