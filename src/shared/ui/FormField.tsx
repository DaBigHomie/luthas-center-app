/**
 * FormField — Luthas Center primitive
 *
 * Covers: text/email/password/number/tel/url inputs, textarea, select.
 * Each field wraps: label (always above), input, optional helper text, optional error message.
 *
 * Accessibility:
 * - <label> always rendered
 * - aria-describedby links helper + error ids
 * - aria-invalid on error state
 * - aria-required + visible asterisk (aria-hidden)
 * - error uses role="alert" on dynamic render
 * - Password toggle with aria-label
 */

'use client'

import * as React from 'react'
import { cn } from '@/shared/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type InputType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'tel'
  | 'url'
  | 'search'

export interface FormFieldProps {
  id: string
  label: string
  type?: InputType
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  placeholder?: string
  helperText?: string
  errorMessage?: string
  required?: boolean
  disabled?: boolean
  readOnly?: boolean
  className?: string
  inputClassName?: string
}

// ---------------------------------------------------------------------------
// Shared input base classes
// ---------------------------------------------------------------------------

const inputBase =
  'w-full rounded-radius-md border bg-color-background px-spacing-3 py-spacing-2 text-base text-color-text ' +
  'placeholder:text-color-text-muted ' +
  'transition-colors duration-[var(--duration-fast)] ' +
  'focus:outline-none focus:border-color-ring focus:shadow-[var(--shadow-focus)] ' +
  'read-only:bg-color-surface-raised read-only:text-color-text-muted read-only:cursor-default ' +
  'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-color-surface-raised'

// ---------------------------------------------------------------------------
// FormField
// ---------------------------------------------------------------------------

