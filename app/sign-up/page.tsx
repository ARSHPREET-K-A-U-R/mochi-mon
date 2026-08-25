'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { signUp } from '@/lib/auth-client'

function getSignupError(message?: string) {
  const normalized = message?.toLowerCase() ?? ''
  if (normalized.includes('already') || normalized.includes('exist') || normalized.includes('unique')) return 'That email is already registered. Try signing in instead.'
  if (normalized.includes('password')) return 'Use a password with at least 8 characters.'
  return 'We could not create your account. Please try again.'
}

export default function SignUpPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (isSubmitting) return
    setError('')
    setIsSubmitting(true)
    try {
      const result = await signUp.email({ name: name.trim(), email: email.trim().toLowerCase(), password })
      if (result.error) {
        setError(getSignupError(result.error.message))
        return
      }
      router.push('/')
      router.refresh()
    } catch {
      setError('The server is unavailable right now. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return <main className="auth-shell"><form className="auth-card" onSubmit={submit} aria-busy={isSubmitting}><div className="brand"><div className="brand-mark">✦</div><span>Mochi<span className="brand-accent">Mon</span></span></div><h1>Make progress cozy</h1><p>Create your account and sync every small win.</p><label>Name<input required value={name} onChange={e=>setName(e.target.value)} /></label><label>Email<input type="email" required value={email} onChange={e=>setEmail(e.target.value)} /></label><label>Password<input type="password" required minLength={8} value={password} onChange={e=>setPassword(e.target.value)} /></label>{error&&<p className="form-error" role="alert">{error}</p>}<button className="primary-button" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Creating account…' : 'Create account'}</button><a href="/sign-in">Already have an account?</a></form></main>
}
