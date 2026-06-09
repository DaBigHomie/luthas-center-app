'use server'

/**
 * submitContactForm — stub Server Action.
 *
 * Validates required fields server-side and returns success.
 * No email backend yet.
 *
 * TODO(Resend): When ready, import Resend SDK and send a notification email:
 *   import { Resend } from 'resend'
 *   const resend = new Resend(process.env.RESEND_API_KEY)
 *   await resend.emails.send({
 *     from: 'noreply@luthascenter.damieus.app',
 *     to: process.env.CONTACT_EMAIL ?? 'info@luthascenter.org',
 *     subject: `[Contact] ${data.subject}`,
 *     text: `From: ${data.name} <${data.email}>\n\n${data.message}`,
 *   })
 *
 * TODO(DB): When contact_submissions table is migrated, insert row:
 *   import { createClient } from '@/shared/lib/supabase/server'
 *   const supabase = await createClient()
 *   await supabase.from('contact_submissions').insert({
 *     name: data.name, email: data.email,
 *     subject: data.subject, message: data.message,
 *   })
 */

export interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

export async function submitContactForm(data: ContactFormData): Promise<void> {
  // Server-side validation
  if (!data.name?.trim()) throw new Error('Name is required.')
  if (!data.email?.trim()) throw new Error('Email is required.')
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    throw new Error('Invalid email address.')
  if (!data.subject?.trim()) throw new Error('Subject is required.')
  if (!data.message?.trim()) throw new Error('Message is required.')
  if (data.message.trim().length < 10)
    throw new Error('Message must be at least 10 characters.')

  // Stub: log to console in dev; no-op in production until backend is wired.
  if (process.env.NODE_ENV === 'development') {
    console.log('[ContactForm] Submission received:', {
      name: data.name,
      email: data.email,
      subject: data.subject,
      messageLength: data.message.length,
    })
  }

  // Intentional short delay to simulate async (remove when real backend is wired).
  await new Promise<void>((resolve) => setTimeout(resolve, 400))
}
