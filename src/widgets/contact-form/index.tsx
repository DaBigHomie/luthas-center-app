/**
 * ContactFormWidget — client-side contact form.
 *
 * Posts to the /contact/submit Server Action (stub — no email backend yet).
 * Uses FormField + TextareaField primitives.
 * Shows Alert on success/error after submission.
 */

'use client'

import * as React from 'react'
import { FormField, TextareaField, Button, Alert } from '@/shared/ui'
import { submitContactForm } from './actions'

interface FormState {
  status: 'idle' | 'pending' | 'success' | 'error'
  errorMessage?: string
}

interface FieldErrors {
  name?: string
  email?: string
  subject?: string
  message?: string
}

export function ContactFormWidget() {
  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [subject, setSubject] = React.useState('')
  const [message, setMessage] = React.useState('')
  const [fieldErrors, setFieldErrors] = React.useState<FieldErrors>({})
  const [formState, setFormState] = React.useState<FormState>({ status: 'idle' })
  const alertRef = React.useRef<HTMLDivElement>(null)

  function validate(): FieldErrors {
    const errors: FieldErrors = {}
    if (!name.trim()) errors.name = 'Name is required.'
    if (!email.trim()) errors.email = 'Email is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errors.email = 'Please enter a valid email address.'
    if (!subject.trim()) errors.subject = 'Subject is required.'
    if (!message.trim()) errors.message = 'Message is required.'
    else if (message.trim().length < 10)
      errors.message = 'Message must be at least 10 characters.'
    return errors
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errors = validate()
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }
    setFieldErrors({})
    setFormState({ status: 'pending' })
    try {
      await submitContactForm({ name, email, subject, message })
      setFormState({ status: 'success' })
      setName('')
      setEmail('')
      setSubject('')
      setMessage('')
      // Move focus to success alert for screen readers
      setTimeout(() => alertRef.current?.focus(), 50)
    } catch {
      setFormState({
        status: 'error',
        errorMessage: 'Something went wrong. Please try again or email us directly.',
      })
      setTimeout(() => alertRef.current?.focus(), 50)
    }
  }

  return (
    <div id="contact-form" className="flex flex-col gap-spacing-6">
      <h2 className="font-[var(--font-heading)] font-semibold text-2xl text-color-text">
        Send a Message
      </h2>

      {formState.status === 'success' && (
        <div ref={alertRef} tabIndex={-1} className="outline-none">
          <Alert
            variant="success"
            title="Message sent!"
            message="Thank you for reaching out. We'll get back to you soon."
          />
        </div>
      )}

      {formState.status === 'error' && (
        <div ref={alertRef} tabIndex={-1} className="outline-none">
          <Alert
            variant="error"
            title="Submission failed"
            message={formState.errorMessage ?? 'Please try again.'}
          />
        </div>
      )}

      {formState.status !== 'success' && (
        <form
          onSubmit={handleSubmit}
          noValidate
          aria-labelledby="contact-form-heading"
          className="flex flex-col gap-spacing-4"
        >
          {/* Name + Email row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-spacing-4">
            <FormField
              id="contact-name"
              label="Full Name"
              type="text"
              value={name}
              onChange={setName}
              required
              errorMessage={fieldErrors.name}
              placeholder="Your name"
              inputClassName="autocomplete-name"
            />
            <FormField
              id="contact-email"
              label="Email Address"
              type="email"
              value={email}
              onChange={setEmail}
              required
              errorMessage={fieldErrors.email}
              placeholder="you@example.com"
            />
          </div>

          {/* Subject */}
          <FormField
            id="contact-subject"
            label="Subject"
            type="text"
            value={subject}
            onChange={setSubject}
            required
            errorMessage={fieldErrors.subject}
            placeholder="What's this about?"
          />

          {/* Message */}
          <TextareaField
            id="contact-message"
            label="Message"
            value={message}
            onChange={setMessage}
            required
            rows={6}
            errorMessage={fieldErrors.message}
            placeholder="Tell us how we can help…"
          />

          {/* Submit */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={formState.status === 'pending'}
            className="w-full"
          >
            Send Message
          </Button>
        </form>
      )}
    </div>
  )
}
