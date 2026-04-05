'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * Enhanced Input with label, error message, and optional iconLeft.
 * Drop-in replacement that wraps a native <input> with form-field UI.
 */
const FormInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<'input'> & {
    label?: string
    error?: string
    iconLeft?: React.ReactNode
  }
>(({ className, label, error, iconLeft, type = 'text', ...props }, ref) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {iconLeft && (
          <span className="absolute left-3 flex items-center pointer-events-none">
            {iconLeft}
          </span>
        )}
        <input
          ref={ref}
          type={type}
          data-slot="input"
          className={cn(
            'placeholder:text-muted-foreground border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
            'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
            iconLeft ? 'pl-10' : '',
            error ? 'border-destructive ring-destructive/20' : '',
            className,
          )}
          {...props}
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
})

FormInput.displayName = 'FormInput'

export { FormInput }