function FormField({
  id,
  label,
  type = 'text',
  value,
  defaultValue,
  onChange,
  placeholder,
  helperText,
  errorMessage,
  required = false,
  disabled = false,
  readOnly = false,
  className,
  inputClassName,
}: FormFieldProps) {
  const [showPassword, setShowPassword] = React.useState(false)
  const helperId = helperText ? `${id}-helper` : undefined
  const errorId = errorMessage ? `${id}-error` : undefined
  const describedBy = [helperId, errorId].filter(Boolean).join(' ') || undefined

  const hasError = Boolean(errorMessage)
  const resolvedType = type === 'password' ? (showPassword ? 'text' : 'password') : type

  return (
    <div className={cn('flex flex-col gap-spacing-1', className)}>
      {/* Label */}
      <label
        htmlFor={id}
        className={cn(
          'text-sm font-medium',
          hasError ? 'text-color-error' : 'text-color-text',
        )}
      >
        {label}
        {required && (
          <span aria-hidden="true" className="ml-0.5 text-color-error">
            *
          </span>
        )}
      </label>

      {/* Input wrapper (relative for password toggle) */}
      <div className="relative">
        <input
          id={id}
          type={resolvedType}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          readOnly={readOnly}
          aria-required={required || undefined}
          aria-invalid={hasError || undefined}
          aria-describedby={describedBy}
          className={cn(
            inputBase,
            hasError
              ? 'border-color-error focus:border-color-error'
              : 'border-color-border',
            type === 'password' && 'pr-10',
            inputClassName,
          )}
        />
        {/* Password toggle */}
        {type === 'password' && (
          <button
            type="button"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-spacing-3 top-1/2 -translate-y-1/2 text-color-text-muted hover:text-color-text focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-color-ring"
            tabIndex={0}
          >
            {showPassword ? (
              // Eye-off icon
              <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
                <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            ) : (
              // Eye icon
              <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            )}
          </button>
        )}
      </div>

      {/* Helper text */}
      {helperText && !errorMessage && (
        <p id={helperId} className="text-sm text-color-text-muted">
          {helperText}
        </p>
      )}

      {/* Error message */}
      {errorMessage && (
        <p
          id={errorId}
          role="alert"
          className="flex items-center gap-spacing-1 text-sm text-color-error"
        >
          <svg className="size-4 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
          </svg>
          {errorMessage}
        </p>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Textarea variant
// ---------------------------------------------------------------------------

export interface TextareaFieldProps {
  id: string
  label: string
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  placeholder?: string
  helperText?: string
  errorMessage?: string
  required?: boolean
  disabled?: boolean
  rows?: number
  className?: string
}

function TextareaField({
  id,
  label,
  value,
  defaultValue,
  onChange,
  placeholder,
  helperText,
  errorMessage,
  required = false,
  disabled = false,
  rows = 4,
  className,
}: TextareaFieldProps) {
  const helperId = helperText ? `${id}-helper` : undefined
  const errorId = errorMessage ? `${id}-error` : undefined
  const describedBy = [helperId, errorId].filter(Boolean).join(' ') || undefined
  const hasError = Boolean(errorMessage)

  return (
    <div className={cn('flex flex-col gap-spacing-1', className)}>
      <label
        htmlFor={id}
        className={cn('text-sm font-medium', hasError ? 'text-color-error' : 'text-color-text')}
      >
        {label}
        {required && <span aria-hidden="true" className="ml-0.5 text-color-error">*</span>}
      </label>

      <textarea
        id={id}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        rows={rows}
        aria-required={required || undefined}
        aria-invalid={hasError || undefined}
        aria-describedby={describedBy}
        className={cn(
          inputBase,
          'resize-y min-h-[80px]',
          hasError ? 'border-color-error' : 'border-color-border',
        )}
      />

      {helperText && !errorMessage && (
        <p id={helperId} className="text-sm text-color-text-muted">{helperText}</p>
      )}
      {errorMessage && (
        <p id={errorId} role="alert" className="flex items-center gap-spacing-1 text-sm text-color-error">
          <svg className="size-4 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
          </svg>
          {errorMessage}
        </p>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// SelectField variant
// ---------------------------------------------------------------------------

export interface SelectOption {
  value: string
  label: string
}

export interface SelectFieldProps {
  id: string
  label: string
  options: SelectOption[]
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  placeholder?: string
  helperText?: string
  errorMessage?: string
  required?: boolean
  disabled?: boolean
  className?: string
}

function SelectField({
  id,
  label,
  options,
  value,
  defaultValue,
  onChange,
  placeholder,
  helperText,
  errorMessage,
  required = false,
  disabled = false,
  className,
}: SelectFieldProps) {
  const helperId = helperText ? `${id}-helper` : undefined
  const errorId = errorMessage ? `${id}-error` : undefined
  const describedBy = [helperId, errorId].filter(Boolean).join(' ') || undefined
  const hasError = Boolean(errorMessage)

  return (
    <div className={cn('flex flex-col gap-spacing-1', className)}>
      <label
        htmlFor={id}
        className={cn('text-sm font-medium', hasError ? 'text-color-error' : 'text-color-text')}
      >
        {label}
        {required && <span aria-hidden="true" className="ml-0.5 text-color-error">*</span>}
      </label>

      <select
        id={id}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        required={required}
        disabled={disabled}
        aria-required={required || undefined}
        aria-invalid={hasError || undefined}
        aria-describedby={describedBy}
        className={cn(
          inputBase,
          'appearance-none bg-no-repeat',
          hasError ? 'border-color-error' : 'border-color-border',
        )}
        style={{
          // Chevron SVG uses HSL fill (token: text-muted = hsl(222,14%,46%)) — no raw hex.
          backgroundImage: `url("data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"><path fill="hsl(222,14%,46%)" d="M6 8L1 3h10z"/></svg>')}")`,
          backgroundPosition: 'right 0.75rem center',
          paddingRight: '2.5rem',
        }}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {helperText && !errorMessage && (
        <p id={helperId} className="text-sm text-color-text-muted">{helperText}</p>
      )}
      {errorMessage && (
        <p id={errorId} role="alert" className="flex items-center gap-spacing-1 text-sm text-color-error">
          <svg className="size-4 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
          </svg>
          {errorMessage}
        </p>
      )}
    </div>
  )
}

FormField.displayName = 'FormField'
TextareaField.displayName = 'TextareaField'
SelectField.displayName = 'SelectField'

export { FormField, TextareaField, SelectField }
